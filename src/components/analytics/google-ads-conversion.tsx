"use client";

import { getGoogleAdsConversionSendTo } from "@/lib/google-ads-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function hasGtmDebugParam(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("gtm_debug");
}

/** Fire Google Ads sign-up conversion (beacon survives page navigation). */
export function fireGoogleAdsSignupConversion(): void {
  const sendTo = getGoogleAdsConversionSendTo();
  if (!sendTo || typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", {
    send_to: sendTo,
    transport_type: "beacon",
    ...(hasGtmDebugParam() ? { debug_mode: true } : {}),
  });
}
