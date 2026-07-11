import { PlanTier } from "@prisma/client";
import {
  PLAN_MONITOR_LIMITS,
  PLAN_MONITOR_MIN_INTERVAL,
  PLAN_WEBHOOK_ACCESS,
} from "./quota";

const PLAN_RANK: Record<PlanTier, number> = {
  FREE: 0,
  BASIC: 1,
  GROWTH: 2,
  PRO: 3,
  SCALE: 4,
  ENTERPRISE: 4,
};

export interface PlanChangeSummary {
  fromPlan: PlanTier;
  toPlan: PlanTier;
  keptMonitors: Array<{ id: string; targetUsername: string }>;
  pausedMonitors: Array<{ id: string; targetUsername: string }>;
  webhooksCleared: number;
  intervalsAdjusted: number;
  appliedAt: string;
}

export function planTierRank(planTier: PlanTier): number {
  return PLAN_RANK[planTier];
}

export function isPlanDowngrade(from: PlanTier, to: PlanTier): boolean {
  return planTierRank(to) < planTierRank(from);
}

export function isPlanUpgrade(from: PlanTier, to: PlanTier): boolean {
  return planTierRank(to) > planTierRank(from);
}

export function monitorLimitForPlan(planTier: PlanTier): number {
  return PLAN_MONITOR_LIMITS[planTier];
}

export function previewMonitorPauseCount(
  activeMonitorCount: number,
  targetPlan: PlanTier
): number {
  const limit = PLAN_MONITOR_LIMITS[targetPlan];
  return Math.max(0, activeMonitorCount - limit);
}

export {
  PLAN_MONITOR_LIMITS,
  PLAN_MONITOR_MIN_INTERVAL,
  PLAN_WEBHOOK_ACCESS,
};
