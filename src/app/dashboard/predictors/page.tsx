import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { PredictorLeaderboard } from "@/components/predictors/predictor-leaderboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDiscoveryStats, getTopPredictors } from "@/lib/predictor-discovery/queries";
import { AdminDiscoverButton } from "@/components/predictors/admin-discover-button";

export default async function DashboardPredictorsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  let predictors: Awaited<ReturnType<typeof getTopPredictors>> = [];
  let stats: Awaited<ReturnType<typeof getDiscoveryStats>> | null = null;

  try {
    [predictors, stats] = await Promise.all([
      getTopPredictors({ limit: 20 }),
      getDiscoveryStats(),
    ]);
  } catch {
    // tables not migrated
  }

  const isAdmin = isAdminEmail(session.user.email);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Predictor Discovery</h1>
        <p className="text-zinc-400">
          Accounts making macro, trading, crypto, and geopolitics predictions on X — ranked by
          discovery score.{" "}
          <Link href="/predictors" className="text-sky-400 hover:underline">
            Public leaderboard
          </Link>
        </p>
      </div>

      <Card className="mb-6 border-violet-500/20 bg-violet-500/5">
        <CardHeader>
          <CardTitle>One-click monitors</CardTitle>
          <CardDescription>
            Click a predictor profile → <strong className="text-white">Monitor @account</strong> to
            add a webhook-ready monitor. Use{" "}
            <Link href="/docs/guides/trading-keywords" className="text-sky-400 hover:underline">
              keyword templates
            </Link>{" "}
            to filter noise.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/monitors">
            <Button variant="outline">Your monitors</Button>
          </Link>
          <Link href="/docs/integrations/make">
            <Button variant="outline">Make.com routing</Button>
          </Link>
        </CardContent>
      </Card>

      {stats?.lastRun && (
        <p className="text-xs text-zinc-600 mb-4">
          Indexed: {stats.predictors} predictors · {stats.claims} claims · Last run{" "}
          {stats.lastRun.startedAt.toLocaleString()}
        </p>
      )}

      {isAdmin && <AdminDiscoverButton className="mb-6" />}

      <PredictorLeaderboard predictors={predictors} />
    </div>
  );
}
