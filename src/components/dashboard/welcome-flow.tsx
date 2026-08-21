"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  Key,
  Loader2,
  Radar,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LEGAL } from "@/lib/legal-config";
import { markOnboardingKeySaved } from "@/lib/onboarding-client";

const STORAGE_KEY = "xflux_welcome_api_key";

type WelcomeFlowProps = {
  hasApiCalls: boolean;
  userName: string | null;
  onFinish?: () => void;
};

export function WelcomeFlow({ hasApiCalls, userName, onFinish }: WelcomeFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "1";

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testSucceeded, setTestSucceeded] = useState(hasApiCalls);

  useEffect(() => {
    if (!isWelcome) return;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, [isWelcome]);

  useEffect(() => {
    if (hasApiCalls) setTestSucceeded(true);
  }, [hasApiCalls]);

  if (!isWelcome) return null;

  const step1Done = testSucceeded || hasApiCalls;
  const step2Done = copied;
  const curlExample = apiKey
    ? `curl ${LEGAL.website}/api/v1/users/elonmusk \\
  -H "Authorization: Bearer ${apiKey}"`
    : null;

  async function runTestCall() {
    setTestLoading(true);
    setTestError(null);
    setTestResponse(null);

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

  return (
    <div className="mb-8 rounded-2xl border border-sky-500/25 bg-gradient-to-b from-sky-500/10 to-zinc-950/40 overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-sky-500/10">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20">
            <Sparkles className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">{greeting}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Your account is ready with{" "}
              <strong className="text-zinc-200">1,000 free API calls</strong> every month. Two
              steps to get started — takes under a minute.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Step 1: Test call */}
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
              <p className="font-medium text-white">Make your first API call</p>
              <p className="mt-1 text-sm text-zinc-400">
                Look up <span className="text-zinc-300">@elonmusk</span> — one click, uses 1 call
                from your free quota. No curl or setup needed.
              </p>

              {!step1Done && (
                <div className="mt-4">
                  <Button onClick={runTestCall} disabled={testLoading} size="lg">
                    {testLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Terminal className="h-4 w-4" />
                    )}
                    Run test call
                  </Button>
                  {testError && <p className="mt-2 text-xs text-amber-400">{testError}</p>}
                </div>
              )}

              {step1Done && (
                <p className="mt-2 text-sm text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0" />
                  API is working — you&apos;re live!
                </p>
              )}

              {testResponse && (
                <pre className="mt-3 rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-300 overflow-x-auto max-h-48 overflow-y-auto">
                  {testResponse}
                </pre>
              )}
            </div>
          </div>
        </section>

        {/* Step 2: API key */}
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
              <p className="font-medium text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-zinc-500" />
                Save your API key
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Shown once at signup — copy it now for use in your app or scripts.
              </p>

              {apiKey ? (
                <>
                  <div className="mt-3 rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-sm text-sky-400 break-all">
                    {apiKey}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
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
                  </div>
                  {curlExample && step1Done && (
                    <div className="mt-4">
                      <p className="text-xs text-zinc-500 mb-1.5">Use it in your terminal</p>
                      <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap">
                        {curlExample}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">
                  Key not found in this session — create one on the{" "}
                  <Link href="/dashboard/api-keys" className="text-sky-400 hover:text-sky-300">
                    API Keys
                  </Link>{" "}
                  page.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Next steps */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-3">
            <Link href="/docs/quickstart">
              <Button size="sm" variant="outline">
                Quickstart guide
              </Button>
            </Link>
            <Link href="/dashboard/monitors">
              <Button size="sm" variant="ghost">
                <Radar className="h-4 w-4" />
                Add a monitor
              </Button>
            </Link>
          </div>
          <Button
            size="sm"
            onClick={finishWelcome}
            disabled={!step1Done}
            title={!step1Done ? "Run the test call first" : undefined}
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepBadge({ done, number }: { done: boolean; number: number }) {
  if (done) {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
        <Check className="h-4 w-4 text-emerald-400" />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-600 text-xs font-medium text-zinc-400">
      {number}
    </span>
  );
}
