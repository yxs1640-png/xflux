import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { NICHE_META, slugFromNiche } from "@/lib/predictor-discovery/types";
import type { PredictorClaim, PredictorProfile } from "@prisma/client";

type PredictorRow = PredictorProfile & { claims: PredictorClaim[] };

function formatScore(score: number | null | undefined): string {
  if (score == null) return "—";
  return `${score.toFixed(1)}%`;
}

export function PredictorLeaderboard({
  predictors,
  showNiche = true,
}: {
  predictors: PredictorRow[];
  showNiche?: boolean;
}) {
  if (predictors.length === 0) {
    return (
      <p className="text-sm text-zinc-500 py-8 text-center">
        No predictors indexed yet. Discovery runs daily — check back soon.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left">
            <th className="px-4 py-3 text-zinc-400 font-medium">Account</th>
            {showNiche && <th className="px-4 py-3 text-zinc-400 font-medium">Niche</th>}
            <th className="px-4 py-3 text-zinc-400 font-medium">Discovery</th>
            <th className="px-4 py-3 text-zinc-400 font-medium">Accuracy</th>
            <th className="px-4 py-3 text-zinc-400 font-medium">Claims (14d)</th>
            <th className="px-4 py-3 text-zinc-400 font-medium">Latest</th>
          </tr>
        </thead>
        <tbody>
          {predictors.map((p) => (
            <tr key={p.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/30">
              <td className="px-4 py-3">
                <Link
                  href={`/predictors/u/${p.username}`}
                  className="font-medium text-white hover:text-sky-400"
                >
                  @{p.username}
                </Link>
                {p.displayName && (
                  <p className="text-xs text-zinc-500 truncate max-w-[200px]">{p.displayName}</p>
                )}
              </td>
              {showNiche && (
                <td className="px-4 py-3">
                  <Link href={`/predictors/${slugFromNiche(p.niche)}`}>
                    <Badge variant="default">{NICHE_META[p.niche].label}</Badge>
                  </Link>
                </td>
              )}
              <td className="px-4 py-3 text-zinc-200">{p.discoveryScore.toFixed(1)}</td>
              <td className="px-4 py-3 text-emerald-400">{formatScore(p.accuracyScore)}</td>
              <td className="px-4 py-3 text-zinc-400">{p.totalClaims}</td>
              <td className="px-4 py-3 text-zinc-500 max-w-xs truncate">
                {p.claims[0]?.claimSummary ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
