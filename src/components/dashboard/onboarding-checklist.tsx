"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LEGAL } from "@/lib/legal-config";
import {
  markOnboardingDismissed,
  markOnboardingKeySaved,
  ONBOARDING_UPDATE_EVENT,
  readOnboardingClientState,
} from "@/lib/onboarding-client";

type StepId = "key" | "api_call" | "monitor" | "usage";

type StepDef = {
  id: StepId;
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
};

const STEPS: StepDef[] = [
  {
    id: "key",
    title: "Save your API key",
    description:
      "Copy the key from the welcome banner above, or create a new one on the API Keys page. You need it for every request.",
    href: "/dashboard/api-keys",
    hrefLabel: "Open API Keys",
  },
  {
    id: "api_call",
    title: "Make your first API call",
    description:
      "Look up a public profile — this uses 1 call from your free monthly quota.",
    href: "/docs/quickstart",
    hrefLabel: "Quickstart guide",
  },
  {
    id: "monitor",
    title: "Create an account monitor (optional)",
    description:
      "Track @accounts for new tweets without building your own polling. Free plan includes 1 monitor.",
    href: "/dashboard/monitors",
    hrefLabel: "Add a monitor",
  },
  {
    id: "usage",
    title: "Review usage & quota",
    description:
      "See how many calls you've used, which endpoints are popular, and when your quota resets.",
    href: "/dashboard/usage",
    hrefLabel: "View usage",
  },
];

export function OnboardingChecklist({
  hasApiCalls,
  hasMonitors,
  apiKeyPrefix,
}: {
  hasApiCalls: boolean;
  hasMonitors: boolean;
  apiKeyPrefix: string | null;
}) {
  const router = useRouter();
  const [clientState, setClientState] = useState(readOnboardingClientState);
  const [expanded, setExpanded] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<string | null>(null);

  const refreshClientState = useCallback(() => {
    setClientState(readOnboardingClientState());
  }, []);

  useEffect(() => {
    window.addEventListener(ONBOARDING_UPDATE_EVENT, refreshClientState);
    return () => window.removeEventListener(ONBOARDING_UPDATE_EVENT, refreshClientState);
  }, [refreshClientState]);

  const stepComplete = useMemo(
    () => ({
      key: clientState.keySaved || hasApiCalls,
      api_call: hasApiCalls,
      monitor: hasMonitors,
      usage: clientState.usageVisited,
    }),
    [clientState, hasApiCalls, hasMonitors]
  );

  const completedCount = STEPS.filter((s) => stepComplete[s.id]).length;
  const allComplete = completedCount === STEPS.length;

  if (clientState.dismissed) return null;
  if (allComplete) {
    return (
      <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-emerald-400">You&apos;re all set!</p>
            <p className="mt-1 text-sm text-zinc-400">
              Onboarding complete — explore docs or add more monitors anytime.
            </p>
          </div>
          <button
            type="button"
            onClick={() => markOnboardingDismissed()}
            className="shrink-0 text-zinc-500 hover:text-zinc-300"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const curlExample = `curl ${LEGAL.website}/api/v1/users/elonmusk \\
  -H "Authorization: Bearer ${apiKeyPrefix ?? "xflux_YOUR_KEY"}..."`;

  async function runTestCall() {
    setTestLoading(true);
    setTestError(null);
    setTestResponse(null);
    markOnboardingKeySaved();

    try {
      const res = await fetch("/api/dashboard/onboarding/test-call", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setTestError(typeof json.error === "string" ? json.error : "Request failed");
        return;
      }
      setTestResponse(JSON.stringify(json, null, 2));
      router.refresh();
    } catch {
      setTestError("Network error — try again");
    } finally {
      setTestLoading(false);
    }
  }

  function handleMarkKeySaved() {
    markOnboardingKeySaved();
  }

  return (
    <div className="mb-6 rounded-xl border border-sky-500/20 bg-sky-500/5">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-sky-500/10">
        <div>
          <p className="font-medium text-white">Getting started</p>
          <p className="text-sm text-zinc-400 mt-0.5">
            {completedCount} of {STEPS.length} complete — finish these to get the most from XFlux
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-zinc-500 hover:text-zinc-300 p-1"
            aria-label={expanded ? "Collapse checklist" : "Expand checklist"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => markOnboardingDismissed()}
            className="text-zinc-500 hover:text-zinc-300 p-1"
            aria-label="Hide checklist"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <ol className="px-5 py-4 space-y-4">
          {STEPS.map((step, index) => {
            const done = stepComplete[step.id];
            const isCurrent = !done && STEPS.slice(0, index).every((s) => stepComplete[s.id]);

            return (
              <li
                key={step.id}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  done
                    ? "border-zinc-800/80 bg-zinc-900/30"
                    : isCurrent
                      ? "border-sky-500/30 bg-zinc-900/50"
                      : "border-zinc-800/60 bg-zinc-950/40"
                )}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    {done ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </span>
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700">
                        <Circle className="h-2 w-2 fill-zinc-600 text-zinc-600" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "font-medium",
                        done ? "text-zinc-500 line-through" : "text-white"
                      )}
                    >
                      {step.title}
                    </p>
                    {!done && (
                      <>
                        <p className="mt-1 text-sm text-zinc-400">{step.description}</p>

                        {step.id === "key" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={handleMarkKeySaved}>
                              I&apos;ve saved my key
                            </Button>
                            {step.href && (
                              <Link href={step.href}>
                                <Button size="sm" variant="ghost">
                                  {step.hrefLabel}
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}

                        {step.id === "api_call" && (
                          <div className="mt-3 space-y-3">
                            <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap">
                              {curlExample}
                            </pre>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" onClick={runTestCall} disabled={testLoading}>
                                {testLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <ArrowRight className="h-4 w-4" />
                                )}
                                Run test call
                              </Button>
                              {step.href && (
                                <Link href={step.href}>
                                  <Button size="sm" variant="outline">
                                    {step.hrefLabel}
                                  </Button>
                                </Link>
                              )}
                            </div>
                            {testError && (
                              <p className="text-xs text-amber-400">{testError}</p>
                            )}
                            {testResponse && (
                              <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-300 overflow-x-auto max-h-40 overflow-y-auto">
                                {testResponse}
                              </pre>
                            )}
                          </div>
                        )}

                        {(step.id === "monitor" || step.id === "usage") && step.href && (
                          <div className="mt-3">
                            <Link href={step.href}>
                              <Button size="sm" variant={isCurrent ? "primary" : "outline"}>
                                {step.hrefLabel}
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
