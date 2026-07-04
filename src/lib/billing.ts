import "server-only";

import { PlanTier } from "@prisma/client";
import { prisma } from "./db";
import { PLAN_LIMITS } from "./quota";

export interface StripeSubscriptionSnapshot {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  subscriptionStatus?: string | null;
  subscriptionPeriodEnd?: Date | null;
}

export async function applyPlanToUser(
  userId: string,
  planTier: PlanTier,
  stripe?: StripeSubscriptionSnapshot
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      planTier,
      quotaLimit: PLAN_LIMITS[planTier],
      ...(stripe
        ? {
            stripeCustomerId: stripe.stripeCustomerId ?? undefined,
            stripeSubscriptionId: stripe.stripeSubscriptionId ?? undefined,
            stripePriceId: stripe.stripePriceId ?? undefined,
            subscriptionStatus: stripe.subscriptionStatus ?? undefined,
            subscriptionPeriodEnd: stripe.subscriptionPeriodEnd ?? undefined,
          }
        : {}),
    },
    select: {
      id: true,
      planTier: true,
      quotaLimit: true,
      subscriptionStatus: true,
    },
  });
}

export async function resetUserToFree(userId: string) {
  return applyPlanToUser(userId, PlanTier.FREE, {
    stripeSubscriptionId: null,
    stripePriceId: null,
    subscriptionStatus: "canceled",
    subscriptionPeriodEnd: null,
  });
}

export function isActiveSubscriptionStatus(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}
