"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPlanDisplayName } from "@/lib/constants";
import {
  monitorLimitForPlan,
  previewMonitorPauseCount,
  type PlanChangeSummary,
} from "@/lib/plan-limits-shared";
import type { PlanTier } from "@prisma/client";

function formatEffectiveDate(iso: string | null): string {
  if (!iso) return "the end of your billing period";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AppliedPlanChangeBanner({
  summary,
  onDismiss,
  dismissing,
}: {
  summary: PlanChangeSummary;
  onDismiss: () => void;
  dismissing: boolean;
}) {
  const pausedPreview = summary.pausedMonitors
    .slice(0, 3)
    .map((m) => `@${m.targetUsername}`)
    .join(", ");
  const extraPaused =
    summary.pausedMonitors.length > 3
      ? ` +${summary.pausedMonitors.length - 3} more`
      : "";

  return (
    <div
      className={cn(
        "mb-6 rounded-lg border px-4 py-3 text-sm",
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-emerald-400">
            Plan changed to {getPlanDisplayName(summary.toPlan)}
          </p>
          <ul className="mt-2 space-y-1 text-zinc-300">
            {summary.pausedMonitors.length > 0 && (
              <li>
                Paused {summary.pausedMonitors.length} monitor
                {summary.pausedMonitors.length === 1 ? "" : "s"}
                {pausedPreview ? ` (${pausedPreview}${extraPaused})` : ""}
              </li>
            )}
            {summary.webhooksCleared > 0 && (
              <li>Removed {summary.webhooksCleared} webhook configuration(s)</li>
            )}
            {summary.intervalsAdjusted > 0 && (
              <li>Adjusted {summary.intervalsAdjusted} monitor polling interval(s)</li>
            )}
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/dashboard/monitors" className="text-sky-400 hover:text-sky-300">
              Manage monitors
            </Link>
            <Link href="/dashboard/billing" className="text-sky-400 hover:text-sky-300">
              View billing
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          disabled={dismissing}
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PendingPlanChangeBanner({
  currentPlanTier,
  pendingPlanTier,
  planChangeEffectiveAt,
  activeMonitorCount,
}: {
  currentPlanTier: PlanTier;
  pendingPlanTier: PlanTier;
  planChangeEffectiveAt: string | null;
  activeMonitorCount: number;
}) {
  const wouldPause = previewMonitorPauseCount(activeMonitorCount, pendingPlanTier);
  const newLimit = monitorLimitForPlan(pendingPlanTier);
  const clearsWebhooks = pendingPlanTier === "FREE";

  return (
    <div
      className={cn(
        "mb-6 rounded-lg border px-4 py-3 text-sm",
        "border-amber-500/20 bg-amber-500/10 text-amber-100"
      )}
    >
      <p className="font-medium text-amber-400">Downgrade scheduled</p>
      <p className="mt-2 text-zinc-300">
        Your <strong className="text-white">{getPlanDisplayName(currentPlanTier)}</strong> plan
        stays active until <strong className="text-white">{formatEffectiveDate(planChangeEffectiveAt)}</strong>.
        Then it will change to <strong className="text-white">{getPlanDisplayName(pendingPlanTier)}</strong>.
      </p>
      <ul className="mt-2 space-y-1 text-zinc-400">
        <li>
          Until then you can keep using all {activeMonitorCount} active monitor
          {activeMonitorCount === 1 ? "" : "s"}.
        </li>
        {wouldPause > 0 && (
          <li>
            At that time, {wouldPause} monitor{wouldPause === 1 ? "" : "s"} will be paused (limit
            becomes {newLimit}).
          </li>
        )}
        {clearsWebhooks && <li>Webhooks will be removed on the Free plan.</li>}
      </ul>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link href="/dashboard/monitors">
          <Button size="sm" variant="outline">
            Manage monitors
          </Button>
        </Link>
        <Link href="/dashboard/billing">
          <Button size="sm" variant="ghost">
            Billing
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function PlanChangeBanner({
  currentPlanTier,
  pendingPlanTier,
  planChangeEffectiveAt,
  lastPlanChangeSummary,
  bannerDismissed,
  activeMonitorCount,
}: {
  currentPlanTier: PlanTier;
  pendingPlanTier: PlanTier | null;
  planChangeEffectiveAt: string | null;
  lastPlanChangeSummary: PlanChangeSummary | null;
  bannerDismissed: boolean;
  activeMonitorCount: number;
}) {
  const router = useRouter();
  const [dismissing, setDismissing] = useState(false);

  async function dismissAppliedBanner() {
    setDismissing(true);
    await fetch("/api/user/plan-banner", { method: "POST" });
    setDismissing(false);
    router.refresh();
  }

  if (pendingPlanTier) {
    return (
      <PendingPlanChangeBanner
        currentPlanTier={currentPlanTier}
        pendingPlanTier={pendingPlanTier}
        planChangeEffectiveAt={planChangeEffectiveAt}
        activeMonitorCount={activeMonitorCount}
      />
    );
  }

  if (lastPlanChangeSummary && !bannerDismissed) {
    return (
      <AppliedPlanChangeBanner
        summary={lastPlanChangeSummary}
        onDismiss={dismissAppliedBanner}
        dismissing={dismissing}
      />
    );
  }

  return null;
}
