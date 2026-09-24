import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import {
  getSmartMoneyProfile,
  parseDays,
  parseLimit,
  serializePredictor,
} from "@/lib/smart-money-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  return withApiAuth(request, async () => {
    const { username: raw } = await params;
    if (raw.toLowerCase() === "claims") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const sp = request.nextUrl.searchParams;
    const days = parseDays(sp.get("days"));
    const limit = parseLimit(sp.get("limit"), 20);

    const profile = await getSmartMoneyProfile({
      username: raw,
      days,
      limit,
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Smart Money profile not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: serializePredictor(profile),
      meta: { days, claim_count: profile.claims.length },
    });
  });
}
