"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { UNVERIFIED_FREE_QUOTA } from "@/lib/quota-constants";

type Props = {
  email: string;
  /** Seconds until Resend is allowed (from last send / signup). */
  initialCooldownSec?: number;
};

/**
 * Post-signup: registration already emailed a link — lead with "check inbox",
 * keep resend as a quiet fallback with cooldown.
 */
export function EmailVerifyBanner({ email, initialCooldownSec = 0 }: Props) {
  const searchParams = useSearchParams();
  const justSignedUp = searchParams.get("welcome") === "1";

  const [cooldown, setCooldown] = useState(() =>
    Math.max(0, initialCooldownSec || (justSignedUp ? 90 : 0))
  );
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    justSignedUp || initialCooldownSec > 0 ? "sent" : "idle"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  async function resend() {
    if (cooldown > 0 || status === "sending") return;
    setStatus("sending");
    setError("");
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const retry = typeof data.retryAfterSec === "number" ? data.retryAfterSec : 0;
      if (retry > 0) setCooldown(retry);
      setStatus(retry > 0 ? "sent" : "error");
      setError(typeof data.error === "string" ? data.error : "Could not send email");
      return;
    }
    setCooldown(90);
    setStatus("sent");
  }

  const canResend = cooldown <= 0 && status !== "sending";

  return (
    <div className="mb-6 rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sm text-sky-50">
      <div className="flex flex-wrap items-start gap-3">
        <Mail className="h-5 w-5 text-sky-300 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white">
            {justSignedUp || status === "sent"
              ? `Check ${email} for a verification link`
              : `Verify ${email} to unlock 1,000 Free API calls`}
          </p>
          <p className="mt-1 text-sky-100/85">
            {justSignedUp || status === "sent"
              ? `We already sent one — open the link to unlock 1,000 Free calls (until then: ${UNVERIFIED_FREE_QUOTA.toLocaleString()}/mo). Same API key; no card.`
              : `Until then your monthly quota is ${UNVERIFIED_FREE_QUOTA.toLocaleString()} calls. Same API key — no credit card.`}
          </p>
          {status === "error" && <p className="mt-2 text-red-300">{error}</p>}
          <p className="mt-2 text-sky-200/80">
            {canResend ? (
              <>
                Nothing in inbox or spam?{" "}
                <button
                  type="button"
                  className="underline underline-offset-2 hover:text-white"
                  onClick={resend}
                >
                  Send again
                </button>
              </>
            ) : status === "sending" ? (
              "Sending…"
            ) : (
              <>
                Nothing yet? You can send again
                {cooldown > 0 ? ` in ${cooldown}s` : ""}.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
