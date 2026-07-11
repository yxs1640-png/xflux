import "server-only";

import { PostHog } from "posthog-node";
import type { AnalyticsEventName, AnalyticsPersonProperties } from "./events";

let posthogServer: PostHog | null = null;

function getServerPostHog(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return null;

  if (!posthogServer) {
    posthogServer = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogServer;
}

export function isServerAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim());
}

export async function trackServerEvent(
  distinctId: string,
  event: AnalyticsEventName,
  properties?: Record<string, unknown>
): Promise<void> {
  try {
    const ph = getServerPostHog();
    if (!ph) return;

    ph.capture({
      distinctId,
      event,
      properties,
    });
    await ph.flush();
  } catch (err) {
    console.error("[analytics] trackServerEvent failed:", err);
  }
}

export async function identifyServerUser(
  distinctId: string,
  properties?: AnalyticsPersonProperties
): Promise<void> {
  try {
    const ph = getServerPostHog();
    if (!ph) return;

    ph.identify({
      distinctId,
      properties,
    });
    await ph.flush();
  } catch (err) {
    console.error("[analytics] identifyServerUser failed:", err);
  }
}
