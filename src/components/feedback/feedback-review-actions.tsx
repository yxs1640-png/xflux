"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  feedbackId: string;
  rewardCalls: number;
};

export function FeedbackReviewActions({ feedbackId, rewardCalls }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function review(action: "approve" | "reject") {
    setLoading(action);
    setError(null);
    try {
      const res = await fetch("/api/ops/feedback/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      if (action === "approve") {
        setDone(
          `Approved — +${data.rewardCalls} calls (limit ${data.newQuotaLimit}). Reward email: send locally after review.`
        );
      } else {
        setDone("Rejected");
      }
      router.refresh();
    } catch {
      setError("Request failed");
    } finally {
      setLoading(null);
    }
  }

  if (done) {
    return <p className="mt-3 text-xs text-emerald-400">{done}</p>;
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={loading !== null}
          onClick={() => void review("approve")}
        >
          {loading === "approve" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            `Approve → +${rewardCalls.toLocaleString()} calls`
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={loading !== null}
          onClick={() => void review("reject")}
        >
          {loading === "reject" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Reject"
          )}
        </Button>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
