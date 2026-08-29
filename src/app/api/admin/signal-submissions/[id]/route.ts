import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";
import { makeTopic } from "@/lib/signals/make-topic";
import type { SignalCategoryId } from "@/lib/signals/topics";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const action = body.action as "approve" | "reject";
  const adminNote = typeof body.adminNote === "string" ? body.adminNote.trim() : undefined;

  const submission = await prisma.signalTopicSubmission.findUnique({ where: { id } });
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (submission.status !== "PENDING") {
    return NextResponse.json({ error: "Submission already reviewed." }, { status: 400 });
  }

  if (action === "reject") {
    const updated = await prisma.signalTopicSubmission.update({
      where: { id },
      data: {
        status: "REJECTED",
        adminNote: adminNote ?? null,
        reviewedAt: new Date(),
      },
    });
    return NextResponse.json({ submission: updated });
  }

  if (action !== "approve") {
    return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
  }

  const slug = submission.proposedSlug;
  const existing = await prisma.communitySignalTopic.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already published." }, { status: 409 });
  }

  const topicSeed = {
    slug,
    category: submission.category as SignalCategoryId,
    title: submission.title,
    pageTitle: `${submission.title} Signals on X/Twitter — Community Digest`,
    description: submission.description,
    keywords: [
      `${submission.title} Twitter signals`,
      `${submission.title} X monitor`,
      submission.pulseLabel ?? submission.title,
    ],
    intro: submission.intro,
    watchAccounts: submission.watchAccounts,
    searchQuery: submission.searchQuery,
    pulseLabel: submission.pulseLabel ?? submission.title,
  };

  const config = makeTopic(topicSeed);

  const result = await prisma.$transaction(async (tx) => {
    const communityTopic = await tx.communitySignalTopic.create({
      data: {
        slug,
        submissionId: submission.id,
        submittedById: submission.userId,
        category: submission.category,
        title: submission.title,
        pageTitle: config.pageTitle,
        description: submission.description,
        keywords: config.keywords,
        intro: submission.intro,
        watchAccounts: submission.watchAccounts,
        searchQuery: submission.searchQuery,
        pulseLabel: config.pulseLabel,
      },
    });

    const updatedSubmission = await tx.signalTopicSubmission.update({
      where: { id },
      data: {
        status: "APPROVED",
        adminNote: adminNote ?? null,
        reviewedAt: new Date(),
      },
    });

    return { communityTopic, submission: updatedSubmission };
  });

  revalidatePath("/signals");
  revalidatePath(`/signals/${slug}`);

  return NextResponse.json(result);
}
