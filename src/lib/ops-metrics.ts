import "server-only";

import { prisma } from "@/lib/db";

const CST_OFFSET_MIN = 8 * 60;

export function toCstDateString(d: Date): string {
  const cst = new Date(d.getTime() + (CST_OFFSET_MIN + d.getTimezoneOffset()) * 60_000);
  return cst.toISOString().slice(0, 10);
}

export function cstDayBounds(dateStr: string): { start: Date; end: Date } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - CST_OFFSET_MIN * 60_000);
  const end = new Date(start.getTime() + 86_400_000);
  return { start, end };
}

export type OpsDayRow = {
  date: string;
  signups: number;
  apiCalls: number;
  apiUsers: number;
  monitorHits: number;
  webhookOk: number;
  feedback: number;
  mcpCalls: number;
};

export type OpsMetrics = {
  generatedAt: string;
  timezone: "Asia/Shanghai";
  baselines: {
    totalUsers: number;
    paidUsers: number;
    activeMonitors: number;
    webhookConfigured: number;
    feedbackTotal: number;
  };
  days: OpsDayRow[];
  recentSignups: {
    email: string;
    planTier: string;
    signupSource: string | null;
    createdAt: string;
  }[];
  signupSources7d: { source: string; count: number }[];
};

async function dayRow(dateStr: string): Promise<OpsDayRow> {
  const { start, end } = cstDayBounds(dateStr);
  const range = { gte: start, lt: end };

  const [signups, apiCalls, apiUsers, monitorHits, webhookOk, feedback, mcpCalls] =
    await Promise.all([
      prisma.user.count({ where: { createdAt: range } }),
      prisma.apiLog.count({ where: { createdAt: range } }),
      prisma.apiLog
        .groupBy({ by: ["userId"], where: { createdAt: range } })
        .then((rows) => rows.length),
      prisma.monitorHit.count({ where: { detectedAt: range } }),
      prisma.monitorWebhookDelivery.count({
        where: { createdAt: range, status: "SUCCESS" },
      }),
      prisma.userFeedback.count({ where: { createdAt: range } }),
      prisma.apiLog.count({ where: { createdAt: range, client: "mcp" } }),
    ]);

  return {
    date: dateStr,
    signups,
    apiCalls,
    apiUsers,
    monitorHits,
    webhookOk,
    feedback,
    mcpCalls,
  };
}

export async function getOpsMetrics(daysBack = 14): Promise<OpsMetrics> {
  const now = new Date();
  const todayCst = toCstDateString(now);
  const dates: string[] = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date(now.getTime() - i * 86_400_000);
    dates.push(toCstDateString(d));
  }
  // unique preserve order (DST edge rare)
  const uniqueDates = [...new Set(dates)];
  if (!uniqueDates.includes(todayCst)) uniqueDates.unshift(todayCst);

  const since7d = new Date(now.getTime() - 7 * 86_400_000);

  const [baselines, dayRows, recentSignups, sourceGroups] = await Promise.all([
    Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { planTier: { not: "FREE" } } }),
      prisma.monitorTask.count({ where: { isActive: true } }),
      prisma.monitorTask.count({
        where: { isActive: true, webhookUrl: { not: null } },
      }),
      prisma.userFeedback.count(),
    ]).then(([totalUsers, paidUsers, activeMonitors, webhookConfigured, feedbackTotal]) => ({
      totalUsers,
      paidUsers,
      activeMonitors,
      webhookConfigured,
      feedbackTotal,
    })),
    Promise.all(uniqueDates.map((d) => dayRow(d))),
    prisma.user.findMany({
      where: { createdAt: { gte: since7d } },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        email: true,
        planTier: true,
        signupSource: true,
        createdAt: true,
      },
    }),
    prisma.user.groupBy({
      by: ["signupSource"],
      where: { createdAt: { gte: since7d } },
      _count: true,
      orderBy: { _count: { signupSource: "desc" } },
    }),
  ]);

  return {
    generatedAt: now.toISOString(),
    timezone: "Asia/Shanghai",
    baselines,
    days: dayRows,
    recentSignups: recentSignups.map((u) => ({
      email: u.email,
      planTier: u.planTier,
      signupSource: u.signupSource,
      createdAt: u.createdAt.toISOString(),
    })),
    signupSources7d: sourceGroups.map((g) => ({
      source: g.signupSource ?? "(none)",
      count: g._count,
    })),
  };
}
