import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import {
  listSmartMoney,
  parseDays,
  parseExclude,
  parseLimit,
  parseNiche,
  serializePredictor,
} from "@/lib/smart-money-api";

export async function GET(request: NextRequest) {
  return withApiAuth(request, async () => {
    const sp = request.nextUrl.searchParams;
    const nicheRaw = sp.get("niche");
    const niche = parseNiche(nicheRaw);
    if (nicheRaw?.trim() && !niche) {
      return NextResponse.json(
        {
          error: "Invalid niche. Use MACRO, TRADING, CRYPTO, or GEOPOLITICS (or slug).",
          code: "BAD_REQUEST",
        },
        { status: 400 }
      );
    }

    const exclude = parseExclude(sp.get("exclude"));
    const limit = parseLimit(sp.get("limit"), 10);
    const days = parseDays(sp.get("days"));

    const rows = await listSmartMoney({ niche, exclude, limit, days });
    const data = rows.map(serializePredictor);

    return NextResponse.json({
      data,
      meta: {
        count: data.length,
        niche: niche ?? null,
        days,
        exclude_count: exclude.length,
        hub: "https://www.xfluxapi.com/predictors",
      },
    });
  });
}
