import "server-only";

import { PlanTier } from "@prisma/client";
import { prisma } from "./db";

/** Starter (BASIC) Checkout trial length — no new Stripe env vars required. */
export const STARTER_TRIAL_DAYS = 30;

type TrialEligibilityFields = {
  planTier: PlanTier;
  subscriptionStatus: string | null;
  starterTrialUsedAt: Date | null;
};

/** Free users who have never started a paid sub or Starter trial. */
export function isStarterTrialEligible(user: TrialEligibilityFields): boolean {
  if (user.starterTrialUsedAt) return false;
  if (user.planTier !== PlanTier.FREE) return false;
  if (user.subscriptionStatus === "trialing" || user.subscriptionStatus === "active") {
    return false;
  }
  return true;
}

export async function markStarterTrialUsed(userId: string): Promise<void> {
  await prisma.user.updateMany({
    where: { id: userId, starterTrialUsedAt: null },
    data: { starterTrialUsedAt: new Date() },
  });
}
