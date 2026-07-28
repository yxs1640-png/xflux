"use client";

import { getGoogleAdsConversionSendTo } from "@/lib/google-ads-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CONVERSION_TIMEOUT_MS = 500;

/** Fire Google Ads sign-up conversion; resolves after beacon sends or timeout. */
export function fireGoogleAdsSignupConversion(): Promise<void> {
  const sendTo = getGoogleAdsConversionSendTo();
  if (!sendTo || typeof window.gtag !== "function") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    window.gtag!("event", "conversion", {
      send_to: sendTo,
      event_callback: done,
    });

    window.setTimeout(done, CONVERSION_TIMEOUT_MS);
  });
}
