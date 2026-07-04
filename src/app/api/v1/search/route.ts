import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { searchTweets } from "@/lib/twitter-proxy";

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
    const tweets = await searchTweets(q, limit);

    return NextResponse.json({ data: tweets, meta: { query: q, count: tweets.length } });
  });
}
