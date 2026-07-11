import { PlanTier } from "@prisma/client";
import { prisma } from "./db";

export const PLAN_LIMITS: Record<PlanTier, number> = {
  FREE: 1_000,
  BASIC: 150_000,
  GROWTH: 500_000,
  PRO: 1_200_000,
  SCALE: 4_000_000,
  ENTERPRISE: 4_000_000,
};

export const PLAN_MONITOR_LIMITS: Record<PlanTier, number> = {
  FREE: 1,
  BASIC: 3,
  GROWTH: 8,
  PRO: 20,
  SCALE: 50,
  ENTERPRISE: 50,
};

/** Minimum check interval in seconds per plan tier */
export const PLAN_MONITOR_MIN_INTERVAL: Record<PlanTier, number> = {
  FREE: 300,
  BASIC: 120,
  GROWTH: 60,
  PRO: 30,
  SCALE: 15,
  ENTERPRISE: 15,
};

export function formatMonitorInterval(seconds: number): string {
  if (seconds >= 60 && seconds % 60 === 0) {
    const min = seconds / 60;
    return min === 1 ? "60s (1 min)" : `${seconds}s (${min} min)`;
  }
  return `${seconds}s`;
}

export function getDefaultMonitorInterval(planTier: PlanTier): number {
  return PLAN_MONITOR_MIN_INTERVAL[planTier];
}

export const PLAN_WEBHOOK_ACCESS: Record<PlanTier, boolean> = {
  FREE: false,
  BASIC: true,
  GROWTH: true,
  PRO: true,
  SCALE: true,
  ENTERPRISE: true,
};

export async function checkAndConsumeQuota(
  userId: string,
  cost = 1
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { allowed: false, remaining: 0, limit: 0 };

  const now = new Date();
  const resetAt = user.quotaResetAt;
  const monthPassed =
    now.getMonth() !== resetAt.getMonth() ||
    now.getFullYear() !== resetAt.getFullYear();

  let quotaUsed = user.quotaUsed;
  if (monthPassed) {
    quotaUsed = 0;
    await prisma.user.update({
      where: { id: userId },
      data: { quotaUsed: 0, quotaResetAt: now },
    });
  }

  const limit = PLAN_LIMITS[user.planTier];
  if (quotaUsed + cost > limit) {
    return { allowed: false, remaining: Math.max(0, limit - quotaUsed), limit };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { quotaUsed: quotaUsed + cost },
  });

  return {
    allowed: true,
    remaining: limit - quotaUsed - cost,
    limit,
  };
}

export async function logApiCall(
  userId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number
) {
  await prisma.apiLog.create({
    data: { userId, endpoint, method, statusCode, responseTime },
  });
}
