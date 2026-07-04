import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PlanTier } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { applyPlanToUser } from "@/lib/billing";
import { isStripeConfigured } from "@/lib/stripe";

const schema = z.object({
  planId: z.enum(["FREE", "BASIC", "PRO", "ENTERPRISE"]),
});

/** Dev-only fallback when Stripe is not configured. */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isStripeConfigured()) {
    return NextResponse.json(
      { error: "Use Stripe checkout for plan changes" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { planId } = schema.parse(body);

    if (planId === "ENTERPRISE") {
      return NextResponse.json(
        { error: "Enterprise plans require contacting sales." },
        { status: 400 }
      );
    }

    const user = await applyPlanToUser(session.user.id, planId as PlanTier);

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
