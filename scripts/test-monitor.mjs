#!/usr/bin/env node
/**
 * Monitor flow diagnostics (read-only unless --poll is passed).
 *
 * Usage:
 *   node scripts/test-monitor.mjs           # list monitors + env status
 *   node scripts/test-monitor.mjs --poll ID # poll one monitor by id
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const prisma = new PrismaClient();
const pollId = process.argv.includes("--poll") ? process.argv[process.argv.indexOf("--poll") + 1] : null;

function envStatus() {
  const key = process.env.CONSUMER_API_KEY?.trim() ?? "";
  const worker = process.env.MONITOR_WORKER_ENABLED === "true";
  console.log("Environment:");
  console.log(`  CONSUMER_API_KEY: ${key.length > 3 ? "ok" : "missing"}`);
  console.log(`  MONITOR_WORKER_ENABLED: ${worker ? "true (auto-poll in dev)" : "false (use Check now)"}`);
  console.log("");
}

async function listMonitors() {
  const monitors = await prisma.monitorTask.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      user: { select: { email: true, planTier: true } },
      _count: { select: { hits: true, deliveries: true } },
    },
  });

  if (!monitors.length) {
    console.log("No monitors in database. Create one at /dashboard/monitors");
    return;
  }

  console.log("Recent monitors:");
  for (const m of monitors) {
    console.log(`  ${m.id}`);
    console.log(`    @${m.targetUsername} · ${m.status} · user=${m.user.email} (${m.user.planTier})`);
    console.log(`    interval=${m.checkInterval}s · lastCheck=${m.lastCheckAt?.toISOString() ?? "never"}`);
    console.log(`    hits=${m._count.hits} deliveries=${m._count.deliveries} webhook=${m.webhookUrl ? "yes" : "no"}`);
    if (m.lastError) console.log(`    lastError=${m.lastError}`);
  }
}

async function main() {
  envStatus();
  if (pollId) {
    console.log(`Polling ${pollId}...\n`);
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(
      "npx",
      ["--yes", "tsx", "scripts/poll-monitor.ts", pollId],
      { cwd: ROOT, stdio: "inherit", env: process.env }
    );
    process.exit(result.status ?? 1);
  } else {
    await listMonitors();
    console.log("\nTo poll manually: node scripts/test-monitor.mjs --poll <monitor-id>");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
