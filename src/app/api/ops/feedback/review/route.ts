import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin";
import {
  approveFeedbackAndGrantQuota,
  FEEDBACK_REWARD_CALLS,
  rejectFeedback,
} from "@/lib/feedback-reward";

const schema = z.object({
  feedbackId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
  note: z.string().max(2000).optional(),
  rewardCalls: z.number().int().min(1).max(100_000).optional(),
});

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = schema.parse(await request.json());

    if (body.action === "reject") {
      const result = await rejectFeedback(body.feedbackId, body.note);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      return NextResponse.json({ ok: true, action: "reject" });
    }

    const result = await approveFeedbackAndGrantQuota(body.feedbackId, {
      note: body.note,
      rewardCalls: body.rewardCalls ?? FEEDBACK_REWARD_CALLS,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      action: "approve",
      feedbackId: result.feedbackId,
      userId: result.userId,
      email: result.email,
      rewardCalls: result.rewardCalls,
      newQuotaLimit: result.newQuotaLimit,
      ok: true,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("[ops/feedback/review]", err);
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
