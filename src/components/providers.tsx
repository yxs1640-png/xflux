"use client";

import { SessionProvider } from "next-auth/react";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { GoogleAdsAttribution } from "@/components/analytics/google-ads-attribution";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleAdsAttribution />
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </SessionProvider>
  );
}
