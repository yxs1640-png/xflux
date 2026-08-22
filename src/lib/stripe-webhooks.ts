import "server-only";

import { PlanTier } from "@prisma/client";
import type Stripe from "stripe";
import {
  applyPlanImmediately,
  applyPendingPlanChange,
  clearPendingPlanChange,
  isPlanDowngrade,
  isPlanUpgrade,
  maybeApplyPendingPlanChange,
  resetUserToFree,
  schedulePlanDowngrade,
} from "./billing";
import { planTierFromPriceId } from "./stripe-plans";
import { AnalyticsEvents } from "./analytics/events";
import { identifyServerUser, trackServerEvent } from "./analytics/server";
import { prisma } from "./db";

function periodEnd(subscription: Stripe.Subscription): Date | null {
  const end = subscription.current_period_end;
  return end ? new Date(end * 1000) : null;
}

function priceIdFromSubscription(subscription: Stripe.Subscription): string | null {
  return subscription.items.data[0]?.price?.id ?? null;
}

function planFromSubscription(subscription: Stripe.Subscription): PlanTier | null {
  const fromPrice = planTierFromPriceId(priceIdFromSubscription(subscription));
  if (fromPrice) return fromPrice;

  const meta = subscription.metadata?.planTier;
  if (meta === "BASIC" || meta === "GROWTH" || meta === "PRO" || meta === "SCALE") return meta;

  return null;
}

function stripeSnapshot(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  return {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceIdFromSubscription(subscription),
    subscriptionStatus: subscription.status,
    subscriptionPeriodEnd: periodEnd(subscription),
  };
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  fallbackUserId?: string
) {
  const userId = subscription.metadata?.userId || fallbackUserId;
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planTier: true, pendingPlanTier: true },
  });
  if (!user) return;

  const status = subscription.status;
  const snapshot = stripeSnapshot(subscription);
  const periodEndDate = snapshot.subscriptionPeriodEnd;

  if (status === "canceled" || status === "unpaid" || status === "incomplete_expired") {
    await resetUserToFree(userId, {
      ...snapshot,
      subscriptionStatus: status,
    });
    await trackServerEvent(userId, AnalyticsEvents.SUBSCRIPTION_CANCELED, {
      previous_plan_id: user.planTier,
      subscription_status: status,
    });
    return;
  }

  if (subscription.cancel_at_period_end) {
    await schedulePlanDowngrade(userId, PlanTier.FREE, periodEndDate, snapshot);
    await maybeApplyPendingPlanChange(userId);
    await trackServerEvent(userId, AnalyticsEvents.SUBSCRIPTION_UPDATED, {
      plan_id: user.planTier,
      pending_plan_id: PlanTier.FREE,
      subscription_status: status,
      via: "stripe_webhook_cancel_scheduled",
    });
    return;
  }

  if (user.pendingPlanTier === PlanTier.FREE) {
    await clearPendingPlanChange(userId);
  }

  const newPlanTier = planFromSubscription(subscription);
  if (!newPlanTier) {
    await prisma.user.update({
      where: { id: userId },
      data: snapshot,
    });
    await maybeApplyPendingPlanChange(userId);
    return;
  }

  if (isPlanDowngrade(user.planTier, newPlanTier)) {
    await schedulePlanDowngrade(userId, newPlanTier, periodEndDate, snapshot);
    await maybeApplyPendingPlanChange(userId);
    await trackServerEvent(userId, AnalyticsEvents.SUBSCRIPTION_UPDATED, {
      plan_id: user.planTier,
      pending_plan_id: newPlanTier,
      subscription_status: status,
      via: "stripe_webhook_downgrade_scheduled",
    });
    return;
  }

  if (isPlanUpgrade(user.planTier, newPlanTier)) {
    await applyPlanImmediately(userId, newPlanTier, snapshot);
    await identifyServerUser(userId, { plan_tier: newPlanTier });
    await trackServerEvent(userId, AnalyticsEvents.SUBSCRIPTION_UPDATED, {
      plan_id: newPlanTier,
      subscription_status: status,
      via: "stripe_webhook",
    });
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: snapshot,
  });
  await maybeApplyPendingPlanChange(userId);
  await trackServerEvent(userId, AnalyticsEvents.SUBSCRIPTION_UPDATED, {
    plan_id: newPlanTier,
    subscription_status: status,
    via: "stripe_webhook",
  });
}

export { syncSubscription };

export async function syncUserBillingFromStripe(
  userId: string,
  checkoutSessionId?: string | null
): Promise<{
  synced: boolean;
  planTier?: PlanTier;
  subscriptionStatus?: string | null;
  transactionId?: string;
  reason?: string;
}> {
  const stripe = (await import("./stripe")).getStripe();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, planTier: true },
  });
  if (!user) return { synced: false, reason: "user_not_found" };

  async function applySubscription(subscription: Stripe.Subscription) {
    const meta = { ...subscription.metadata, userId };
    subscription.metadata = meta;
    await syncSubscription(subscription, userId);
    const updated = await prisma.user.findUnique({
      where: { id: userId },
      select: { planTier: true, subscriptionStatus: true },
    });
    return {
      synced: true,
      planTier: updated?.planTier,
      subscriptionStatus: updated?.subscriptionStatus,
      transactionId: subscription.id,
    };
  }

  if (checkoutSessionId) {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    const sessionCustomer =
      typeof session.customer === "string" ? session.customer : session.customer?.id;

    if (sessionCustomer && sessionCustomer !== user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: sessionCustomer },
      });
    }

    if (session.mode === "subscription" && session.payment_status === "paid") {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        if (session.metadata?.planTier) {
          subscription.metadata = {
            ...subscription.metadata,
            userId,
            planTier: session.metadata.planTier,
          };
        }
        const result = await applySubscription(subscription);
        return {
          ...result,
          transactionId: checkoutSessionId ?? result.transactionId,
        };
      }
    }
  }

  const customerId = user.stripeCustomerId;
  if (!customerId) return { synced: false, reason: "no_stripe_customer" };

  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });

  const active = subs.data.find((s) => s.status === "active" || s.status === "trialing");
  if (active) {
    return applySubscription(active);
  }

  return { synced: false, reason: "no_active_subscription" };
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const userId = session.metadata?.userId;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!userId || !subscriptionId) break;

      const stripe = (await import("./stripe")).getStripe();
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      subscription.metadata.userId = userId;
      if (session.metadata?.planTier) {
        subscription.metadata.planTier = session.metadata.planTier;
      }
      await syncSubscription(subscription, userId);
      await trackServerEvent(userId, AnalyticsEvents.CHECKOUT_COMPLETED, {
        plan_id: session.metadata?.planTier,
        checkout_session_id: session.id,
      });
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        const existing = await prisma.user.findUnique({
          where: { id: userId },
          select: { planTier: true },
        });

        await resetUserToFree(userId);

        await trackServerEvent(userId, AnalyticsEvents.SUBSCRIPTION_CANCELED, {
          previous_plan_id: existing?.planTier,
          via: "subscription_deleted",
        });
      }
      break;
    }

    default:
      break;
  }
}
