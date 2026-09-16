import { Badge } from "@/components/ui/badge";
import type { PredictorClaim } from "@prisma/client";

const STATUS_LABEL: Record<PredictorClaim["status"], string> = {
  OPEN: "Open",
  HIT: "Right",
  MISS: "Wrong",
  INCONCLUSIVE: "Unclear",
  EXPIRED: "Expired",
};

const STATUS_VARIANT: Record<
  PredictorClaim["status"],
  "default" | "success" | "warning"
> = {
  OPEN: "default",
  HIT: "success",
  MISS: "warning",
  INCONCLUSIVE: "default",
  EXPIRED: "default",
};

export function PredictorClaimsList({ claims }: { claims: PredictorClaim[] }) {
  if (claims.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No forward-looking calls detected in the last 14 days.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {claims.map((c) => (
        <li
          key={c.id}
          className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>
            {c.direction && (
              <span className="text-xs text-zinc-500 capitalize">{c.direction}</span>
            )}
            <span className="text-xs text-zinc-600">
              {c.tweetCreatedAt.toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-zinc-300">{c.claimSummary}</p>
          {c.statusReason && (
            <p className="text-xs text-zinc-600 mt-2">{c.statusReason}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
