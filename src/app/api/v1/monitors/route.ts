import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  return withApiAuth(request, async (userId) => {
    const includeHits = request.nextUrl.searchParams.get("include_hits") === "1";
    const hitLimit = Math.min(
      Math.max(parseInt(request.nextUrl.searchParams.get("hit_limit") || "3", 10) || 3, 1),
      10
    );

    const monitors = await prisma.monitorTask.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: includeHits
        ? {
            hits: {
              orderBy: { detectedAt: "desc" },
              take: hitLimit,
            },
          }
        : undefined,
    });

    return NextResponse.json({
      data: monitors.map((m) => ({
        id: m.id,
        target_username: m.targetUsername,
        keywords: m.keywords,
        is_active: m.isActive,
        status: m.status,
        check_interval_sec: m.checkInterval,
        last_check_at: m.lastCheckAt,
        last_error: m.lastError,
        has_webhook: Boolean(m.webhookUrl),
        created_at: m.createdAt,
        updated_at: m.updatedAt,
        ...(includeHits && "hits" in m
          ? {
              recent_hits: m.hits.map((h) => ({
                id: h.id,
                tweet_id: h.tweetId,
                text: h.text,
                author_username: h.authorUsername,
                tweet_created_at: h.tweetCreatedAt,
                detected_at: h.detectedAt,
                url: `https://x.com/${h.authorUsername}/status/${h.tweetId}`,
              })),
            }
          : {}),
      })),
      meta: { count: monitors.length },
    });
  });
}
