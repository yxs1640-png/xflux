"use client";

import posthog from "posthog-js";
import type { AnalyticsEventName, AnalyticsPersonProperties } from "./events";

let posthogInitialized = false;

export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim());
}

export function initPostHogClient(): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key || typeof window === "undefined" || posthogInitialized) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
  });
  posthogInitialized = true;
}

export function trackClientEvent(
  event: AnalyticsEventName,
  properties?: Record<string, unknown>
): void {
  if (!isAnalyticsEnabled()) return;
  posthog.capture(event, properties);
}

export function identifyClient(
  distinctId: string,
  properties?: AnalyticsPersonProperties
): void {
  if (!isAnalyticsEnabled()) return;
  posthog.identify(distinctId, properties);
}

export function capturePageView(url: string): void {
  if (!isAnalyticsEnabled()) return;
  posthog.capture("$pageview", { $current_url: url });
}

export function resetAnalyticsIdentity(): void {
  if (!isAnalyticsEnabled()) return;
  posthog.reset();
}
