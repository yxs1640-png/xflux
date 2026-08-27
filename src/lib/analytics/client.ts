"use client";

import posthog from "posthog-js";
import type { AnalyticsEventName, AnalyticsPersonProperties } from "./events";
import { getPostHogHost, getPostHogKey } from "./posthog-config";
import { getClientSessionId, sendAnalyticsBeacon } from "./session-client";

let posthogInitialized = false;

export function isAnalyticsEnabled(): boolean {
  return Boolean(getPostHogKey());
}

export function initPostHogClient(): void {
  const key = getPostHogKey();
  if (!key || typeof window === "undefined" || posthogInitialized) return;

  posthog.init(key, {
    api_host: getPostHogHost(),
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
  sendAnalyticsBeacon({
    type: "event",
    event,
    sessionId: getClientSessionId(),
    path: typeof window !== "undefined" ? window.location.pathname : undefined,
    properties,
  });

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
  const path = url.split("?")[0] || "/";
  sendAnalyticsBeacon({
    type: "pageview",
    path,
    sessionId: getClientSessionId(),
  });

  if (!isAnalyticsEnabled()) return;
  posthog.capture("$pageview", { $current_url: url });
}

export function resetAnalyticsIdentity(): void {
  if (!isAnalyticsEnabled()) return;
  posthog.reset();
}
