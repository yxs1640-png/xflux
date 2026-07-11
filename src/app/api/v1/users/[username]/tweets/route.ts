import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { getUserTweets } from "@/lib/twitter-proxy";
import { ConsumerApiError } from "@/lib/consumer-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  return withApiAuth(request, async () => {
    const { username } = await params;
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10", 10);

    try {
      const tweets = await getUserTweets(username, limit);
      return NextResponse.json({ data: tweets, meta: { count: tweets.length } });
    } catch (err) {
      if (err instanceof ConsumerApiError) {
        return NextResponse.json(
          { error: err.message, code: "UPSTREAM_ERROR" },
          { status: err.status >= 400 && err.status < 600 ? err.status : 502 }
        );
      }
      if (err instanceof Error) {
        return NextResponse.json(
          { error: err.message, code: "UPSTREAM_ERROR" },
          { status: 502 }
        );
      }
      throw err;
    }
  });
}
