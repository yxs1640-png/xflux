import { cache } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { maybeApplyPendingPlanChange } from "./billing";
import { prisma } from "./db";

/** Dedupe session reads within a single RSC request. */
export const getCachedSession = cache(() => getServerSession(authOptions));

export async function requireDashboardSession() {
  const session = await getCachedSession();
  if (!session?.user?.id) redirect("/login");
  return session;
}

/** Apply scheduled downgrades only when pending — skips DB write on most navigations. */
export const ensurePendingPlanApplied = cache(async (userId: string) => {
  const pending = await prisma.user.findUnique({
    where: { id: userId },
    select: { pendingPlanTier: true, planChangeEffectiveAt: true },
  });

  if (!pending?.pendingPlanTier) return;
  if (pending.planChangeEffectiveAt && new Date() < pending.planChangeEffectiveAt) {
    return;
  }

  await maybeApplyPendingPlanChange(userId);
});

/** Shared user row for layout + settings/billing (deduped per navigation). */
export const getDashboardUserRecord = cache(async () => {
  const session = await requireDashboardSession();

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      monitorTasks: { where: { isActive: true }, select: { id: true } },
    },
  });

  if (!user) return null;

  const pendingDue =
    user.pendingPlanTier &&
    (!user.planChangeEffectiveAt || new Date() >= user.planChangeEffectiveAt);

  if (pendingDue) {
    await maybeApplyPendingPlanChange(session.user.id);
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        monitorTasks: { where: { isActive: true }, select: { id: true } },
      },
    });
  }

  return user;
});
