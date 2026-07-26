"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fires a Google Ads conversion once (e.g. register page view). */
export function GoogleAdsConversion() {
  useEffect(() => {
    const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
    const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
    if (!adsId || !label) return;

    const sendTo = `${adsId}/${label}`;

    const fire = () => {
      if (typeof window.gtag !== "function") return false;
      window.gtag("event", "conversion", { send_to: sendTo });
      return true;
    };

    if (fire()) return;

    const timer = window.setInterval(() => {
      if (fire()) window.clearInterval(timer);
    }, 500);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
