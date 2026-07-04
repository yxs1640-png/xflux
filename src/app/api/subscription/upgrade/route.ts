import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PlanTier } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/quota";

const schema = z.object({
  planId: z.enum(["FREE", "BASIC", "PRO", "ENTERPRISE"]),
});

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
        { error: "Enterprise plans require contacting sales." },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        planTier: planId as PlanTier,
        quotaLimit: PLAN_LIMITS[planId as PlanTier],
      },
      select: { planTier: true, quotaLimit: true },
    });

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
