import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { getDashboardUserRecord, requireDashboardSession } from "@/lib/dashboard-session";
import { prisma } from "@/lib/db";

export async function OnboardingChecklistSlot() {
  const session = await requireDashboardSession();
  const user = await getDashboardUserRecord();
  if (!user) return null;

  const [apiCallCount, defaultKey] = await Promise.all([
    prisma.apiLog.count({ where: { userId: session.user.id } }),
    prisma.apiKey.findFirst({
      where: { userId: session.user.id, isActive: true },
      orderBy: { createdAt: "asc" },
      select: { keyPrefix: true },
    }),
  ]);

  return (
    <OnboardingChecklist
      hasApiCalls={apiCallCount > 0 || user.quotaUsed > 0}
      hasMonitors={user.monitorTasks.length > 0}
      apiKeyPrefix={defaultKey?.keyPrefix ?? null}
    />
  );
}
