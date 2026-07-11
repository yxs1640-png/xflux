"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";

interface Plan {
  id: string;
  name: string;
  price: number;
  quota: string;
  monitors: number;
  features: readonly string[];
  cta: string;
  highlighted: boolean;
}

interface PlanSelectorProps {
  plans: readonly Plan[];
  currentPlanId: string;
  stripeEnabled: boolean;
  stripeConfigured: boolean;
  hasActiveSubscription: boolean;
}

export function PlanSelector({
  plans,
  currentPlanId,
  stripeEnabled,
  stripeConfigured,
  hasActiveSubscription,
}: PlanSelectorProps) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const planOrder = ["FREE", "BASIC", "GROWTH", "PRO", "SCALE", "ENTERPRISE"];
  const currentIndex = planOrder.indexOf(currentPlanId);

  async function openPortal() {
    setLoadingPlan("portal");
    setMessage(null);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    setLoadingPlan(null);

    if (!res.ok || !data.url) {
      setMessage({ type: "error", text: data.error || "Failed to open billing portal" });
      return;
    }

    window.location.href = data.url;
  }

  async function mockUpgrade(planId: string, planName: string) {
    const res = await fetch("/api/subscription/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Upgrade failed" });
      return;
    }

    setMessage({ type: "success", text: `Successfully switched to ${planName} plan.` });
    router.refresh();
  }

  async function startCheckout(planId: string) {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Checkout failed" });
      return;
    }

    if (data.updated) {
      setMessage({ type: "success", text: "Plan updated successfully." });
      router.refresh();
      return;
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setMessage({ type: "error", text: "Checkout failed" });
  }

  async function handleSelect(plan: Plan) {
    if (plan.id === currentPlanId) return;

    const action =
      plan.id === "FREE" && hasActiveSubscription
        ? "cancel_via_portal"
        : planOrder.indexOf(plan.id) < currentIndex
          ? "downgrade"
          : "upgrade";

    trackClientEvent(AnalyticsEvents.PLAN_SELECTED, {
      plan_id: plan.id,
      plan_name: plan.name,
      action,
      current_plan_id: currentPlanId,
    });

    setLoadingPlan(plan.id);
    setMessage(null);

    try {
      if (plan.id === "FREE") {
        if (hasActiveSubscription && stripeEnabled) {
          await openPortal();
          return;
        }
        if (!stripeEnabled) {
          await mockUpgrade(plan.id, plan.name);
        }
        return;
      }

      if (stripeConfigured) {
        if (!stripeEnabled) {
          setMessage({
            type: "error",
            text: "Stripe price IDs are missing. Run npm run stripe:bootstrap and restart the dev server.",
          });
          return;
        }
        await startCheckout(plan.id);
      } else {
        await mockUpgrade(plan.id, plan.name);
      }
    } finally {
      setLoadingPlan(null);
    }
  }

  function getButtonLabel(plan: Plan, index: number) {
    if (plan.id === currentPlanId) return "Current Plan";
    if (plan.id === "FREE" && hasActiveSubscription && stripeEnabled) return "Cancel via portal";
    if (index < currentIndex) return `Switch to ${plan.name}`;
    return stripeEnabled ? plan.cta : `Switch to ${plan.name}`;
  }

  return (
    <div>
      {message && (
        <div
          className={cn(
            "mb-6 rounded-lg border px-4 py-3 text-sm",
            message.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          )}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {plans.map((plan, index) => {
          const isCurrent = plan.id === currentPlanId;
          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-xl border bg-zinc-900/50 p-6 flex flex-col",
                isCurrent && "border-sky-500/50 ring-1 ring-sky-500/20",
                plan.highlighted && !isCurrent && "border-sky-500/30"
              )}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  {isCurrent && <Badge variant="sky">Current</Badge>}
                </div>
                <p className="text-3xl font-bold text-white">
                  ${plan.price}
                  {plan.price > 0 && (
                    <span className="text-sm font-normal text-zinc-500">/mo</span>
                  )}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  {plan.quota} calls/mo · {plan.monitors} monitors
                </p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={isCurrent ? "secondary" : plan.highlighted ? "primary" : "outline"}
                className="w-full"
                disabled={isCurrent || loadingPlan !== null}
                onClick={() => handleSelect(plan)}
              >
                {loadingPlan === plan.id || (loadingPlan === "portal" && plan.id === "FREE") ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  getButtonLabel(plan, index)
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-zinc-500">
        {stripeEnabled
          ? "Paid plans are billed monthly through Stripe. Use Manage billing to update payment method or cancel."
          : "Stripe is not configured — plan changes apply immediately for local testing only."}
      </p>
    </div>
  );
}
