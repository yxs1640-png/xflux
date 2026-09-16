import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PredictorClaimsList } from "@/components/predictors/predictor-claims-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { getPredictorByUsername } from "@/lib/predictor-discovery/queries";
import { NICHE_META, slugFromNiche } from "@/lib/predictor-discovery/types";

export const revalidate = 300;

type PageProps = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  let predictor = null;
  try {
    predictor = await getPredictorByUsername(username);
  } catch {
    return {};
  }
  if (!predictor) return {};

  return pageMetadata({
    title: `@${predictor.username} — X Predictor Profile`,
    description: `Prediction claims and accuracy tracking for @${predictor.username} on X/Twitter.`,
    path: `/predictors/u/${predictor.username}`,
  });
}

export default async function PredictorProfilePage({ params }: PageProps) {
  const { username } = await params;
  let predictor: Awaited<ReturnType<typeof getPredictorByUsername>> = null;

  try {
    predictor = await getPredictorByUsername(username);
  } catch {
    notFound();
  }

  if (!predictor) notFound();

  const nicheMeta = NICHE_META[predictor.niche];

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href={`/predictors/${slugFromNiche(predictor.niche)}`} className="text-sm text-sky-400 hover:underline">
            ← {nicheMeta.label}
          </Link>

          <div className="mt-6 mb-8">
            <h1 className="text-3xl font-bold text-white">@{predictor.username}</h1>
            {predictor.displayName && (
              <p className="text-zinc-400 mt-1">{predictor.displayName}</p>
            )}
            {predictor.bio && (
              <p className="text-sm text-zinc-500 mt-3 leading-relaxed">{predictor.bio}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="default">{nicheMeta.label}</Badge>
              {predictor.followerCount != null && (
                <Badge variant="default">{predictor.followerCount.toLocaleString()} followers</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Discovery", value: predictor.discoveryScore.toFixed(1) },
              {
                label: "Accuracy",
                value: predictor.accuracyScore != null ? `${predictor.accuracyScore}%` : "—",
              },
              { label: "Claims", value: String(predictor.totalClaims) },
              { label: "Hits / Misses", value: `${predictor.hitCount} / ${predictor.missCount}` },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                <p className="text-xs text-zinc-500">{s.label}</p>
                <p className="text-lg font-semibold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <Link href={`/dashboard/monitors?add=${predictor.username}`}>
            <Button className="mb-8">Monitor @{predictor.username}</Button>
          </Link>

          <h2 className="text-lg font-semibold text-white mb-4">Extracted predictions (14d window)</h2>
          <PredictorClaimsList claims={predictor.claims} />

          <p className="text-xs text-zinc-600 mt-8">
            Not financial advice. Accuracy uses author follow-up language heuristics, not market
            backtests.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
