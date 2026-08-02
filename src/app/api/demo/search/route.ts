import { NextRequest, NextResponse } from "next/server";
import { searchTweets } from "@/lib/twitter-proxy";
import { ConsumerApiError } from "@/lib/consumer-api";
import { DEMO_LIMIT, resolveDemoSearchQuery } from "@/lib/demo-config";
import { getDemoCache, setDemoCache } from "@/lib/demo-cache";

/** Public homepage demo — allowlisted queries, cached, no API key required. */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("q") || "";
  const query = resolveDemoSearchQuery(raw);

  if (!query) {
    return NextResponse.json(
      {
        error:
          "Demo supports preset queries only. Try: from:elonmusk, ai agents lang:en, or $BTC -filter:replies. Sign up for full search.",
      },
      { status: 400 }
    );
  }

  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = getDemoCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const tweets = await searchTweets(query, DEMO_LIMIT);
    const body = {
      data: tweets,
      meta: { query, count: tweets.length, demo: true },
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
