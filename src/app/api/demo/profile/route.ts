import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/twitter-proxy";
import { ConsumerApiError } from "@/lib/consumer-api";

const ALLOWED_USERNAMES = new Set(["elonmusk", "sama", "x"]);
const CACHE_MS = 5 * 60 * 1000;

const cache = new Map<string, { expires: number; body: object }>();

/** Public homepage demo — allowlisted usernames, cached, no API key required. */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("username") || "elonmusk";
  const username = raw.toLowerCase().replace(/^@/, "");

  if (!ALLOWED_USERNAMES.has(username)) {
    return NextResponse.json(
      { error: "Demo supports elonmusk, sama, or x only. Sign up for full API access." },
      { status: 400 }
    );
  }

  const cached = cache.get(username);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.body);
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = { data: user, demo: true };
    cache.set(username, { expires: Date.now() + CACHE_MS, body });
    return NextResponse.json(body);
  } catch (err) {
    if (err instanceof ConsumerApiError) {
      return NextResponse.json(
        { error: "Demo temporarily unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Demo temporarily unavailable" }, { status: 503 });
  }
}
