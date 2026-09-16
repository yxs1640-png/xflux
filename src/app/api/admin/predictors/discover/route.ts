import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { runPredictorDiscovery } from "@/lib/predictor-discovery/run-discovery";
import type { PredictorNiche } from "@prisma/client";
import { PREDICTOR_NICHES } from "@/lib/predictor-discovery/types";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let niche: PredictorNiche | undefined;
  try {
    const body = await request.json();
    if (body.niche && PREDICTOR_NICHES.includes(body.niche)) {
      niche = body.niche;
    }
  } catch {
    // empty body ok
  }

  try {
    const result = await runPredictorDiscovery({ niche });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Discovery failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
