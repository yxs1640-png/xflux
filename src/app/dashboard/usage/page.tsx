import { cache } from "react";
import { PLAN_LIMITS } from "@/lib/quota";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { formatNumber } from "@/lib/utils";
import { buildDailyChartData } from "@/lib/chart-data";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { prisma } from "@/lib/db";

export const preferredRegion = "bom1";

function thirtyDaysAgo() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 30);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

const getUsagePageData = cache(async () => {
  const session = await requireDashboardSession();
  const userId = session.user.id;
  const since = thirtyDaysAgo();

  const [user, logs, endpointGroups] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { planTier: true, quotaUsed: true },
    }),
    prisma.apiLog.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.apiLog.groupBy({
      by: ["endpoint"],
      where: { userId, createdAt: { gte: since } },
      _count: { endpoint: true },
      orderBy: { _count: { endpoint: "desc" } },
      take: 10,
    }),
  ]);

  return { user, logs, endpointGroups };
});

export default async function UsagePage() {
  const { user, logs, endpointGroups } = await getUsagePageData();

  if (!user) return null;

  const limit = PLAN_LIMITS[user.planTier];
  const last30Days = buildDailyChartData(logs, 30);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Usage</h1>
        <p className="text-zinc-400">Monitor your API consumption</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardDescription>Used This Month</CardDescription>
            <CardTitle className="text-3xl">{formatNumber(user.quotaUsed)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Monthly Limit</CardDescription>
            <CardTitle className="text-3xl">{formatNumber(limit)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Remaining</CardDescription>
            <CardTitle className="text-3xl">
              {formatNumber(Math.max(0, limit - user.quotaUsed))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>30-Day Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageChart data={last30Days} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          {endpointGroups.length === 0 ? (
            <p className="text-zinc-500 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {endpointGroups.map(({ endpoint, _count }) => (
                <div key={endpoint} className="flex justify-between text-sm">
                  <span className="font-mono text-zinc-300">{endpoint}</span>
                  <span className="text-zinc-500">{_count.endpoint} calls</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
