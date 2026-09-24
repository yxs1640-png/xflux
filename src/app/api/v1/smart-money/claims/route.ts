import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import {
  listSmartMoneyClaims,
  parseDays,
  parseExclude,
  parseLimit,
  parseNiche,
  serializeClaim,
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
    const limit = parseLimit(sp.get("limit"), 30);
    const days = parseDays(sp.get("days"));

    const rows = await listSmartMoneyClaims({ niche, exclude, limit, days });
    const data = rows.map((c) => ({
      username: c.predictor.username,
      display_name: c.predictor.displayName,
      discovery_score: c.predictor.discoveryScore,
      ...serializeClaim(c, c.predictor.username),
      profile_url: `https://www.xfluxapi.com/predictors/u/${c.predictor.username}`,
    }));

    return NextResponse.json({
      data,
      meta: {
        count: data.length,
        niche: niche ?? null,
        days,
        exclude_count: exclude.length,
      },
    });
  });
}
