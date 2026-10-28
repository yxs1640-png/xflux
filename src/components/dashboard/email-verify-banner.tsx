"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UNVERIFIED_FREE_QUOTA } from "@/lib/quota-constants";

export function EmailVerifyBanner({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function resend() {
    setStatus("sending");
    setError("");
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setError(typeof data.error === "string" ? data.error : "Could not send email");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">
      <div className="flex flex-wrap items-start gap-3">
        <Mail className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white">Verify {email} to unlock 1,000 Free API calls</p>
          <p className="mt-1 text-amber-100/90">
            Until then your monthly API quota is {UNVERIFIED_FREE_QUOTA.toLocaleString()} calls. Same
            API key — no credit card required.
          </p>
          {status === "sent" && (
            <p className="mt-2 text-sky-300">Check your inbox (and spam) for a new link.</p>
          )}
          {status === "error" && <p className="mt-2 text-red-300">{error}</p>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={status === "sending" || status === "sent"}
          onClick={resend}
        >
          {status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Resend email"}
        </Button>
      </div>
    </div>
  );
}
