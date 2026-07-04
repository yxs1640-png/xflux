import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { postTweet } from "@/lib/twitter-proxy";

export async function POST(request: NextRequest) {
  return withApiAuth(request, async () => {
    const body = await request.json().catch(() => null);

    if (!body?.text || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Missing required field: text" },
        { status: 400 }
      );
    }

    if (body.text.length > 280) {
      return NextResponse.json(
        { error: "Tweet text exceeds 280 characters" },
        { status: 400 }
      );
    }

    try {
      const result = await postTweet(body.text);
      return NextResponse.json({ data: result });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Failed to post tweet" },
        { status: 501 }
      );
    }
  });
}
