import { PlanTier } from "@prisma/client";

export const PAID_PLAN_TIERS = ["BASIC", "PRO"] as const;
export type PaidPlanTier = (typeof PAID_PLAN_TIERS)[number];

const PRICE_ENV: Record<PaidPlanTier, string> = {
  BASIC: "STRIPE_PRICE_BASIC",
  PRO: "STRIPE_PRICE_PRO",
};

export function getStripePriceId(planTier: PaidPlanTier): string | null {
  const envKey = PRICE_ENV[planTier];
  const priceId = process.env[envKey]?.trim();
  return priceId && priceId.startsWith("price_") ? priceId : null;
}

export function planTierFromPriceId(priceId: string | null | undefined): PlanTier | null {
  if (!priceId) return null;

  for (const tier of PAID_PLAN_TIERS) {
    const configured = getStripePriceId(tier);
    if (configured && configured === priceId) return tier;
  }

  return null;
}

export function isPaidPlanTier(planId: string): planId is PaidPlanTier {
  return PAID_PLAN_TIERS.includes(planId as PaidPlanTier);
}

export function stripePlansConfigured(): boolean {
  return PAID_PLAN_TIERS.every((tier) => Boolean(getStripePriceId(tier)));
}
