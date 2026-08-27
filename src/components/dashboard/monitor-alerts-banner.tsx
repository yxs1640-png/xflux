"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Loader2, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AlertHit = {
  id: string;
  text: string;
  authorUsername: string;
  targetUsername: string;
  detectedAt: string;
};

type MonitorAlertsBannerProps = {
  initialUnreadCount: number;
  initialHits: AlertHit[];
  canWebhook: boolean;
};

const POLL_MS = 45_000;

export function MonitorAlertsBanner({
  initialUnreadCount,
  initialHits,
  canWebhook,
}: MonitorAlertsBannerProps) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [hits, setHits] = useState(initialHits);
  const [dismissed, setDismissed] = useState(initialUnreadCount === 0);
  const [marking, setMarking] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/monitor-alerts");
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
      setHits(data.hits ?? []);
      if (data.unreadCount > 0) setDismissed(false);
    } catch {
      // ignore poll errors
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const tick = () => {
      if (document.visibilityState === "visible") refresh();
    };

    const id = window.setInterval(tick, POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  async function markRead() {
    setMarking(true);
    try {
      await fetch("/api/dashboard/monitor-alerts", { method: "POST" });
      setUnreadCount(0);
      setHits([]);
      setDismissed(true);
    } finally {
      setMarking(false);
    }
  }

  if (dismissed || unreadCount === 0) return null;

  const headline =
    unreadCount === 1
      ? "1 new tweet from your monitors"
      : `${unreadCount} new tweets from your monitors`;

  return (
    <div
      className={cn(
        "mb-6 rounded-xl border px-4 py-4",
        "border-sky-500/30 bg-gradient-to-r from-sky-500/10 to-zinc-950/40"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/20">
            <Bell className="h-4 w-4 text-sky-400" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white">{headline}</p>
            <ul className="mt-2 space-y-2">
              {hits.slice(0, 3).map((hit) => (
                <li key={hit.id} className="text-sm border-l-2 border-sky-500/40 pl-3">
                  <span className="text-sky-400">@{hit.targetUsername}</span>
                  <span className="text-zinc-500 mx-1">·</span>
                  <span className="text-zinc-500 text-xs">
                    {new Date(hit.detectedAt).toLocaleString()}
                  </span>
                  <p className="text-zinc-300 line-clamp-2 mt-0.5">{hit.text}</p>
                </li>
              ))}
            </ul>
            {unreadCount > hits.length && (
              <p className="mt-2 text-xs text-zinc-500">
                +{unreadCount - hits.length} more in Monitors
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/dashboard/monitors">
                <Button size="sm">View all hits</Button>
              </Link>
              <Button size="sm" variant="outline" onClick={markRead} disabled={marking}>
                {marking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark as read"}
              </Button>
            </div>
            {!canWebhook && (
              <p className="mt-3 text-xs text-zinc-400 flex items-start gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Free plan: test webhooks in Monitors.{" "}
                  <Link href="/dashboard/billing" className="text-sky-400 hover:text-sky-300">
                    Starter ($19/mo)
                  </Link>{" "}
                  adds live hit delivery and faster polling.
                </span>
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={markRead}
          disabled={marking}
          className="shrink-0 text-zinc-500 hover:text-zinc-300 p-1"
          aria-label="Dismiss alerts"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
