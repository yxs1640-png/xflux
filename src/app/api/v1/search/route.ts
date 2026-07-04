import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { searchTweets, ApiServerError } from "@/lib/twitter-proxy";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  return withApiAuth(request, async () => {
    const q = request.nextUrl.searchParams.get("q");

    if (!q) {
      return NextResponse.json(
        { error: "Missing required query parameter: q" },
        { status: 400 }
      );
    }

    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20", 10);

    try {
      const tweets = await searchTweets(q, limit);
      return NextResponse.json({ data: tweets, meta: { query: q, count: tweets.length } });
    } catch (err) {
      if (err instanceof ApiServerError) {
        return NextResponse.json(
          { error: err.message, code: "UPSTREAM_ERROR" },
          { status: err.status >= 400 && err.status < 600 ? err.status : 502 }
        );
      }
      throw err;
    }
  });
}
