"use client";

import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";
import { useEffect } from "react";

export function BillingStatusBanner() {
  const params = useSearchParams();
  const checkout = params.get("checkout");

  useEffect(() => {
    if (checkout === "success") {
      trackClientEvent(AnalyticsEvents.CHECKOUT_COMPLETED, { via: "return_url" });
    } else if (checkout === "canceled") {
      trackClientEvent(AnalyticsEvents.CHECKOUT_CANCELED, { via: "return_url" });
    }
  }, [checkout]);

  if (checkout === "success") {
    return (
      <div
        className={cn(
          "mb-6 rounded-lg border px-4 py-3 text-sm",
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
        )}
      >
        Payment successful. Your plan will update shortly once Stripe confirms the subscription.
      </div>
    );
  }

  if (checkout === "canceled") {
    return (
      <div
        className={cn(
          "mb-6 rounded-lg border px-4 py-3 text-sm",
          "border-zinc-700 bg-zinc-800/50 text-zinc-400"
        )}
      >
        Checkout canceled. No charges were made.
      </div>
    );
  }

  return null;
}
