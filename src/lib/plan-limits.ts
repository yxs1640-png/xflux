import "server-only";

import { MonitorStatus, PlanTier } from "@prisma/client";
import { prisma } from "./db";
import {
  PLAN_MONITOR_LIMITS,
  PLAN_MONITOR_MIN_INTERVAL,
  PLAN_WEBHOOK_ACCESS,
  type PlanChangeSummary,
} from "./plan-limits-shared";

export type { PlanChangeSummary } from "./plan-limits-shared";
export {
  isPlanDowngrade,
  isPlanUpgrade,
  monitorLimitForPlan,
  planTierRank,
  previewMonitorPauseCount,
} from "./plan-limits-shared";

export async function enforcePlanLimits(
  userId: string,
  planTier: PlanTier,
  fromPlan?: PlanTier
): Promise<PlanChangeSummary> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planTier: true },
  });
  const from = fromPlan ?? user?.planTier ?? planTier;

  const tasks = await prisma.monitorTask.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const limit = PLAN_MONITOR_LIMITS[planTier];
  const minInterval = PLAN_MONITOR_MIN_INTERVAL[planTier];
  const webhooksAllowed = PLAN_WEBHOOK_ACCESS[planTier];

  const keptTasks = tasks.slice(0, limit);
  const excessTasks = tasks.slice(limit);
  const keptIds = new Set(keptTasks.map((t) => t.id));

  const pausedMonitors: PlanChangeSummary["pausedMonitors"] = [];
  let webhooksCleared = 0;
  let intervalsAdjusted = 0;

  for (const task of tasks) {
    const updates: {
      isActive?: boolean;
      status?: MonitorStatus;
      webhookUrl?: null;
      webhookSecret?: null;
      checkInterval?: number;
    } = {};

    if (!keptIds.has(task.id) && task.isActive) {
      updates.isActive = false;
      updates.status = MonitorStatus.PAUSED;
      pausedMonitors.push({ id: task.id, targetUsername: task.targetUsername });
    }

    if (!webhooksAllowed && task.webhookUrl) {
      updates.webhookUrl = null;
      updates.webhookSecret = null;
      webhooksCleared++;
    }

    if (task.checkInterval < minInterval) {
      updates.checkInterval = minInterval;
      intervalsAdjusted++;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.monitorTask.update({
        where: { id: task.id },
        data: updates,
      });
    }
  }

  return {
    fromPlan: from,
    toPlan: planTier,
    keptMonitors: keptTasks.map((t) => ({ id: t.id, targetUsername: t.targetUsername })),
    pausedMonitors,
    webhooksCleared,
    intervalsAdjusted,
    appliedAt: new Date().toISOString(),
  };
}
