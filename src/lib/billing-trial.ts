import "server-only";

import { PlanTier } from "@prisma/client";
import { prisma } from "./db";
import {
  isStarterTrialOfferActive,
  STARTER_TRIAL_DAYS,
} from "./starter-trial-offer";

export { STARTER_TRIAL_DAYS, isStarterTrialOfferActive };

type TrialEligibilityFields = {
  planTier: PlanTier;
  subscriptionStatus: string | null;
  starterTrialUsedAt: Date | null;
};

/**
 * Free users who can receive the limited-time Starter trial on Checkout.
 * False when the offer is off, or the user already used a trial / paid sub.
 */
export function isStarterTrialEligible(user: TrialEligibilityFields): boolean {
  if (!isStarterTrialOfferActive()) return false;
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
