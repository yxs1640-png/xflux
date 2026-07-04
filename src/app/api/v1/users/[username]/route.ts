import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { getUserByUsername } from "@/lib/twitter-proxy";
import { ConsumerApiError, isConsumerApiConfigured } from "@/lib/consumer-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  return withApiAuth(request, async () => {
    if (!isConsumerApiConfigured()) {
      return NextResponse.json(
        {
          error: "Consumer API not configured",
          code: "CONSUMER_NOT_CONFIGURED",
          hint: "CONSUMER_API_KEY is empty on disk. Open .env, paste your key, press Cmd+S to save, then restart npm run dev",
        },
        { status: 503 }
      );
    }

    try {
      const { username } = await params;
      const user = await getUserByUsername(username);

      if (!user) {
        return NextResponse.json({ error: "User not found", code: "USER_NOT_FOUND" }, { status: 404 });
      }

      return NextResponse.json({ data: user });
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
