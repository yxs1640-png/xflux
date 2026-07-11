import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PlanTier } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { applyMockPlanChange, isActiveSubscriptionStatus, resetUserToFree } from "@/lib/billing";
import { isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/db";

const schema = z.object({
  planId: z.enum(["FREE", "BASIC", "GROWTH", "PRO", "SCALE", "ENTERPRISE"]),
});

/** Dev-only fallback when Stripe is not configured, or FREE reset without a live subscription. */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { planId } = schema.parse(body);

    if (planId === "ENTERPRISE") {
      return NextResponse.json(
        { error: "Enterprise is deprecated. Use Scale instead." },
        { status: 400 }
      );
    }

    if (isStripeConfigured()) {
      if (planId !== "FREE") {
        return NextResponse.json(
          { error: "Use Stripe checkout for plan changes" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (
        user.stripeSubscriptionId &&
        isActiveSubscriptionStatus(user.subscriptionStatus)
      ) {
        return NextResponse.json(
          { error: "Cancel your subscription in Manage billing first" },
          { status: 400 }
        );
      }

      const updated = await resetUserToFree(session.user.id);
      if (!updated) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        planTier: updated.planTier,
        quotaLimit: updated.quotaLimit,
      });
    }

    const user = await applyMockPlanChange(session.user.id, planId as PlanTier);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      planTier: user.planTier,
      quotaLimit: user.quotaLimit,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    return NextResponse.json({ error: "Upgrade failed" }, { status: 500 });
  }
}
