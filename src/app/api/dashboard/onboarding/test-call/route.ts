import { PlanTier } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserByUsername } from "@/lib/twitter-proxy";
import { ConsumerApiError } from "@/lib/consumer-api";
import {
  applyApiLimitHeaders,
  enforceApiRequestLimits,
} from "@/lib/api-limits";
import { logApiCall } from "@/lib/quota";

/** Session-authenticated onboarding test — counts as a real API call. */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const planTier = (session.user.planTier ?? "FREE") as PlanTier;
  const start = Date.now();
  const endpoint = "/api/v1/users/elonmusk";

  const limits = await enforceApiRequestLimits(userId, planTier);
  if (!limits.ok) {
    return limits.response;
  }

  try {
    const user = await getUserByUsername("elonmusk");
    const responseTime = Date.now() - start;

    if (!user) {
      await logApiCall(userId, endpoint, "GET", 404, responseTime);
      const response = NextResponse.json({ error: "User not found" }, { status: 404 });
      applyApiLimitHeaders(response, limits.quota, limits.rateLimit);
      return response;
    }

    await logApiCall(userId, endpoint, "GET", 200, responseTime);
    const response = NextResponse.json({
      data: user,
      meta: { onboarding: true, remaining: limits.quota.remaining },
    });
    applyApiLimitHeaders(response, limits.quota, limits.rateLimit);
    return response;
  } catch (err) {
    const responseTime = Date.now() - start;
    await logApiCall(userId, endpoint, "GET", 502, responseTime);

    const response =
      err instanceof ConsumerApiError
        ? NextResponse.json(
            { error: "Data source temporarily unavailable" },
            { status: 503 }
          )
        : NextResponse.json(
            { error: "Data source temporarily unavailable" },
            { status: 503 }
          );
    applyApiLimitHeaders(response, limits.quota, limits.rateLimit);
    return response;
  }
}
