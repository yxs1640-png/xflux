import Link from "next/link";
import { TrendingUp, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PredictorLeaderboard } from "@/components/predictors/predictor-leaderboard";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { SMART_MONEY } from "@/lib/predictor-discovery/copy";
import { getDiscoveryStats, getRecentClaims, getTopPredictors } from "@/lib/predictor-discovery/queries";
import { NICHE_META, PREDICTOR_NICHES, slugFromNiche } from "@/lib/predictor-discovery/types";

export const metadata = pageMetadata({
  title: SMART_MONEY.seoTitle,
  description: SMART_MONEY.seoDescription,
  path: "/predictors",
  keywords: [
    "smart money twitter",
    "twitter accounts to watch trading",
    "macro twitter voices",
    "x market calls monitor",
    "twitter predictor discovery",
  ],
});

export const revalidate = 300;

export default async function PredictorsPage() {
  let predictors: Awaited<ReturnType<typeof getTopPredictors>> = [];
  let recentClaims: Awaited<ReturnType<typeof getRecentClaims>> = [];
  let stats: Awaited<ReturnType<typeof getDiscoveryStats>> | null = null;

  try {
    [predictors, recentClaims, stats] = await Promise.all([
      getTopPredictors({ limit: 25 }),
      getRecentClaims({ limit: 10 }),
      getDiscoveryStats(),
    ]);
  } catch {
    // DB tables may not exist until migration
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 mb-6">
              <Users className="h-4 w-4" />
              {SMART_MONEY.badge}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight max-w-3xl mx-auto">
              {SMART_MONEY.headline}
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {SMART_MONEY.subhead}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=smart_money">
                <Button size="lg">Monitor an account — free</Button>
              </Link>
              <Link href="/use-cases/trading-alerts">
                <Button variant="outline" size="lg">Trading alerts setup</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {PREDICTOR_NICHES.map((niche) => (
              <Link
                key={niche}
                href={`/predictors/${slugFromNiche(niche)}`}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-emerald-500/30 transition-colors text-left"
              >
                <h2 className="font-semibold text-white">{NICHE_META[niche].label}</h2>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {NICHE_META[niche].description}
                </p>
              </Link>
            ))}
          </div>

          {stats?.lastRun && (
            <p className="text-xs text-zinc-600 mb-4 text-center">
              Last scan: {stats.lastRun.startedAt.toLocaleString()} · {stats.predictors} accounts ·{" "}
              {stats.claims} calls indexed
            </p>
          )}

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Most active voices right now
            </h2>
            <p className="text-sm text-zinc-500 mb-4">
              Sorted by activity score — how often they post extractable forward-looking calls.
            </p>
            <PredictorLeaderboard predictors={predictors} />
          </section>

          {recentClaims.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">Latest calls we picked up</h2>
              <ul className="space-y-3">
                {recentClaims.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-sm"
                  >
                    <Link
                      href={`/predictors/u/${c.predictor.username}`}
                      className="text-sky-400 hover:underline font-medium"
                    >
                      @{c.predictor.username}
                    </Link>
                    <span className="text-zinc-600 mx-2">·</span>
                    <span className="text-zinc-400">{c.claimSummary}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-sm text-zinc-500 leading-relaxed">
            <p>{SMART_MONEY.disclaimer}</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
