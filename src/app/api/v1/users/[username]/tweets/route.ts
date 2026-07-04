import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { getUserTweets } from "@/lib/twitter-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  return withApiAuth(request, async () => {
    const { username } = await params;
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10", 10);
    const tweets = await getUserTweets(username, limit);

    return NextResponse.json({ data: tweets, meta: { count: tweets.length } });
  });
}
