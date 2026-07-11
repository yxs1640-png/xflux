import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  applyPlanToUser,
  isActiveSubscriptionStatus,
} from "@/lib/billing";
import { getAppBaseUrl, getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  getStripePriceId,
  isPaidPlanTier,
  type PaidPlanTier,
} from "@/lib/stripe-plans";
import { PLAN_LIMITS } from "@/lib/quota";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackServerEvent } from "@/lib/analytics/server";

function checkoutErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "type" in err && (err as { type?: string }).type?.startsWith("Stripe")) {
    const stripeErr = err as { message?: string };
    return stripeErr.message || "Stripe checkout failed";
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return "Checkout failed";
}

function subscriptionPeriodEnd(subscription: { current_period_end?: number | null; items?: { data?: Array<{ current_period_end?: number | null }> } }): Date | null {
  const end =
    subscription.current_period_end ??
    subscription.items?.data?.[0]?.current_period_end ??
    null;
  return end ? new Date(end * 1000) : null;
}

const schema = z.object({
  planId: z.enum(["BASIC", "GROWTH", "PRO", "SCALE"]),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured on this server" },
      { status: 503 }
    );
  }

  try {
    const { planId } = schema.parse(await request.json());
    if (!isPaidPlanTier(planId)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = getStripePriceId(planId as PaidPlanTier);
    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price is not configured for ${planId}` },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripe = getStripe();
    const baseUrl = getAppBaseUrl();

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    if (
      user.stripeSubscriptionId &&
      isActiveSubscriptionStatus(user.subscriptionStatus)
    ) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const itemId = subscription.items.data[0]?.id;
      if (!itemId) {
        return NextResponse.json({ error: "Subscription item not found" }, { status: 500 });
      }

      const updated = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        items: [{ id: itemId, price: priceId }],
        proration_behavior: "create_prorations",
        metadata: { userId: user.id, planTier: planId },
      });

      await applyPlanToUser(user.id, planId, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: updated.id,
        stripePriceId: priceId,
        subscriptionStatus: updated.status,
        subscriptionPeriodEnd: subscriptionPeriodEnd(updated),
      });

      await trackServerEvent(user.id, AnalyticsEvents.SUBSCRIPTION_UPDATED, {
        plan_id: planId,
        subscription_status: updated.status,
        via: "checkout_existing_subscription",
      });

      return NextResponse.json({
        success: true,
        updated: true,
        planTier: planId,
        quotaLimit: PLAN_LIMITS[planId],
      });
    }

    const checkout = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${baseUrl}/dashboard/billing?checkout=canceled`,
      subscription_data: {
        metadata: { userId: user.id, planTier: planId },
      },
      metadata: { userId: user.id, planTier: planId },
    });

    if (!checkout.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    await trackServerEvent(user.id, AnalyticsEvents.CHECKOUT_STARTED, {
      plan_id: planId,
      checkout_session_id: checkout.id,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    console.error("[billing/checkout]", err);
    return NextResponse.json({ error: checkoutErrorMessage(err) }, { status: 500 });
  }
}
