import { NextRequest, NextResponse } from "next/server";
import { extractApiKey, validateApiKey } from "@/lib/api-key";
import { checkAndConsumeQuota, logApiCall } from "@/lib/quota";

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

  const quota = await checkAndConsumeQuota(auth.userId);
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: "Monthly quota exceeded",
        code: "QUOTA_EXCEEDED",
        limit: quota.limit,
        remaining: quota.remaining,
      },
      { status: 429 }
    );
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

  response.headers.set("X-RateLimit-Limit", String(quota.limit));
  response.headers.set("X-RateLimit-Remaining", String(quota.remaining));

  return response;
}
