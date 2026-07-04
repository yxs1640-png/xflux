import "server-only";

import { PlanTier } from "@prisma/client";
import type Stripe from "stripe";
import { applyPlanToUser, resetUserToFree } from "./billing";
import { planTierFromPriceId } from "./stripe-plans";

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
  if (meta === "BASIC" || meta === "PRO") return meta;

  return null;
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  fallbackUserId?: string
) {
  const userId = subscription.metadata?.userId || fallbackUserId;
  if (!userId) return;

  const status = subscription.status;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (status === "canceled" || status === "unpaid" || status === "incomplete_expired") {
    await resetUserToFree(userId);
    return;
  }

  const planTier = planFromSubscription(subscription);
  if (!planTier) return;

  await applyPlanToUser(userId, planTier, {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceIdFromSubscription(subscription),
    subscriptionStatus: status,
    subscriptionPeriodEnd: periodEnd(subscription),
  });
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
      if (userId) await resetUserToFree(userId);
      break;
    }

    default:
      break;
  }
}
