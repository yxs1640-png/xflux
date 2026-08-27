#!/usr/bin/env node
/**
 * Query self-hosted analytics rollups (AnalyticsDaily / ProductEvent).
 *
 * Usage:
 *   node scripts/query-analytics.mjs
 *   node scripts/query-analytics.mjs --days=30 --limit=40
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const PAGE_PREFIX = "pageview:";
const EVENT_PREFIX = "event:";

function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

async function main() {
  const daysArg = process.argv.find((a) => a.startsWith("--days="));
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const days = Number(daysArg?.split("=")[1] ?? 30);
  const limit = Number(limitArg?.split("=")[1] ?? 50);
  const since = addUtcDays(startOfUtcDay(new Date()), -days);

  const rows = await prisma.analyticsDaily.findMany({
    where: { day: { gte: since } },
  });

  const byPath = new Map();
  const byEvent = new Map();

  for (const row of rows) {
    if (row.metric.startsWith(PAGE_PREFIX)) {
      const path = row.metric.slice(PAGE_PREFIX.length);
      const prev = byPath.get(path) ?? { pv: 0, uv: 0 };
      prev.pv += row.pv;
      prev.uv += row.uv;
      byPath.set(path, prev);
    } else if (row.metric.startsWith(EVENT_PREFIX)) {
      const event = row.metric.slice(EVENT_PREFIX.length);
      byEvent.set(event, (byEvent.get(event) ?? 0) + row.pv);
    }
  }

  const pageStats = [...byPath.entries()]
    .map(([path, s]) => ({ path, ...s }))
    .sort((a, b) => b.pv - a.pv)
    .slice(0, limit);

  const eventStats = [...byEvent.entries()]
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count);

  const [sessionRows, productEvents, dailyRows] = await Promise.all([
    prisma.analyticsSessionDay.count(),
    prisma.productEvent.count(),
    prisma.analyticsDaily.count(),
  ]);

  console.log(`\nAnalytics rollups — last ${days} days\n`);
  console.log(`${"Path".padEnd(44)} ${"PV".padStart(8)} ${"UV*".padStart(8)}`);
  console.log("-".repeat(62));
  for (const row of pageStats) {
    console.log(`${row.path.padEnd(44)} ${String(row.pv).padStart(8)} ${String(row.uv).padStart(8)}`);
  }
  if (pageStats.length === 0) console.log("(no pageviews yet)");

  console.log(`\nProduct events — last ${days} days (daily counts)\n`);
  console.log(`${"Event".padEnd(32)} ${"Count".padStart(8)}`);
  console.log("-".repeat(42));
  for (const row of eventStats) {
    console.log(`${row.event.padEnd(32)} ${String(row.count).padStart(8)}`);
  }
  if (eventStats.length === 0) console.log("(no events yet)");

  console.log("\nTable sizes (approx rows):");
  console.log(`  AnalyticsDaily:      ${dailyRows}`);
  console.log(`  AnalyticsSessionDay: ${sessionRows}`);
  console.log(`  ProductEvent:        ${productEvents}`);
  console.log("\n* UV sums paths — site-wide UV is lower. SessionDay rows prune after ~30 days.\n");

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
