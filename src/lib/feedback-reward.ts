import "server-only";

import { FeedbackReviewStatus, PlanTier } from "@prisma/client";
import { prisma } from "./db";

/** Extra API calls granted when admin approves useful feedback. */
export const FEEDBACK_REWARD_CALLS = 3_000;

type ApproveResult =
  | {
      ok: true;
      feedbackId: string;
      userId: string;
      email: string;
      rewardCalls: number;
      newQuotaLimit: number;
      /** Production does not auto-mail; ops sends via local script. */
      emailSent: false;
    }
  | { ok: false; error: string; status: number };

export async function approveFeedbackAndGrantQuota(
  feedbackId: string,
  options?: { note?: string | null; rewardCalls?: number }
): Promise<ApproveResult> {
  const rewardCalls = options?.rewardCalls ?? FEEDBACK_REWARD_CALLS;
  if (!Number.isInteger(rewardCalls) || rewardCalls < 1 || rewardCalls > 100_000) {
    return { ok: false, error: "Invalid rewardCalls", status: 400 };
  }

  const feedback = await prisma.userFeedback.findUnique({
    where: { id: feedbackId },
  });
  if (!feedback) {
    return { ok: false, error: "Feedback not found", status: 404 };
  }
  if (feedback.reviewStatus === FeedbackReviewStatus.APPROVED) {
    return { ok: false, error: "Already approved", status: 409 };
  }
  if (feedback.reviewStatus === FeedbackReviewStatus.REJECTED) {
    return { ok: false, error: "Already rejected", status: 409 };
  }

  const email = feedback.email.toLowerCase().trim();
  let user =
    (feedback.userId
      ? await prisma.user.findUnique({ where: { id: feedback.userId } })
      : null) ?? (await prisma.user.findUnique({ where: { email } }));

  if (!user) {
    return {
      ok: false,
      error: "No registered user for this email — ask them to sign up first",
      status: 400,
    };
  }

  const alreadyRewarded = await prisma.userFeedback.findFirst({
    where: {
      reviewStatus: FeedbackReviewStatus.APPROVED,
      rewardGrantedAt: { not: null },
      OR: [{ userId: user.id }, { email }],
    },
    select: { id: true },
  });
  if (alreadyRewarded) {
    return {
      ok: false,
      error: "This account already received a feedback quota reward",
      status: 409,
    };
  }

  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.user.update({
      where: { id: user!.id },
      data: { quotaLimit: { increment: rewardCalls } },
      select: { id: true, email: true, quotaLimit: true, planTier: true },
    });
    await tx.userFeedback.update({
      where: { id: feedbackId },
      data: {
        reviewStatus: FeedbackReviewStatus.APPROVED,
        reviewedAt: now,
        reviewNote: options?.note?.trim() || null,
        rewardCalls,
        rewardGrantedAt: now,
        userId: u.id,
        planTier: u.planTier as PlanTier,
      },
    });
    return u;
  });

  // Do not email from Vercel — reward notices are sent locally via
  // scripts/send-feedback-reward-notice.mjs after you approve.
  return {
    ok: true,
    feedbackId,
    userId: updated.id,
    email: updated.email,
    rewardCalls,
    newQuotaLimit: updated.quotaLimit,
    emailSent: false,
  };
}

export async function rejectFeedback(
  feedbackId: string,
  note?: string | null
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const feedback = await prisma.userFeedback.findUnique({
    where: { id: feedbackId },
    select: { id: true, reviewStatus: true },
  });
  if (!feedback) return { ok: false, error: "Feedback not found", status: 404 };
  if (feedback.reviewStatus !== FeedbackReviewStatus.PENDING) {
    return { ok: false, error: `Already ${feedback.reviewStatus}`, status: 409 };
  }

  await prisma.userFeedback.update({
    where: { id: feedbackId },
    data: {
      reviewStatus: FeedbackReviewStatus.REJECTED,
      reviewedAt: new Date(),
      reviewNote: note?.trim() || null,
    },
  });
  return { ok: true };
}
