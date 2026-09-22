import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/db";

function serializeHit(h: {
  id: string;
  tweetId: string;
  text: string;
  authorUsername: string;
  tweetCreatedAt: Date | null;
  detectedAt: Date;
}) {
  return {
    id: h.id,
    tweet_id: h.tweetId,
    text: h.text,
    author_username: h.authorUsername,
    tweet_created_at: h.tweetCreatedAt,
    detected_at: h.detectedAt,
    url: `https://x.com/${h.authorUsername}/status/${h.tweetId}`,
  };
}

function serializeMonitorBase(m: {
  id: string;
  targetUsername: string;
  keywords: string | null;
  isActive: boolean;
  status: string;
  checkInterval: number;
  lastCheckAt: Date | null;
  lastError: string | null;
  webhookUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
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
  };
}

export async function GET(request: NextRequest) {
  return withApiAuth(request, async (userId) => {
    const includeHits = request.nextUrl.searchParams.get("include_hits") === "1";
    const hitLimit = Math.min(
      Math.max(parseInt(request.nextUrl.searchParams.get("hit_limit") || "3", 10) || 3, 1),
      10
    );

    if (includeHits) {
      const monitors = await prisma.monitorTask.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          hits: {
            orderBy: { detectedAt: "desc" },
            take: hitLimit,
          },
        },
      });

      return NextResponse.json({
        data: monitors.map((m) => ({
          ...serializeMonitorBase(m),
          recent_hits: m.hits.map(serializeHit),
        })),
        meta: { count: monitors.length },
      });
    }

    const monitors = await prisma.monitorTask.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: monitors.map(serializeMonitorBase),
      meta: { count: monitors.length },
    });
  });
}
