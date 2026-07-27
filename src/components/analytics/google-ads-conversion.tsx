"use client";

import { getGoogleAdsConversionSendTo } from "@/lib/google-ads-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire Google Ads sign-up conversion after /api/register succeeds. */
export function fireGoogleAdsSignupConversion(): void {
  const sendTo = getGoogleAdsConversionSendTo();
  if (!sendTo || typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", { send_to: sendTo });
}
