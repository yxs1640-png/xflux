"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export function PlanSelector({ plans, currentPlanId }: PlanSelectorProps) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const planOrder = ["FREE", "BASIC", "PRO", "ENTERPRISE"];
  const currentIndex = planOrder.indexOf(currentPlanId);

  async function handleSelect(plan: Plan) {
    if (plan.id === currentPlanId) return;

    if (plan.id === "ENTERPRISE") {
      setMessage({
        type: "error",
        text: "Enterprise plans require contacting sales@xflux.dev",
      });
      return;
    }

    setLoadingPlan(plan.id);
    setMessage(null);

    const res = await fetch("/api/subscription/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: plan.id }),
    });

    const data = await res.json();
    setLoadingPlan(null);

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Upgrade failed" });
      return;
    }

    setMessage({ type: "success", text: `Successfully switched to ${plan.name} plan.` });
    router.refresh();
  }

  function getButtonLabel(plan: Plan, index: number) {
    if (plan.id === currentPlanId) return "Current Plan";
    if (index < currentIndex) return `Switch to ${plan.name}`;
    if (plan.id === "ENTERPRISE") return plan.cta;
    return plan.cta;
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
                {loadingPlan === plan.id ? (
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
        Stripe payment integration coming soon. Plan changes take effect immediately for testing.
      </p>
    </div>
  );
}
