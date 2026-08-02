import { NextRequest, NextResponse } from "next/server";
import { getUserTweets } from "@/lib/twitter-proxy";
import { ConsumerApiError } from "@/lib/consumer-api";
import {
  DEMO_LIMIT,
  isAllowedDemoUsername,
  normalizeUsername,
} from "@/lib/demo-config";
import { getDemoCache, setDemoCache } from "@/lib/demo-cache";

/** Public homepage demo — allowlisted usernames, cached, no API key required. */
export async function GET(request: NextRequest) {
  const username = normalizeUsername(
    request.nextUrl.searchParams.get("username") || "elonmusk"
  );

  if (!isAllowedDemoUsername(username)) {
    return NextResponse.json(
      {
        error:
          "Demo supports elonmusk, sama, or x only. Sign up for full timeline access.",
      },
      { status: 400 }
    );
  }

  const cacheKey = `timeline:${username}`;
  const cached = getDemoCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const tweets = await getUserTweets(username, DEMO_LIMIT);
    const body = {
      data: tweets,
      meta: { username, count: tweets.length, demo: true },
    };
    setDemoCache(cacheKey, body);
    return NextResponse.json(body);
  } catch (err) {
    if (err instanceof ConsumerApiError) {
      return NextResponse.json({ error: "Demo temporarily unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Demo temporarily unavailable" }, { status: 503 });
  }
}
