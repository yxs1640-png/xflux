"use client";

import { SessionProvider } from "next-auth/react";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { GoogleAdsAttribution } from "@/components/analytics/google-ads-attribution";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleAdsAttribution />
      <AnalyticsProvider>
        {children}
        <FeedbackWidget />
      </AnalyticsProvider>
    </SessionProvider>
  );
}
