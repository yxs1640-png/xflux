import { PlanTier } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "./db";

/** Max authenticated API requests per rolling calendar minute (fixed window). */
export const PLAN_RATE_LIMITS_PER_MINUTE: Record<PlanTier, number> = {
  FREE: 10,
  BASIC: 30,
  GROWTH: 60,
  PRO: 120,
  SCALE: 300,
  ENTERPRISE: 600,
};

const WINDOW_MS = 60_000;

export type RateLimitSnapshot = {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
};

export function getRateLimitWindowKey(now = Date.now()): string {
  return String(Math.floor(now / WINDOW_MS));
}

export function getRateLimitResetEpochSec(windowKey: string): number {
  return (Number(windowKey) + 1) * (WINDOW_MS / 1000);
}

export async function checkAndConsumeRateLimit(
  userId: string,
  planTier: PlanTier
): Promise<RateLimitSnapshot & { count: number }> {
  const limit = PLAN_RATE_LIMITS_PER_MINUTE[planTier];
  const now = Date.now();
  const windowKey = getRateLimitWindowKey(now);
  const reset = getRateLimitResetEpochSec(windowKey);
  const retryAfter = Math.max(1, Math.ceil(reset - now / 1000));

  const row = await prisma.apiRateLimitWindow.upsert({
    where: {
      userId_windowKey: { userId, windowKey },
    },
    create: { userId, windowKey, count: 1 },
    update: { count: { increment: 1 } },
  });

  const allowed = row.count <= limit;

  return {
    allowed,
    limit,
    remaining: Math.max(0, limit - row.count),
    reset,
    retryAfter,
    count: row.count,
  };
}

export function applyRateLimitHeaders(
  response: NextResponse,
  rateLimit: Pick<RateLimitSnapshot, "limit" | "remaining" | "reset">
) {
  response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
  response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  response.headers.set("X-RateLimit-Reset", String(rateLimit.reset));
}

export function applyQuotaHeaders(
  response: NextResponse,
  quota: { limit: number; remaining: number }
) {
  response.headers.set("X-Quota-Limit", String(quota.limit));
  response.headers.set("X-Quota-Remaining", String(quota.remaining));
}

export function rateLimitExceededResponse(
  rateLimit: RateLimitSnapshot
): NextResponse {
  const response = NextResponse.json(
    {
      error: "Rate limit exceeded",
      code: "RATE_LIMIT_EXCEEDED",
      limit: rateLimit.limit,
      window: "1m",
      retryAfter: rateLimit.retryAfter,
    },
    { status: 429 }
  );
  response.headers.set("Retry-After", String(rateLimit.retryAfter));
  applyRateLimitHeaders(response, { ...rateLimit, remaining: 0 });
  return response;
}
