import { PlanTier } from "@prisma/client";
import { NextResponse } from "next/server";
import { checkAndConsumeQuota } from "./quota";
import {
  applyQuotaHeaders,
  applyRateLimitHeaders,
  checkAndConsumeRateLimit,
  rateLimitExceededResponse,
  RateLimitSnapshot,
} from "./rate-limit";

export type ApiLimitsResult =
  | {
      ok: true;
      quota: { remaining: number; limit: number };
      rateLimit: RateLimitSnapshot;
    }
  | { ok: false; response: NextResponse };

export async function enforceApiRequestLimits(
  userId: string,
  planTier: PlanTier
): Promise<ApiLimitsResult> {
  const rateLimit = await checkAndConsumeRateLimit(userId, planTier);
  if (!rateLimit.allowed) {
    return { ok: false, response: rateLimitExceededResponse(rateLimit) };
  }

  const quota = await checkAndConsumeQuota(userId);
  if (!quota.allowed) {
    const response = NextResponse.json(
      {
        error: "Monthly quota exceeded",
        code: "QUOTA_EXCEEDED",
        limit: quota.limit,
        remaining: quota.remaining,
      },
      { status: 429 }
    );
    applyQuotaHeaders(response, quota);
    applyRateLimitHeaders(response, rateLimit);
    return { ok: false, response };
  }

  return { ok: true, quota, rateLimit };
}

export function applyApiLimitHeaders(
  response: NextResponse,
  quota: { limit: number; remaining: number },
  rateLimit: Pick<RateLimitSnapshot, "limit" | "remaining" | "reset">
) {
  applyQuotaHeaders(response, quota);
  applyRateLimitHeaders(response, rateLimit);
}
