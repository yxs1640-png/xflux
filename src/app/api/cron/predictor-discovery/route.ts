import { NextRequest, NextResponse } from "next/server";
import { runPredictorDiscovery } from "@/lib/predictor-discovery/run-discovery";

export const maxDuration = 300;

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
    const result = await runPredictorDiscovery();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Discovery failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
