import "server-only";

import { PlanTier } from "@prisma/client";
import { prisma } from "./db";
import { PLAN_WEBHOOK_ACCESS } from "./quota";

export type MonitorAlertHit = {
  id: string;
  tweetId: string;
  text: string;
  authorUsername: string;
  detectedAt: Date;
  targetUsername: string;
};

export async function getMonitorAlertsForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { monitorHitsReadAt: true, planTier: true },
  });

  if (!user) {
    return {
      unreadCount: 0,
      hits: [] as MonitorAlertHit[],
      canWebhook: false,
      readAt: null as Date | null,
    };
  }

  const readAt = user.monitorHitsReadAt ?? new Date(0);
  const planTier = user.planTier as PlanTier;

  const where = {
    task: { userId },
    detectedAt: { gt: readAt },
  };

  const [unreadCount, hits] = await Promise.all([
    prisma.monitorHit.count({ where }),
    prisma.monitorHit.findMany({
      where,
      orderBy: { detectedAt: "desc" },
      take: 5,
      include: { task: { select: { targetUsername: true } } },
    }),
  ]);

  return {
    unreadCount,
    hits: hits.map((h) => ({
      id: h.id,
      tweetId: h.tweetId,
      text: h.text,
      authorUsername: h.authorUsername,
      detectedAt: h.detectedAt,
      targetUsername: h.task.targetUsername,
    })),
    canWebhook: PLAN_WEBHOOK_ACCESS[planTier],
    readAt: user.monitorHitsReadAt,
  };
}

export async function markMonitorHitsRead(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { monitorHitsReadAt: new Date() },
  });
}

export function isMonitorHitUnread(detectedAt: Date, readAt: Date | null | undefined): boolean {
  if (!readAt) return true;
  return detectedAt > readAt;
}
