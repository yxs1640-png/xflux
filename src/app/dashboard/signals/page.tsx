import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { CustomSignalsHub } from "@/components/dashboard/custom-signals-hub";
import { isAdminEmail } from "@/lib/admin";
import { getCustomSignalLimits } from "@/lib/custom-signals/service";

export default async function DashboardSignalsPage() {
  const session = await requireDashboardSession();

  const [boards, submissions, limits] = await Promise.all([
    prisma.customSignal.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.signalTopicSubmission.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { communityTopic: { select: { slug: true } } },
    }),
    getCustomSignalLimits(session.user.id),
  ]);

  return (
    <CustomSignalsHub
      initialBoards={boards.map((b) => ({
        ...b,
        updatedAt: b.updatedAt.toISOString(),
      }))}
      initialSubmissions={submissions.map((s) => ({
        id: s.id,
        proposedSlug: s.proposedSlug,
        title: s.title,
        status: s.status,
        adminNote: s.adminNote,
        createdAt: s.createdAt.toISOString(),
        communityTopic: s.communityTopic,
      }))}
      limits={limits}
      isAdmin={isAdminEmail(session.user.email)}
    />
  );
}
