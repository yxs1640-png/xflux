"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageCircle, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const HIDDEN_PREFIXES = ["/feedback", "/login", "/register", "/api"];

export function FeedbackWidget() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [capabilityRequest, setCapabilityRequest] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const hidden = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email);
  }, [session?.user?.email]);

  useEffect(() => {
    setOpen(false);
    setDone(false);
    setError("");
  }, [pathname]);

  if (hidden) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const wish = capabilityRequest.trim();
    if (wish.length < 12) {
      setError("Please describe what you need in a bit more detail.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session?.user?.email ? undefined : email.trim(),
        capabilityRequest: wish,
        notifyOnShip: true,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        website,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Submit failed");
      return;
    }

    setDone(true);
    setCapabilityRequest("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className={cn(
            "w-[min(100vw-2rem,22rem)] rounded-xl border border-zinc-700 bg-zinc-950 shadow-xl",
            "ring-1 ring-black/40"
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <p className="text-sm font-medium text-zinc-100">What do you need?</p>
            <button
              type="button"
              aria-label="Close"
              className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-sky-400" />
              <p className="text-sm text-zinc-200">Got it — we&apos;ll email you when it&apos;s ready.</p>
              <button
                type="button"
                className="text-xs text-sky-400 hover:text-sky-300"
                onClick={() => {
                  setDone(false);
                  setOpen(false);
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3 px-4 py-4">
              <p className="text-xs text-zinc-500">
                X/Twitter-related wishes welcome — even if the feature is not on the site yet.
              </p>
              {!session?.user?.email && (
                <Input
                  type="email"
                  required
                  placeholder="Email (we notify you when it ships)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-700"
                />
              )}
              <Textarea
                required
                rows={4}
                maxLength={5000}
                placeholder="I need to…"
                value={capabilityRequest}
                onChange={(e) => setCapabilityRequest(e.target.value)}
                className="bg-zinc-900 border-zinc-700 resize-none"
              />
              {/* honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Submit request"
                )}
              </Button>
              <p className="text-[11px] text-zinc-500">
                Full form at{" "}
                <a href="/feedback" className="text-sky-400 hover:underline">
                  /feedback
                </a>
                .
              </p>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Close request form" : "Open request form"}
        onClick={() => {
          setOpen((v) => !v);
          setDone(false);
          setError("");
        }}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-3",
          "bg-sky-500 text-sm font-medium text-white shadow-lg shadow-sky-900/40",
          "transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2",
          "focus-visible:outline-offset-2 focus-visible:outline-sky-300"
        )}
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            Request
          </>
        )}
      </button>
    </div>
  );
}
