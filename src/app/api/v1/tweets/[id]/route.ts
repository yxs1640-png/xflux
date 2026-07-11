import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { getTweetById } from "@/lib/twitter-proxy";
import { ConsumerApiError } from "@/lib/consumer-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiAuth(request, async () => {
    const { id } = await params;

    try {
      const tweet = await getTweetById(id);

      if (!tweet) {
        return NextResponse.json({ error: "Tweet not found", code: "NOT_FOUND" }, { status: 404 });
      }

      return NextResponse.json({ data: tweet });
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
