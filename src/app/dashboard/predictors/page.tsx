import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { PredictorLeaderboard } from "@/components/predictors/predictor-leaderboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SMART_MONEY } from "@/lib/predictor-discovery/copy";
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
        <h1 className="text-2xl font-bold text-white">{SMART_MONEY.dashboardTitle}</h1>
        <p className="text-zinc-400 max-w-2xl leading-relaxed">
          {SMART_MONEY.dashboardIntro}{" "}
          <Link href="/predictors" className="text-sky-400 hover:underline">
            Public leaderboard
          </Link>
        </p>
      </div>

      <Card className="mb-6 border-emerald-500/20 bg-emerald-500/5">
        <CardHeader>
          <CardTitle>From watchlist to webhook</CardTitle>
          <CardDescription>
            Open any profile → <strong className="text-white">Monitor @account</strong> adds them to
            your Monitors. On Starter+, hits POST to your webhook or{" "}
            <Link href="/docs/integrations/make" className="text-sky-400 hover:underline">
              Make.com
            </Link>
            . Use{" "}
            <Link href="/docs/guides/trading-keywords" className="text-sky-400 hover:underline">
              keyword filters
            </Link>{" "}
            to cut noise.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/monitors">
            <Button variant="outline">Your monitors</Button>
          </Link>
          <Link href="/use-cases/trading-alerts">
            <Button variant="outline">Trading alerts guide</Button>
          </Link>
        </CardContent>
      </Card>

      {stats?.lastRun && (
        <p className="text-xs text-zinc-600 mb-4">
          {stats.predictors} accounts · {stats.claims} calls · Last scan{" "}
          {stats.lastRun.startedAt.toLocaleString()}
        </p>
      )}

      {isAdmin && (
        <div className="mb-6">
          <AdminDiscoverButton />
          <p className="text-xs text-zinc-600 mt-2">{SMART_MONEY.emptyAdminHint}</p>
        </div>
      )}

      <PredictorLeaderboard predictors={predictors} />
    </div>
  );
}
