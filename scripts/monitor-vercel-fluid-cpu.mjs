#!/usr/bin/env node
/**
 * Monitor Vercel Fluid Active CPU for the xflux project (Hobby included: 4h/mo).
 *
 * Auth (one of):
 *   VERCEL_TOKEN=...          # https://vercel.com/account/tokens
 *   or logged-in `vercel` CLI (reads local auth automatically via same token file)
 *
 * Usage:
 *   node scripts/monitor-vercel-fluid-cpu.mjs
 *   node scripts/monitor-vercel-fluid-cpu.mjs --warn=0.75 --crit=0.90
 *   node scripts/monitor-vercel-fluid-cpu.mjs --json
 *
 * Exit: 0 ok | 1 warn | 2 critical | 3 auth/API error
 */

import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const TEAM_ID = "team_VON5rFb7kcCw1QOGTvfeb49G";
const PROJECT_ID = "prj_cSgaAYNS3nQK5wmYnUKRuf4Oov00";
const PROJECT_NAME = "xflux";
/** Hobby included Active CPU per month */
const HOBBY_CPU_MS = 4 * 60 * 60 * 1000;

const warnArg = process.argv.find((a) => a.startsWith("--warn="));
const critArg = process.argv.find((a) => a.startsWith("--crit="));
const WARN = Number(warnArg?.split("=")[1] ?? 0.75);
const CRIT = Number(critArg?.split("=")[1] ?? 0.9);
const AS_JSON = process.argv.includes("--json");

function loadToken() {
  const fromEnv = process.env.VERCEL_TOKEN?.trim();
  if (fromEnv) return fromEnv;

  const candidates = [
    join(homedir(), "Library/Application Support/com.vercel.cli/auth.json"),
    join(homedir(), ".local/share/com.vercel.cli/auth.json"),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      const auth = JSON.parse(readFileSync(p, "utf8"));
      if (auth.token) return auth.token;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function billingPeriodUtc() {
  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { from, to, now };
}

function looksLikeActiveCpu(row) {
  const blob = JSON.stringify(row).toLowerCase();
  return (
    blob.includes("active_cpu") ||
    blob.includes("active cpu") ||
    blob.includes("fluid_cpu") ||
    (blob.includes("cpu") && blob.includes("function"))
  );
}

function extractCpuMs(rows) {
  let totalMs = 0;
  let matched = 0;
  const samples = [];

  for (const row of rows) {
    if (!looksLikeActiveCpu(row)) continue;
    matched += 1;

    // FOCUS-ish fields vary; try common quantity keys
    const qty =
      Number(row.UsageQuantity ?? row.usageQuantity ?? row.BilledQuantity ?? row.ConsumedQuantity) ||
      0;
    const unit = String(row.UsageUnit ?? row.usageUnit ?? row.PricingUnit ?? "").toLowerCase();

    let ms = 0;
    if (unit.includes("ms") || unit === "millisecond" || unit === "milliseconds") {
      ms = qty;
    } else if (unit.includes("second") || unit === "s" || unit === "sec") {
      ms = qty * 1000;
    } else if (unit.includes("hour") || unit === "h" || unit === "hr") {
      ms = qty * 3600 * 1000;
    } else if (qty > 0 && qty < 1e7) {
      // Heuristic: small numbers → hours; large → ms
      ms = qty < 1000 ? qty * 3600 * 1000 : qty;
    }

    totalMs += ms;
    if (samples.length < 5) {
      samples.push({
        service: row.ServiceName ?? row.serviceName ?? row.ChargeDescription,
        unit,
        qty,
        ms,
      });
    }
  }

  return { totalMs, matched, samples };
}

async function fetchCharges(token, from, to) {
  const url = new URL("https://api.vercel.com/v1/billing/charges");
  url.searchParams.set("teamId", TEAM_ID);
  url.searchParams.set("from", from.toISOString());
  url.searchParams.set("to", to.toISOString());

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/x-ndjson, application/json",
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`billing/charges HTTP ${res.status}: ${text.slice(0, 400)}`);
  }

  const rows = [];
  // JSONL or single JSON array/object
  if (text.trim().startsWith("[")) {
    rows.push(...JSON.parse(text));
  } else if (text.trim().startsWith("{") && !text.includes("\n{")) {
    const one = JSON.parse(text);
    if (Array.isArray(one.charges)) rows.push(...one.charges);
    else if (Array.isArray(one.data)) rows.push(...one.data);
    else rows.push(one);
  } else {
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t) continue;
      try {
        rows.push(JSON.parse(t));
      } catch {
        /* skip */
      }
    }
  }
  return rows;
}

async function fetchProjectUsageHint(token) {
  // Best-effort secondary signal from deployments list (not CPU, but proves API works)
  const url = `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=5`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.deployments ?? []).map((d) => ({
    url: d.url,
    created: d.createdAt,
    state: d.state || d.readyState,
  }));
}

function formatDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

async function main() {
  const token = loadToken();
  if (!token) {
    console.error(
      "Missing Vercel auth. Set VERCEL_TOKEN or run `npx vercel login` once on this machine."
    );
    process.exit(3);
  }

  const { from, to, now } = billingPeriodUtc();
  let rows;
  try {
    rows = await fetchCharges(token, from, to);
  } catch (err) {
    console.error(String(err?.message || err));
    console.error(
      "Tip: create a token at https://vercel.com/account/tokens (scope: read usage/billing for the team)."
    );
    process.exit(3);
  }

  const { totalMs, matched, samples } = extractCpuMs(rows);
  const ratio = totalMs / HOBBY_CPU_MS;
  const remainingMs = Math.max(0, HOBBY_CPU_MS - totalMs);

  let level = "ok";
  let exitCode = 0;
  if (matched === 0) {
    level = "unknown";
    exitCode = 0;
  } else if (ratio >= CRIT) {
    level = "critical";
    exitCode = 2;
  } else if (ratio >= WARN) {
    level = "warn";
    exitCode = 1;
  }

  const payload = {
    project: PROJECT_NAME,
    projectId: PROJECT_ID,
    teamId: TEAM_ID,
    periodStart: from.toISOString(),
    periodEnd: to.toISOString(),
    checkedAt: now.toISOString(),
    hobbyIncludedMs: HOBBY_CPU_MS,
    activeCpuMs: matched ? totalMs : null,
    activeCpuHuman: matched ? formatDuration(totalMs) : null,
    remainingHuman: matched ? formatDuration(remainingMs) : null,
    ratio: matched ? Number(ratio.toFixed(4)) : null,
    level,
    warnAt: WARN,
    critAt: CRIT,
    chargeRows: rows.length,
    cpuChargeMatches: matched,
    samples,
    dashboardUsage: `https://vercel.com/${TEAM_ID}/${PROJECT_NAME}/usage`,
    dashboardObservability: `https://vercel.com/${TEAM_ID}/${PROJECT_NAME}/observability`,
  };

  if (AS_JSON) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log(`Vercel Fluid Active CPU — ${PROJECT_NAME}`);
    console.log(`Period (UTC): ${from.toISOString().slice(0, 10)} → ${to.toISOString().slice(0, 10)}`);
    if (matched === 0) {
      console.log("Status: unknown (no Active CPU rows in billing/charges for this period)");
      console.log(`Billing rows returned: ${rows.length}`);
      console.log("Open usage chart:", payload.dashboardUsage);
      console.log(
        "If API returns empty CPU lines, use Observability → Functions → CPU time, or enable Usage alerts in Vercel."
      );
    } else {
      console.log(
        `Used: ${payload.activeCpuHuman} / 4h  (${(ratio * 100).toFixed(1)}%)  [${level}]`
      );
      console.log(`Remaining: ${payload.remainingHuman}`);
      console.log(`Thresholds: warn≥${WARN * 100}%  crit≥${CRIT * 100}%`);
    }
    console.log("Usage:", payload.dashboardUsage);
  }

  // Side hint — ignore failures
  try {
    await fetchProjectUsageHint(token);
  } catch {
    /* ignore */
  }

  process.exit(exitCode);
}

main();
