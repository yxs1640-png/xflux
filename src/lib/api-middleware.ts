import { NextRequest, NextResponse } from "next/server";
import { extractApiKey, validateApiKey } from "@/lib/api-key";
import { applyApiLimitHeaders, enforceApiRequestLimits } from "@/lib/api-limits";
import { logApiCall } from "@/lib/quota";

export async function withApiAuth(
  request: NextRequest,
  handler: (userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const start = Date.now();
  const key = extractApiKey(request);

  const auth = await validateApiKey(key);
  if (!auth) {
    return NextResponse.json(
      { error: "Invalid or missing API key", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const limits = await enforceApiRequestLimits(auth.userId, auth.planTier);
  if (!limits.ok) {
    return limits.response;
  }

  const endpoint = new URL(request.url).pathname;
  const response = await handler(auth.userId);

  await logApiCall(
    auth.userId,
    endpoint,
    request.method,
    response.status,
    Date.now() - start
  );

  applyApiLimitHeaders(response, limits.quota, limits.rateLimit);

  return response;
}
