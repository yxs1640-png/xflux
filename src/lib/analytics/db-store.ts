import "server-only";

import type { AnalyticsEventName } from "./events";
import { prisma } from "@/lib/db";

const PAGE_METRIC_PREFIX = "pageview:";
const EVENT_METRIC_PREFIX = "event:";

/** Raw product events older than this are deleted. */
const PRODUCT_EVENT_RETENTION_DAYS = 90;
/** Session dedupe rows older than this are deleted. */
const SESSION_DAY_RETENTION_DAYS = 30;
/** Daily rollup rows older than this are deleted. */
const DAILY_RETENTION_DAYS = 180;

const IGNORED_PATH_PREFIXES = ["/_next/", "/api/", "/favicon", "/robots", "/sitemap"];
const IGNORED_PATH_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg", ".css", ".js", ".map"];

const ALLOWED_CLIENT_EVENTS = new Set<string>([
  "cta_clicked",
  "login_completed",
  "plan_selected",
  "checkout_completed",
  "checkout_canceled",
  "api_key_created",
  "api_key_revoked",
  "monitor_created",
  "monitor_checked",
  "webhook_configured",
  "webhook_tested",
]);

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function normalizePagePath(raw: string): string | null {
  let path = raw.trim();
  if (!path.startsWith("/")) path = `/${path}`;
  const q = path.indexOf("?");
  if (q >= 0) path = path.slice(0, q);
  if (path.length > 200) path = path.slice(0, 200);
  if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);

  const lower = path.toLowerCase();
  if (IGNORED_PATH_PREFIXES.some((p) => lower.startsWith(p))) return null;
  if (IGNORED_PATH_EXTENSIONS.some((ext) => lower.endsWith(ext))) return null;

  return path;
}

export function isValidSessionId(sessionId: string): boolean {
  return /^[a-zA-Z0-9_-]{8,64}$/.test(sessionId);
}

function pageMetric(path: string): string {
  return `${PAGE_METRIC_PREFIX}${path}`;
}

function eventMetric(event: string): string {
  return `${EVENT_METRIC_PREFIX}${event}`;
}

let pruneInFlight = false;

async function maybePruneOldRows(): Promise<void> {
  if (pruneInFlight || Math.random() > 0.02) return;
  pruneInFlight = true;
  try {
    const now = new Date();
    const sessionCutoff = addUtcDays(startOfUtcDay(now), -SESSION_DAY_RETENTION_DAYS);
    const dailyCutoff = addUtcDays(startOfUtcDay(now), -DAILY_RETENTION_DAYS);
    const eventCutoff = addUtcDays(now, -PRODUCT_EVENT_RETENTION_DAYS);

    await prisma.$transaction([
      prisma.analyticsSessionDay.deleteMany({ where: { day: { lt: sessionCutoff } } }),
      prisma.analyticsDaily.deleteMany({ where: { day: { lt: dailyCutoff } } }),
      prisma.productEvent.deleteMany({ where: { createdAt: { lt: eventCutoff } } }),
    ]);
  } catch (err) {
    console.error("[analytics-db] prune failed:", err);
  } finally {
    pruneInFlight = false;
  }
}

/** Fire-and-forget wrapper — never throws to callers. */
export function recordPageViewAsync(path: string, sessionId: string): void {
  void recordPageView(path, sessionId).catch((err) => {
    console.error("[analytics-db] recordPageView failed:", err);
  });
}

export async function recordPageView(path: string, sessionId: string): Promise<void> {
  const normalized = normalizePagePath(path);
  if (!normalized || !isValidSessionId(sessionId)) return;

  const day = startOfUtcDay(new Date());
  const metric = pageMetric(normalized);

  const inserted = await prisma.analyticsSessionDay.createMany({
    data: [{ day, metric, sessionId }],
    skipDuplicates: true,
  });
  const isNewSession = inserted.count > 0;

  await prisma.analyticsDaily.upsert({
    where: { day_metric: { day, metric } },
    create: { day, metric, pv: 1, uv: isNewSession ? 1 : 0 },
    update: {
      pv: { increment: 1 },
      ...(isNewSession ? { uv: { increment: 1 } } : {}),
    },
  });

  void maybePruneOldRows();
}

export function recordProductEventAsync(input: {
  event: AnalyticsEventName | string;
  userId?: string | null;
  sessionId?: string | null;
  path?: string | null;
  props?: Record<string, unknown>;
}): void {
  void recordProductEvent(input).catch((err) => {
    console.error("[analytics-db] recordProductEvent failed:", err);
  });
}

export async function recordProductEvent(input: {
  event: AnalyticsEventName | string;
  userId?: string | null;
  sessionId?: string | null;
  path?: string | null;
  props?: Record<string, unknown>;
}): Promise<void> {
  const { event, userId, sessionId, props } = input;
  const path = input.path ? normalizePagePath(input.path) : null;

  const day = startOfUtcDay(new Date());
  const metric = eventMetric(event);

  await prisma.$transaction([
    prisma.analyticsDaily.upsert({
      where: { day_metric: { day, metric } },
      create: { day, metric, pv: 1, uv: 0 },
      update: { pv: { increment: 1 } },
    }),
    prisma.productEvent.create({
      data: {
        event,
        userId: userId ?? null,
        sessionId: sessionId && isValidSessionId(sessionId) ? sessionId : null,
        path,
        props: props ? (props as object) : undefined,
      },
    }),
  ]);

  void maybePruneOldRows();
}

export function isAllowedClientEvent(event: string): boolean {
  return ALLOWED_CLIENT_EVENTS.has(event);
}

export async function queryPageStats(days = 30, limit = 50) {
  const since = addUtcDays(startOfUtcDay(new Date()), -days);
  const rows = await prisma.analyticsDaily.findMany({
    where: {
      day: { gte: since },
      metric: { startsWith: PAGE_METRIC_PREFIX },
    },
  });

  const byPath = new Map<string, { pv: number; uv: number }>();
  for (const row of rows) {
    const path = row.metric.slice(PAGE_METRIC_PREFIX.length);
    const prev = byPath.get(path) ?? { pv: 0, uv: 0 };
    prev.pv += row.pv;
    prev.uv += row.uv;
    byPath.set(path, prev);
  }

  return [...byPath.entries()]
    .map(([path, stats]) => ({ path, ...stats }))
    .sort((a, b) => b.pv - a.pv)
    .slice(0, limit);
}

export async function queryEventStats(days = 30) {
  const since = addUtcDays(startOfUtcDay(new Date()), -days);
  const rows = await prisma.analyticsDaily.findMany({
    where: {
      day: { gte: since },
      metric: { startsWith: EVENT_METRIC_PREFIX },
    },
  });

  const byEvent = new Map<string, number>();
  for (const row of rows) {
    const event = row.metric.slice(EVENT_METRIC_PREFIX.length);
    byEvent.set(event, (byEvent.get(event) ?? 0) + row.pv);
  }

  return [...byEvent.entries()]
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count);
}
