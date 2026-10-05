"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";
import {
  buildMonitorPrefillPath,
  monitorCtaHref,
  normalizeMonitorHandles,
} from "@/lib/signals/monitor-cta";

type SignalMonitorCtaProps = {
  slug: string;
  accounts: readonly string[];
  isLoggedIn: boolean;
  registerSrc: string;
  location: string;
  keywords?: string;
  title?: string;
  description?: string;
};

export function SignalMonitorCta({
  slug,
  accounts,
  isLoggedIn,
  registerSrc,
  location,
  keywords,
  title = "Monitor these accounts — hits can go to Discord or Slack",
  description = "Free includes 1 monitor. Pick the handle that moves your workflow; after it's created you can attach a Discord or Slack webhook.",
}: SignalMonitorCtaProps) {
  const handles = normalizeMonitorHandles(accounts);
  if (handles.length === 0) return null;

  const primaryHref = monitorCtaHref({
    isLoggedIn,
    registerSrc,
    accounts: handles,
    keywords,
  });
  const signInPath = buildMonitorPrefillPath(handles, undefined, keywords);

  function track(cta: string, destination: string) {
    trackClientEvent(AnalyticsEvents.CTA_CLICKED, {
      cta,
      location: `monitor_cta_${location}`,
      destination,
      topic: slug,
    });
  }

  return (
    <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-left">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">{description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {handles.map((handle) => {
              const href = monitorCtaHref({
                isLoggedIn,
                registerSrc,
                accounts: handles,
                selected: handle,
                keywords,
              });
              return (
                <Link
                  key={handle}
                  href={href}
                  onClick={() => track(`prefill_${handle}`, href)}
                  className="rounded-full border border-zinc-700 bg-zinc-950/60 px-2.5 py-1 text-xs text-sky-300 hover:border-sky-500/50 hover:text-sky-200"
                >
                  @{handle}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={primaryHref}
              onClick={() => track("monitor_these_accounts", primaryHref)}
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400"
            >
              Watch with a Monitor
            </Link>
            {!isLoggedIn && (
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(signInPath)}`}
                onClick={() =>
                  track("sign_in_monitor_prefill", `/login?callbackUrl=${signInPath}`)
                }
                className="text-sm text-zinc-500 hover:text-zinc-300"
              >
                Already have an account? Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
