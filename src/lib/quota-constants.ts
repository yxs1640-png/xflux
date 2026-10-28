import { PlanTier } from "@prisma/client";

/** Safe for client + server — no DB imports. */
export const PLAN_LIMITS: Record<PlanTier, number> = {
  FREE: 1_000,
  BASIC: 150_000,
  GROWTH: 500_000,
  PRO: 1_200_000,
  SCALE: 4_000_000,
  ENTERPRISE: 4_000_000,
};

/** Free plan before email verification — still no credit card. */
export const UNVERIFIED_FREE_QUOTA = 50;

export function getEffectiveApiQuotaLimit(user: {
  planTier: PlanTier;
  emailVerifiedAt?: Date | null;
}): number {
  const planLimit = PLAN_LIMITS[user.planTier];
  if (user.planTier === "FREE" && !user.emailVerifiedAt) {
    return Math.min(planLimit, UNVERIFIED_FREE_QUOTA);
  }
  return planLimit;
}
