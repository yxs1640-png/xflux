import { NextRequest, NextResponse } from "next/server";
import { runPredictorDiscovery } from "@/lib/predictor-discovery/run-discovery";
import { PREDICTOR_NICHES } from "@/lib/predictor-discovery/types";

export const maxDuration = 60;

/**
 * Vercel Cron is disabled (`crons: []` in vercel.json) to save Fluid Active CPU.
 * Trigger manually with Authorization: Bearer $CRON_SECRET, or re-add a schedule later / move to Fly.
 */
function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    return request.headers.get("authorization") === `Bearer ${secret}`;
  }
  // No CRON_SECRET: accept only Vercel-scheduled invocations (see vercel.com/docs/cron-jobs)
  const schedule = request.headers.get("x-vercel-cron-schedule");
  const ua = request.headers.get("user-agent") ?? "";
  return Boolean(schedule && ua.includes("vercel-cron"));
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const niche = PREDICTOR_NICHES[Math.floor(Date.now() / 86_400_000) % PREDICTOR_NICHES.length];
    const result = await runPredictorDiscovery({ niche });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Discovery failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
