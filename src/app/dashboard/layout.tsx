import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { PlanChangeBanner } from "@/components/billing/plan-change-banner";
import { type PlanChangeSummary } from "@/lib/plan-limits-shared";
import { getDashboardUserRecord } from "@/lib/dashboard-session";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function parsePlanChangeSummary(value: unknown): PlanChangeSummary | null {
  if (!value || typeof value !== "object") return null;
  const summary = value as PlanChangeSummary;
  if (!summary.fromPlan || !summary.toPlan || !summary.appliedAt) return null;
  return summary;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDashboardUserRecord();
  const lastPlanChangeSummary = parsePlanChangeSummary(user?.lastPlanChangeSummary);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {user && (
            <PlanChangeBanner
              currentPlanTier={user.planTier}
              pendingPlanTier={user.pendingPlanTier}
              planChangeEffectiveAt={user.planChangeEffectiveAt?.toISOString() ?? null}
              lastPlanChangeSummary={lastPlanChangeSummary}
              bannerDismissed={Boolean(user.planChangeBannerDismissedAt)}
              activeMonitorCount={user.monitorTasks.length}
            />
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
