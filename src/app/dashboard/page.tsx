import { cache } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { PLAN_LIMITS } from "@/lib/quota";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { WelcomeDashboardShell } from "@/components/dashboard/welcome-dashboard-shell";
import { Activity, Key, Radar, Zap } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { buildDailyChartData } from "@/lib/chart-data";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { isMonitorHitUnread } from "@/lib/monitor-alerts";
import { prisma } from "@/lib/db";

const getDashboardHomeData = cache(async () => {
  const session = await requireDashboardSession();
  const userId = session.user.id;

  const [user, recentHits, apiLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        planTier: true,
        quotaUsed: true,
        monitorHitsReadAt: true,
        apiKeys: { where: { isActive: true } },
        monitorTasks: { where: { isActive: true } },
      },
    }),
    prisma.monitorHit.findMany({
      where: { task: { userId } },
      orderBy: { detectedAt: "desc" },
      take: 5,
      include: {
        task: { select: { targetUsername: true } },
      },
    }),
    prisma.apiLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 35,
      select: {
        id: true,
        method: true,
        endpoint: true,
        statusCode: true,
        responseTime: true,
        createdAt: true,
      },
    }),
  ]);

  if (!user) return null;

  return { user, recentHits, apiLogs };
});

export default async function DashboardPage() {
  const data = await getDashboardHomeData();
  if (!data) return null;

  const { user, recentHits, apiLogs } = data;

  const limit = PLAN_LIMITS[user.planTier];
  const usagePercent = Math.round((user.quotaUsed / limit) * 100);

  const last7Days = buildDailyChartData(apiLogs, 7);

  const stats = [
    {
      label: "API Calls Used",
      value: `${formatNumber(user.quotaUsed)} / ${formatNumber(limit)}`,
      icon: Activity,
      sub: `${usagePercent}% of monthly quota`,
    },
    {
      label: "Active API Keys",
      value: user.apiKeys.length.toString(),
      icon: Key,
      sub: "Manage in API Keys",
    },
    {
      label: "Monitor Tasks",
      value: user.monitorTasks.length.toString(),
      icon: Radar,
      sub: "Active monitors running",
    },
    {
      label: "Plan",
      value: user.planTier,
      icon: Zap,
      sub: "Upgrade for more quota",
    },
  ];

  const hasApiCalls = user.quotaUsed > 0 || apiLogs.length > 0;
  const hasMonitors = user.monitorTasks.length > 0;

  return (
    <Suspense fallback={null}>
      <WelcomeDashboardShell
        hasApiCalls={hasApiCalls}
        hasMonitors={hasMonitors}
        userName={user.name}
      >
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-zinc-400">Welcome back, {user.name || user.email}</p>
            </div>
            <Badge variant="sky">{user.planTier}</Badge>
          </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <stat.icon className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-zinc-500 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>API Usage (7 days)</CardTitle>
            <CardDescription>Daily API call volume</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart data={last7Days} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent API Calls</CardTitle>
            <CardDescription>Latest requests to your API key</CardDescription>
          </CardHeader>
          <CardContent>
            {apiLogs.length === 0 ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-sm text-zinc-500">No API calls yet.</p>
                <p className="text-xs text-zinc-600">
                  Follow the{" "}
                  <Link href="/docs/quickstart" className="text-sky-400 hover:text-sky-300">
                    quickstart guide
                  </Link>{" "}
                  to make your first request.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {apiLogs.slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-sm border-b border-zinc-800 pb-2"
                  >
                    <div>
                      <span className="text-zinc-300 font-mono">{log.method}</span>{" "}
                      <span className="text-zinc-500">{log.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={log.statusCode < 400 ? "success" : "warning"}
                      >
                        {log.statusCode}
                      </Badge>
                      <span className="text-zinc-600">{log.responseTime}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Monitor Hits</CardTitle>
            <CardDescription>New tweets detected by your monitors</CardDescription>
          </CardHeader>
          <CardContent>
            {recentHits.length === 0 ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-sm text-zinc-500">No monitor hits yet.</p>
                <Link href="/dashboard/monitors">
                  <span className="text-sm text-sky-400 hover:text-sky-300">
                    Add a monitor →
                  </span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentHits.map((hit) => {
                  const isNew = isMonitorHitUnread(hit.detectedAt, user.monitorHitsReadAt);
                  return (
                  <div
                    key={hit.id}
                    className="text-sm border-b border-zinc-800 pb-2"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sky-400">@{hit.task.targetUsername}</span>
                        {isNew && (
                          <Badge variant="sky" className="text-[10px] px-1.5 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-zinc-600 shrink-0">
                        {new Date(hit.detectedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-zinc-400 line-clamp-2">{hit.text}</p>
                  </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
        </div>
      </WelcomeDashboardShell>
    </Suspense>
  );
}
