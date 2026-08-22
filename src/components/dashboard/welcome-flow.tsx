"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Check,
  Copy,
  Key,
  Loader2,
  Radar,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LEGAL } from "@/lib/legal-config";
import { markOnboardingKeySaved } from "@/lib/onboarding-client";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";

const STORAGE_KEY = "xflux_welcome_api_key";

const SUGGESTED_ACCOUNTS = ["elonmusk", "sama", "naval"] as const;

type WelcomeFlowProps = {
  hasApiCalls: boolean;
  hasMonitors: boolean;
  userName: string | null;
  onFinish?: () => void;
};

export function WelcomeFlow({
  hasApiCalls,
  hasMonitors,
  userName,
  onFinish,
}: WelcomeFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "1";

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [username, setUsername] = useState("");
  const [keywords, setKeywords] = useState("");
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [monitorError, setMonitorError] = useState<string | null>(null);
  const [monitorCreated, setMonitorCreated] = useState(hasMonitors);
  const [watchingUsername, setWatchingUsername] = useState<string | null>(null);
  const [baselineMessage, setBaselineMessage] = useState<string | null>(null);

  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testSucceeded, setTestSucceeded] = useState(hasApiCalls);

  useEffect(() => {
    if (!isWelcome) return;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, [isWelcome]);

  useEffect(() => {
    if (hasMonitors) setMonitorCreated(true);
  }, [hasMonitors]);

  useEffect(() => {
    if (hasApiCalls) setTestSucceeded(true);
  }, [hasApiCalls]);

  if (!isWelcome) return null;

  const step1Done = monitorCreated;
  const step2Done = baselineMessage !== null || hasMonitors;
  const step3OptionalDone = copied || testSucceeded;

  const curlExample = apiKey
    ? `curl ${LEGAL.website}/api/v1/users/elonmusk \\
  -H "Authorization: Bearer ${apiKey}"`
    : null;

  function normalizeUsername(raw: string): string {
    return raw.trim().replace(/^@+/, "");
  }

  async function createMonitor(e?: React.FormEvent) {
    e?.preventDefault();
    const target = normalizeUsername(username);
    if (!target) {
      setMonitorError("Enter an @username to watch");
      return;
    }

    setMonitorLoading(true);
    setMonitorError(null);
    setBaselineMessage(null);

    try {
      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUsername: target,
          keywords: keywords.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMonitorError(typeof data.error === "string" ? data.error : "Could not create monitor");
        return;
      }

      setMonitorCreated(true);
      setWatchingUsername(data.monitor?.targetUsername ?? target);
      trackClientEvent(AnalyticsEvents.MONITOR_CREATED, {
        has_keywords: Boolean(keywords.trim()),
        check_interval: data.monitor?.checkInterval,
        via: "welcome_flow",
      });

      const monitorId = data.monitor?.id as string | undefined;
      if (monitorId) {
        const checkRes = await fetch(`/api/monitors/${monitorId}/check`, { method: "POST" });
        const checkData = await checkRes.json();
        if (checkRes.ok) {
          const r = checkData.result;
          trackClientEvent(AnalyticsEvents.MONITOR_CHECKED, {
            monitor_id: monitorId,
            new_hits: r?.newHits ?? 0,
            baselined: Boolean(r?.baselined),
            had_error: Boolean(r?.error),
            via: "welcome_flow",
          });
          if (r?.error) {
            setBaselineMessage(
              `Monitor created. First poll hit a snag — open Monitors to retry.`
            );
          } else if (r?.baselined) {
            setBaselineMessage(
              `Baseline set for @${target}. New tweets after now will show up here and on your next checks.`
            );
          } else if (r?.newHits > 0) {
            setBaselineMessage(`Found ${r.newHits} recent tweet(s) from @${target}.`);
          } else {
            setBaselineMessage(`Watching @${target}. We'll check on your plan schedule.`);
          }
        } else {
          setBaselineMessage(`Watching @${target}. Run a check anytime from Monitors.`);
        }
      }

      router.refresh();
    } catch {
      setMonitorError("Network error — try again");
    } finally {
      setMonitorLoading(false);
    }
  }

  async function runTestCall() {
    setTestLoading(true);
    setTestError(null);

    try {
      const res = await fetch("/api/dashboard/onboarding/test-call", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setTestError(typeof json.error === "string" ? json.error : "Request failed");
        return;
      }
      setTestSucceeded(true);
      router.refresh();
    } catch {
      setTestError("Network error — try again");
    } finally {
      setTestLoading(false);
    }
  }

  async function copyKey() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    markOnboardingKeySaved();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function finishWelcome() {
    sessionStorage.removeItem(STORAGE_KEY);
    markOnboardingKeySaved();
    onFinish?.();
    router.replace("/dashboard", { scroll: false });
  }

  const greeting = userName ? `Welcome, ${userName.split(" ")[0]}!` : "Welcome to XFlux!";
  const displayWatch = watchingUsername ?? (hasMonitors ? "your account" : null);

  return (
    <div className="mb-8 rounded-2xl border border-sky-500/25 bg-gradient-to-b from-sky-500/10 to-zinc-950/40 overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-sky-500/10">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20">
            <Radar className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">{greeting}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Most people start by <strong className="text-zinc-200">watching an account</strong>{" "}
              — get notified when they post. Free plan includes{" "}
              <strong className="text-zinc-200">1 monitor</strong> and 1,000 API calls/month.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Step 1: Create monitor */}
        <section
          className={cn(
            "rounded-xl border p-5 transition-colors",
            step1Done
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-sky-500/30 bg-zinc-900/50"
          )}
        >
          <div className="flex items-start gap-3">
            <StepBadge done={step1Done} number={1} />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-zinc-500" />
                Who do you want to watch?
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                We poll public @handles on a schedule — no cron jobs on your side.
              </p>

              {step1Done ? (
                <p className="mt-2 text-sm text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0" />
                  {displayWatch ? `Watching @${displayWatch}` : "Monitor active"}
                </p>
              ) : (
                <form onSubmit={createMonitor} className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_ACCOUNTS.map((account) => (
                      <button
                        key={account}
                        type="button"
                        onClick={() => setUsername(account)}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:border-sky-500/50 hover:text-sky-300 transition-colors"
                      >
                        @{account}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Input
                      placeholder="@username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="max-w-[200px]"
                      required
                    />
                    <Input
                      placeholder="Keywords (optional)"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="max-w-[220px]"
                    />
                    <Button type="submit" disabled={monitorLoading} size="lg">
                      {monitorLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Radar className="h-4 w-4" />
                      )}
                      Start watching
                    </Button>
                  </div>
                  {monitorError && <p className="text-xs text-amber-400">{monitorError}</p>}
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Step 2: Baseline / first check */}
        <section
          className={cn(
            "rounded-xl border p-5 transition-colors",
            step2Done
              ? "border-emerald-500/20 bg-emerald-500/5"
              : step1Done
                ? "border-sky-500/30 bg-zinc-900/50"
                : "border-zinc-800/60 bg-zinc-950/40 opacity-80"
          )}
        >
          <div className="flex items-start gap-3">
            <StepBadge done={step2Done} number={2} />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">First check & baseline</p>
              <p className="mt-1 text-sm text-zinc-400">
                We note existing tweets so you only get alerted on{" "}
                <span className="text-zinc-300">new</span> posts going forward.
              </p>
              {step1Done && baselineMessage && (
                <p className="mt-2 text-sm text-emerald-400">{baselineMessage}</p>
              )}
              {step1Done && !baselineMessage && !step2Done && (
                <p className="mt-2 text-sm text-zinc-500">Running first check…</p>
              )}
              {!step1Done && (
                <p className="mt-2 text-sm text-zinc-600">Complete step 1 first.</p>
              )}
            </div>
          </div>
        </section>

        {/* Step 3: API key (developers) — optional */}
        <section
          className={cn(
            "rounded-xl border p-5 transition-colors",
            step3OptionalDone
              ? "border-emerald-500/20 bg-emerald-500/5"
              : step1Done
                ? "border-zinc-800 bg-zinc-950/40"
                : "border-zinc-800/60 bg-zinc-950/40 opacity-60"
          )}
        >
          <div className="flex items-start gap-3">
            <StepBadge done={step3OptionalDone} number={3} optional />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-zinc-500" />
                Building with the API?{" "}
                <span className="text-xs font-normal text-zinc-500">(optional)</span>
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Copy your API key or run a quick profile lookup — skip if you only need monitors.
              </p>

              {step1Done && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={runTestCall}
                    disabled={testLoading || testSucceeded}
                  >
                    {testLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Terminal className="h-4 w-4" />
                    )}
                    {testSucceeded ? "API tested" : "Test API call"}
                  </Button>
                  {apiKey && (
                    <Button size="sm" variant="outline" onClick={copyKey}>
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy API key
                        </>
                      )}
                    </Button>
                  )}
                  {!apiKey && (
                    <Link href="/dashboard/api-keys">
                      <Button size="sm" variant="ghost">
                        API Keys
                      </Button>
                    </Link>
                  )}
                </div>
              )}
              {testError && <p className="mt-2 text-xs text-amber-400">{testError}</p>}
              {apiKey && curlExample && testSucceeded && (
                <pre className="mt-3 rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap">
                  {curlExample}
                </pre>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-3">
            <Link href="/docs/monitors">
              <Button size="sm" variant="outline">
                Monitor docs
              </Button>
            </Link>
            <Link href="/dashboard/monitors">
              <Button size="sm" variant="ghost">
                <Sparkles className="h-4 w-4" />
                All monitors
              </Button>
            </Link>
          </div>
          <Button
            size="sm"
            onClick={finishWelcome}
            disabled={!step1Done}
            title={!step1Done ? "Create a monitor first" : undefined}
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepBadge({
  done,
  number,
  optional,
}: {
  done: boolean;
  number: number;
  optional?: boolean;
}) {
  if (done) {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
        <Check className="h-4 w-4 text-emerald-400" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
        optional ? "border-zinc-700 text-zinc-500" : "border-zinc-600 text-zinc-400"
      )}
    >
      {number}
    </span>
  );
}
