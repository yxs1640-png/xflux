import "server-only";

import { PlanTier, Prisma } from "@prisma/client";
import { prisma } from "./db";
import {
  enforcePlanLimits,
  isPlanDowngrade,
  isPlanUpgrade,
  type PlanChangeSummary,
} from "./plan-limits";
import { PLAN_LIMITS } from "./quota";

export interface StripeSubscriptionSnapshot {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  subscriptionStatus?: string | null;
  subscriptionPeriodEnd?: Date | null;
}

function stripeData(stripe?: StripeSubscriptionSnapshot) {
  if (!stripe) return {};
  return {
    stripeCustomerId: stripe.stripeCustomerId ?? undefined,
    stripeSubscriptionId: stripe.stripeSubscriptionId ?? undefined,
    stripePriceId: stripe.stripePriceId ?? undefined,
    subscriptionStatus: stripe.subscriptionStatus ?? undefined,
    subscriptionPeriodEnd: stripe.subscriptionPeriodEnd ?? undefined,
  };
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
      ...stripeData(stripe),
    },
    select: {
      id: true,
      planTier: true,
      quotaLimit: true,
      subscriptionStatus: true,
    },
  });
}

export async function clearPendingPlanChange(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      pendingPlanTier: null,
      planChangeEffectiveAt: null,
    },
  });
}

export async function schedulePlanDowngrade(
  userId: string,
  pendingPlanTier: PlanTier,
  effectiveAt: Date | null,
  stripe?: StripeSubscriptionSnapshot
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      pendingPlanTier,
      planChangeEffectiveAt: effectiveAt,
      ...stripeData(stripe),
    },
    select: {
      id: true,
      planTier: true,
      pendingPlanTier: true,
      planChangeEffectiveAt: true,
    },
  });
}

export async function applyPlanImmediately(
  userId: string,
  planTier: PlanTier,
  stripe?: StripeSubscriptionSnapshot
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      planTier,
      quotaLimit: PLAN_LIMITS[planTier],
      pendingPlanTier: null,
      planChangeEffectiveAt: null,
      ...stripeData(stripe),
    },
    select: {
      id: true,
      planTier: true,
      quotaLimit: true,
      subscriptionStatus: true,
    },
  });
}

export async function applyPendingPlanChange(
  userId: string
): Promise<PlanChangeSummary | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      planTier: true,
      pendingPlanTier: true,
      planChangeEffectiveAt: true,
    },
  });

  if (!user?.pendingPlanTier) return null;
  if (user.planChangeEffectiveAt && new Date() < user.planChangeEffectiveAt) {
    return null;
  }

  const newTier = user.pendingPlanTier;
  const summary = await enforcePlanLimits(userId, newTier, user.planTier);

  await prisma.user.update({
    where: { id: userId },
    data: {
      planTier: newTier,
      quotaLimit: PLAN_LIMITS[newTier],
      pendingPlanTier: null,
      planChangeEffectiveAt: null,
      lastPlanChangeSummary: summary as unknown as Prisma.InputJsonValue,
      planChangeBannerDismissedAt: null,
    },
  });

  return summary;
}

export async function maybeApplyPendingPlanChange(
  userId: string
): Promise<PlanChangeSummary | null> {
  return applyPendingPlanChange(userId);
}

export async function resetUserToFree(
  userId: string,
  stripe?: StripeSubscriptionSnapshot
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planTier: true },
  });
  if (!user) return null;

  const summary = await enforcePlanLimits(userId, PlanTier.FREE, user.planTier);

  return prisma.user.update({
    where: { id: userId },
    data: {
      planTier: PlanTier.FREE,
      quotaLimit: PLAN_LIMITS.FREE,
      pendingPlanTier: null,
      planChangeEffectiveAt: null,
      lastPlanChangeSummary: summary as unknown as Prisma.InputJsonValue,
      planChangeBannerDismissedAt: null,
      stripeSubscriptionId: stripe?.stripeSubscriptionId ?? null,
      stripePriceId: stripe?.stripePriceId ?? null,
      subscriptionStatus: stripe?.subscriptionStatus ?? "canceled",
      subscriptionPeriodEnd: stripe?.subscriptionPeriodEnd ?? null,
      ...(stripe?.stripeCustomerId !== undefined
        ? { stripeCustomerId: stripe.stripeCustomerId ?? undefined }
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

export async function applyMockPlanChange(userId: string, planTier: PlanTier) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planTier: true },
  });
  if (!user) return null;

  if (isPlanDowngrade(user.planTier, planTier)) {
    const summary = await enforcePlanLimits(userId, planTier, user.planTier);
    return prisma.user.update({
      where: { id: userId },
      data: {
        planTier,
        quotaLimit: PLAN_LIMITS[planTier],
        pendingPlanTier: null,
        planChangeEffectiveAt: null,
        lastPlanChangeSummary: summary as unknown as Prisma.InputJsonValue,
        planChangeBannerDismissedAt: null,
      },
      select: { id: true, planTier: true, quotaLimit: true },
    });
  }

  return applyPlanImmediately(userId, planTier);
}

export function isActiveSubscriptionStatus(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}

export { isPlanDowngrade, isPlanUpgrade };
