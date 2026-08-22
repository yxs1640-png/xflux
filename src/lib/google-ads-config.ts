import { PLANS } from "./constants";

/** Google Ads AW- tag id, e.g. AW-18349917952 */
export function getGoogleAdsId(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
  return id && id.startsWith("AW-") ? id : null;
}

function buildSendTo(label: string | undefined | null): string | null {
  const id = getGoogleAdsId();
  const trimmed = label?.trim();
  if (!id || !trimmed) return null;
  return `${id}/${trimmed}`;
}

/** Sign-up conversion label — Google Ads → Goals → conversion action */
export function getGoogleAdsSignupConversionSendTo(): string | null {
  return buildSendTo(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL);
}

/** @deprecated Use getGoogleAdsSignupConversionSendTo */
export function getGoogleAdsConversionSendTo(): string | null {
  return getGoogleAdsSignupConversionSendTo();
}

/** Purchase / subscription conversion label (separate action in Google Ads) */
export function getGoogleAdsPurchaseConversionSendTo(): string | null {
  return buildSendTo(process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL);
}

const PAID_PLAN_IDS = new Set(["BASIC", "GROWTH", "PRO", "SCALE"]);

export function isPaidPlanTierForAds(planTier: string | null | undefined): boolean {
  return Boolean(planTier && PAID_PLAN_IDS.has(planTier));
}

/** Monthly subscription price in USD for conversion value reporting. */
export function getPlanPurchaseValueUsd(planTier: string | null | undefined): number | null {
  if (!planTier || !PAID_PLAN_IDS.has(planTier)) return null;
  const plan = PLANS.find((p) => p.id === planTier);
  return plan?.price ?? null;
}
