import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { topicConfigFromCustomSignal } from "@/lib/custom-signals/topic-config";
import { CustomSignalBoardActions } from "@/components/dashboard/custom-signal-board-actions";
import { SignalFeedContent } from "@/components/signals/signal-feed-content";
import { SignalFeedSkeleton } from "@/components/signals/signal-feed-skeleton";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ refresh?: string }>;
};

export default async function CustomSignalBoardPage({ params, searchParams }: PageProps) {
  const session = await requireDashboardSession();
  const { id } = await params;
  const { refresh } = await searchParams;

  const board = await prisma.customSignal.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!board) notFound();

  const topic = topicConfigFromCustomSignal(board);
  const cacheKey = `custom-${board.id}`;

  return (
    <div>
      <CustomSignalBoardActions
        boardId={board.id}
        boardName={board.name}
        accounts={board.watchAccounts}
      />
      <Suspense fallback={<SignalFeedSkeleton topic={topic} />}>
        <SignalFeedContent
          topic={topic}
          fresh={refresh === "1"}
          cacheKey={cacheKey}
          includeJsonLd={false}
        />
      </Suspense>
    </div>
  );
}
