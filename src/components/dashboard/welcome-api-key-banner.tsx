"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "xflux_welcome_api_key";

export function WelcomeApiKeyBanner() {
  const searchParams = useSearchParams();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") !== "1") return;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, [searchParams]);

  function dismiss() {
    sessionStorage.removeItem(STORAGE_KEY);
    setDismissed(true);
    setApiKey(null);
  }

  async function copyKey() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (dismissed || !apiKey) return null;

  return (
    <div
      className={cn(
        "mb-8 rounded-xl border px-5 py-4",
        "border-emerald-500/20 bg-emerald-500/10"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-emerald-400">Welcome! Your account is ready.</p>
          <p className="mt-1 text-sm text-zinc-400">
            Copy your API key now — it won&apos;t be shown again.
          </p>
          <div className="mt-3 rounded-lg bg-zinc-900/80 p-3 font-mono text-sm text-sky-400 break-all">
            {apiKey}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Use in requests:{" "}
            <code className="text-zinc-300">Authorization: Bearer {apiKey.slice(0, 16)}...</code>
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
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
        <Link href="/docs/quickstart">
          <Button size="sm">View quickstart</Button>
        </Link>
        <Button size="sm" variant="ghost" onClick={dismiss}>
          I&apos;ve saved it
        </Button>
      </div>
    </div>
  );
}
