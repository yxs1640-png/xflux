"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";
import { fireGoogleAdsPurchaseConversion } from "@/components/analytics/google-ads-conversion";
import { getPlanPurchaseValueUsd, isPaidPlanTierForAds } from "@/lib/google-ads-config";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type SyncState = "idle" | "syncing" | "synced" | "pending" | "failed";

export function BillingStatusBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const checkout = params.get("checkout");
  const sessionId = params.get("session_id");
  const [syncState, setSyncState] = useState<SyncState>("idle");

  useEffect(() => {
    if (checkout === "success") {
      trackClientEvent(AnalyticsEvents.CHECKOUT_COMPLETED, { via: "return_url" });
    } else if (checkout === "canceled") {
      trackClientEvent(AnalyticsEvents.CHECKOUT_CANCELED, { via: "return_url" });
    }
  }, [checkout]);

  useEffect(() => {
    if (checkout !== "success") return;

    let cancelled = false;

    async function syncPlan() {
      setSyncState("syncing");
      try {
        const res = await fetch("/api/billing/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sessionId ? { sessionId } : {}),
        });
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.synced) {
          setSyncState("synced");
          if (
            data.planTier &&
            isPaidPlanTierForAds(data.planTier) &&
            typeof data.transactionId === "string"
          ) {
            fireGoogleAdsPurchaseConversion({
              planTier: data.planTier,
              transactionId: data.transactionId,
              valueUsd: getPlanPurchaseValueUsd(data.planTier),
            });
          }
          router.refresh();
          return;
        }

        setSyncState("pending");
      } catch {
        if (!cancelled) setSyncState("failed");
      }
    }

    syncPlan();
    return () => {
      cancelled = true;
    };
  }, [checkout, sessionId, router]);

  if (checkout === "success") {
    const message =
      syncState === "syncing"
        ? "Payment received — activating your plan…"
        : syncState === "synced"
          ? "Plan activated. Your quota and features are updated."
          : syncState === "failed"
            ? "Payment received, but we couldn't confirm your plan yet. Refresh in a moment or contact support."
            : "Payment successful. Your plan will update shortly once Stripe confirms the subscription.";

    return (
      <div
        className={cn(
          "mb-6 rounded-lg border px-4 py-3 text-sm flex items-start gap-2",
          syncState === "failed"
            ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
        )}
      >
        {syncState === "syncing" && <Loader2 className="h-4 w-4 animate-spin shrink-0 mt-0.5" />}
        <span>{message}</span>
      </div>
    );
  }

  if (checkout === "canceled") {
    return (
      <div
        className={cn(
          "mb-6 rounded-lg border px-4 py-3 text-sm",
          "border-zinc-700 bg-zinc-800/50 text-zinc-300"
        )}
      >
        <p className="font-medium text-white">Checkout not completed — no charges were made.</p>
        <p className="mt-1 text-zinc-400">
          Your Free plan is still active with 1,000 API calls/month. Need help choosing a plan?
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/docs/quickstart" className="text-sky-400 hover:text-sky-300">
            Quickstart docs
          </Link>
          <Link href="/feedback" className="text-sky-400 hover:text-sky-300">
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
