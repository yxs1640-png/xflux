"use client";

import {
  getGoogleAdsPurchaseConversionSendTo,
  getGoogleAdsSignupConversionSendTo,
  getPlanPurchaseValueUsd,
  isPaidPlanTierForAds,
} from "@/lib/google-ads-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const PURCHASE_DEDUPE_PREFIX = "xflux_gads_purchase:";

function hasGtmDebugParam(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("gtm_debug");
}

function fireConversion(
  sendTo: string | null,
  extra?: Record<string, string | number | boolean>
): void {
  if (!sendTo || typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", {
    send_to: sendTo,
    transport_type: "beacon",
    ...(hasGtmDebugParam() ? { debug_mode: true } : {}),
    ...extra,
  });
}

/** Fire Google Ads sign-up conversion (beacon survives page navigation). */
export function fireGoogleAdsSignupConversion(): void {
  fireConversion(getGoogleAdsSignupConversionSendTo());
}

type PurchaseConversionInput = {
  planTier: string;
  transactionId?: string | null;
  valueUsd?: number | null;
};

/** Fire Google Ads purchase conversion once per Stripe checkout / subscription id. */
export function fireGoogleAdsPurchaseConversion({
  planTier,
  transactionId,
  valueUsd,
}: PurchaseConversionInput): boolean {
  if (!isPaidPlanTierForAds(planTier)) return false;

  const sendTo = getGoogleAdsPurchaseConversionSendTo();
  if (!sendTo) return false;

  const tx = transactionId?.trim();
  if (tx) {
    const dedupeKey = `${PURCHASE_DEDUPE_PREFIX}${tx}`;
    if (sessionStorage.getItem(dedupeKey) === "1") return false;
    sessionStorage.setItem(dedupeKey, "1");
  }

  const value = valueUsd ?? getPlanPurchaseValueUsd(planTier);
  fireConversion(sendTo, {
    ...(value != null ? { value, currency: "USD" } : {}),
    ...(tx ? { transaction_id: tx } : {}),
  });
  return true;
}
