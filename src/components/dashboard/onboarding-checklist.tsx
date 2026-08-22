"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Loader2,
  Sparkles,
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

type StepId = "api_call" | "key" | "monitor" | "usage";

type StepDef = {
  id: StepId;
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
};

/** Monitor first — matches core job-to-be-done (watch accounts, then optional API). */
const STEPS: StepDef[] = [
  {
    id: "monitor",
    title: "Create your first monitor",
    description:
      "Watch a public @account for new tweets. Free plan includes 1 monitor — no API coding required.",
    href: "/dashboard/monitors",
    hrefLabel: "Add a monitor",
  },
  {
    id: "api_call",
    title: "Try the REST API (optional)",
    description:
      "Look up @elonmusk — uses 1 call from your free monthly quota. Skip if you only need monitors.",
    href: "/docs/quickstart",
    hrefLabel: "Quickstart guide",
  },
  {
    id: "key",
    title: "Save your API key",
    description:
      "Copy the key from the welcome screen (shown once at signup), or create a new one on the API Keys page.",
    href: "/dashboard/api-keys",
    hrefLabel: "Open API Keys",
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

function TestCallPanel({
  testLoading,
  testError,
  testResponse,
  testSucceeded,
  onRun,
  variant = "default",
}: {
  testLoading: boolean;
  testError: string | null;
  testResponse: string | null;
  testSucceeded: boolean;
  onRun: () => void;
  variant?: "hero" | "default";
}) {
  const isHero = variant === "hero";

  return (
    <div className={cn("space-y-3", isHero ? "" : "mt-3")}>
      {isHero && (
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-white">Try it now — look up @elonmusk</p>
            <p className="text-sm text-zinc-400 mt-1">
              One click, one free API call. No setup required.
            </p>
          </div>
        </div>
      )}
      <Button
        size={isHero ? "lg" : "sm"}
        onClick={onRun}
        disabled={testLoading}
        className={isHero ? "w-full sm:w-auto" : undefined}
      >
        {testLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        Run test call
      </Button>
      {testError && <p className="text-xs text-amber-400">{testError}</p>}
      {testSucceeded && (
        <p className="text-sm text-emerald-400">
          You&apos;re live! Scroll down to copy your API key for use in your own app.
        </p>
      )}
      {testResponse && (
        <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-300 overflow-x-auto max-h-40 overflow-y-auto">
          {testResponse}
        </pre>
      )}
    </div>
  );
}

export function OnboardingChecklist({
  hasApiCalls,
  hasMonitors,
  apiKeyPrefix,
  isRecentSignup,
}: {
  hasApiCalls: boolean;
  hasMonitors: boolean;
  apiKeyPrefix: string | null;
  isRecentSignup: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const [clientState, setClientState] = useState(readOnboardingClientState);
  const [expanded, setExpanded] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testSucceeded, setTestSucceeded] = useState(false);

  const refreshClientState = useCallback(() => {
    setClientState(readOnboardingClientState());
  }, []);

  useEffect(() => {
    window.addEventListener(ONBOARDING_UPDATE_EVENT, refreshClientState);
    return () => window.removeEventListener(ONBOARDING_UPDATE_EVENT, refreshClientState);
  }, [refreshClientState]);

  const isWelcomeRedirect = searchParams.get("welcome") === "1";

  useEffect(() => {
    if (searchParams.get("welcome") !== "1" || hasMonitors) return;
    const timer = window.setTimeout(() => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchParams, hasMonitors]);

  const stepComplete = useMemo(
    () => ({
      api_call: hasApiCalls || testSucceeded,
      key: clientState.keySaved || hasApiCalls,
      monitor: hasMonitors,
      usage: clientState.usageVisited,
    }),
    [clientState, hasApiCalls, hasMonitors, testSucceeded]
  );

  const completedCount = STEPS.filter((s) => stepComplete[s.id]).length;
  const allComplete = completedCount === STEPS.length;

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
        setTestSucceeded(false);
        return;
      }
      setTestResponse(JSON.stringify(json, null, 2));
      setTestSucceeded(true);
      router.refresh();
    } catch {
      setTestError("Network error — try again");
      setTestSucceeded(false);
    } finally {
      setTestLoading(false);
    }
  }

  // Unified welcome flow handles first-time onboarding; skip duplicate checklist.
  if (isWelcomeRedirect && !hasMonitors) return null;

  if (clientState.dismissed) {
    if (!hasMonitors && isRecentSignup) {
      return (
        <div
          id="onboarding-checklist"
          ref={rootRef}
          className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-white">Haven&apos;t set up a monitor yet?</p>
              <p className="text-sm text-zinc-400 mt-1">
                Watch an @account — we&apos;ll check for new tweets on your schedule.
              </p>
            </div>
            <Link href="/dashboard/monitors">
              <Button className="shrink-0">
                <ArrowRight className="h-4 w-4" />
                Add a monitor
              </Button>
            </Link>
          </div>
        </div>
      );
    }
    if (!hasApiCalls && isRecentSignup && hasMonitors) {
      return (
        <div
          id="onboarding-checklist"
          ref={rootRef}
          className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-white">Haven&apos;t tried the API yet?</p>
              <p className="text-sm text-zinc-400 mt-1">
                Run a free test call — look up @elonmusk in one click.
              </p>
            </div>
            <Button onClick={runTestCall} disabled={testLoading} className="shrink-0">
              {testLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              Run test call
            </Button>
          </div>
          {testError && <p className="text-xs text-amber-400 mt-2">{testError}</p>}
          {testSucceeded && (
            <p className="text-sm text-emerald-400 mt-2">
              You&apos;re live! Copy your API key from the welcome screen or API Keys page.
            </p>
          )}
        </div>
      );
    }
    return null;
  }

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

  return (
    <div
      id="onboarding-checklist"
      ref={rootRef}
      className="mb-6 rounded-xl border border-sky-500/20 bg-sky-500/5"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-sky-500/10">
        <div>
          <p className="font-medium text-white">Getting started</p>
          <p className="text-sm text-zinc-400 mt-0.5">
            {completedCount} of {STEPS.length} complete — start with a monitor
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
          {hasMonitors && (
            <button
              type="button"
              onClick={() => markOnboardingDismissed()}
              className="text-zinc-500 hover:text-zinc-300 p-1"
              aria-label="Hide checklist"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <>
          {!hasMonitors && (
            <div className="mx-5 mt-4 rounded-lg border border-sky-500/40 bg-sky-500/10 p-4">
              <p className="font-medium text-white">Watch your first account</p>
              <p className="text-sm text-zinc-400 mt-1">
                Monitors poll @handles for new tweets — the fastest way to get value from XFlux.
              </p>
              <Link href="/dashboard/monitors" className="inline-block mt-3">
                <Button size="lg">
                  <ArrowRight className="h-4 w-4" />
                  Add a monitor
                </Button>
              </Link>
            </div>
          )}

          {!hasApiCalls && hasMonitors && (
            <div className="mx-5 mt-4 rounded-lg border border-sky-500/40 bg-sky-500/10 p-4">
              <TestCallPanel
                variant="hero"
                testLoading={testLoading}
                testError={testError}
                testResponse={testResponse}
                testSucceeded={testSucceeded}
                onRun={runTestCall}
              />
            </div>
          )}

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

                          {step.id === "api_call" && hasApiCalls && (
                            <div className="mt-3 space-y-3">
                              <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap">
                                {curlExample}
                              </pre>
                              {step.href && (
                                <Link href={step.href}>
                                  <Button size="sm" variant="outline">
                                    {step.hrefLabel}
                                  </Button>
                                </Link>
                              )}
                            </div>
                          )}

                          {step.id === "key" && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markOnboardingKeySaved()}
                              >
                                I&apos;ve saved my key
                              </Button>
                              {step.href && (
                                <Link href={step.href}>
                                  <Button size="sm" variant={isCurrent ? "primary" : "ghost"}>
                                    {step.hrefLabel}
                                    <ArrowRight className="h-4 w-4" />
                                  </Button>
                                </Link>
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
        </>
      )}
    </div>
  );
}
