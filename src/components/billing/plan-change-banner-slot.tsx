import { PlanChangeBanner } from "@/components/billing/plan-change-banner";
import { type PlanChangeSummary } from "@/lib/plan-limits-shared";
import { getDashboardUserRecord } from "@/lib/dashboard-session";

function parsePlanChangeSummary(value: unknown): PlanChangeSummary | null {
  if (!value || typeof value !== "object") return null;
  const summary = value as PlanChangeSummary;
  if (!summary.fromPlan || !summary.toPlan || !summary.appliedAt) return null;
  return summary;
}

export async function PlanChangeBannerSlot() {
  const user = await getDashboardUserRecord();
  if (!user) return null;

  const lastPlanChangeSummary = parsePlanChangeSummary(user.lastPlanChangeSummary);

  return (
    <PlanChangeBanner
      currentPlanTier={user.planTier}
      pendingPlanTier={user.pendingPlanTier}
      planChangeEffectiveAt={user.planChangeEffectiveAt?.toISOString() ?? null}
      lastPlanChangeSummary={lastPlanChangeSummary}
      bannerDismissed={Boolean(user.planChangeBannerDismissedAt)}
      activeMonitorCount={user.monitorTasks.length}
    />
  );
}
