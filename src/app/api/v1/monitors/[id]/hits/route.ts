import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiAuth(request, async (userId) => {
    const { id } = await params;
    const limit = Math.min(
      Math.max(parseInt(request.nextUrl.searchParams.get("limit") || "20", 10) || 20, 1),
      100
    );

    const task = await prisma.monitorTask.findFirst({
      where: { id, userId },
      select: {
        id: true,
        targetUsername: true,
        keywords: true,
        isActive: true,
        status: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Monitor not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const hits = await prisma.monitorHit.findMany({
      where: { taskId: id },
      orderBy: { detectedAt: "desc" },
      take: limit,
      select: {
        id: true,
        tweetId: true,
        text: true,
        authorUsername: true,
        tweetCreatedAt: true,
        detectedAt: true,
      },
    });

    return NextResponse.json({
      data: hits.map((h) => ({
        id: h.id,
        tweet_id: h.tweetId,
        text: h.text,
        author_username: h.authorUsername,
        tweet_created_at: h.tweetCreatedAt,
        detected_at: h.detectedAt,
        url: `https://x.com/${h.authorUsername}/status/${h.tweetId}`,
      })),
      meta: {
        monitor_id: task.id,
        target_username: task.targetUsername,
        keywords: task.keywords,
        is_active: task.isActive,
        status: task.status,
        count: hits.length,
        limit,
      },
    });
  });
}
