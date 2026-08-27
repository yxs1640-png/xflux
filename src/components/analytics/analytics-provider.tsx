"use client";

import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { identifyClient, initPostHogClient, isAnalyticsEnabled } from "@/lib/analytics/client";
import { PageViewTracker } from "./page-view-tracker";

function AnalyticsIdentity() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;
    identifyClient(session.user.id, {
      email: session.user.email ?? undefined,
      name: session.user.name ?? undefined,
      plan_tier: session.user.planTier,
    });
  }, [session?.user?.id, session?.user?.email, session?.user?.name, session?.user?.planTier]);

  return null;
}

function AnalyticsCore({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <AnalyticsIdentity />
      {children}
    </>
  );
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHogClient();
  }, []);

  if (!isAnalyticsEnabled()) {
    return <AnalyticsCore>{children}</AnalyticsCore>;
  }

  return (
    <PostHogProvider client={posthog}>
      <AnalyticsCore>{children}</AnalyticsCore>
    </PostHogProvider>
  );
}
