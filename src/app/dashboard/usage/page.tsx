import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/quota";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { formatNumber } from "@/lib/utils";
import { buildDailyChartData } from "@/lib/chart-data";

export default async function UsagePage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: {
      apiLogs: { orderBy: { createdAt: "desc" }, take: 500 },
    },
  });

  if (!user) return null;

  const limit = PLAN_LIMITS[user.planTier];

  const endpointStats = user.apiLogs.reduce(
    (acc, log) => {
      acc[log.endpoint] = (acc[log.endpoint] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const last30Days = buildDailyChartData(user.apiLogs, 30);

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
          {Object.keys(endpointStats).length === 0 ? (
            <p className="text-zinc-500 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(endpointStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([endpoint, count]) => (
                  <div key={endpoint} className="flex justify-between text-sm">
                    <span className="font-mono text-zinc-300">{endpoint}</span>
                    <span className="text-zinc-500">{count} calls</span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
