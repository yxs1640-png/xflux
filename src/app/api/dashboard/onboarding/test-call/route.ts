import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserByUsername } from "@/lib/twitter-proxy";
import { ConsumerApiError } from "@/lib/consumer-api";
import { checkAndConsumeQuota, logApiCall } from "@/lib/quota";

/** Session-authenticated onboarding test — counts as a real API call. */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const start = Date.now();
  const endpoint = "/api/v1/users/elonmusk";

  const quota = await checkAndConsumeQuota(userId);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: "Monthly quota exceeded", code: "QUOTA_EXCEEDED" },
      { status: 429 }
    );
  }

  try {
    const user = await getUserByUsername("elonmusk");
    const responseTime = Date.now() - start;

    if (!user) {
      await logApiCall(userId, endpoint, "GET", 404, responseTime);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await logApiCall(userId, endpoint, "GET", 200, responseTime);
    return NextResponse.json({
      data: user,
      meta: { onboarding: true, remaining: quota.remaining },
    });
  } catch (err) {
    const responseTime = Date.now() - start;
    await logApiCall(userId, endpoint, "GET", 502, responseTime);

    if (err instanceof ConsumerApiError) {
      return NextResponse.json(
        { error: "Data source temporarily unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Data source temporarily unavailable" },
      { status: 503 }
    );
  }
}
