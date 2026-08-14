import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { PlanChangeBannerSlot } from "@/components/billing/plan-change-banner-slot";
import { QuotaUpsellBannerSlot } from "@/components/billing/quota-upsell-banner-slot";
import { OnboardingChecklistSlot } from "@/components/dashboard/onboarding-checklist-slot";
import { requireDashboardSession } from "@/lib/dashboard-session";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Co-locate with Supabase (ap-south-1) to cut DB round-trip latency. */
export const preferredRegion = "bom1";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardSession();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Suspense fallback={null}>
            <PlanChangeBannerSlot />
          </Suspense>
          <Suspense fallback={null}>
            <QuotaUpsellBannerSlot />
          </Suspense>
          <Suspense fallback={null}>
            <OnboardingChecklistSlot />
          </Suspense>
          {children}
        </div>
      </main>
    </div>
  );
}
