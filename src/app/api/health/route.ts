import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isConsumerApiConfigured } from "@/lib/consumer-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  let db: "ok" | "error" = "ok";
  let dbMs = 0;

  try {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbMs = Date.now() - t0;
  } catch (err) {
    db = "error";
    console.error("[health] database check failed:", err);
  }

  const apiServerConfigured = Boolean(
    process.env.XFLUX_API_SERVER_URL &&
      process.env.XFLUX_INTERNAL_KEY &&
      !process.env.XFLUX_INTERNAL_KEY.includes("replace")
  );

  return NextResponse.json({
    status: db === "ok" ? "ok" : "degraded",
    db,
    dbMs,
    upstream: {
      apiServer: apiServerConfigured,
      consumerDirect: isConsumerApiConfigured(),
      consumerUsedInProduction: isConsumerApiConfigured() && !apiServerConfigured,
    },
    elapsedMs: Date.now() - started,
  });
}
