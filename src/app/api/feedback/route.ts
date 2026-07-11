import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  ADOPTION_DRIVER_IDS,
  CORE_NEED_IDS,
  type AdoptionDriverId,
  type CoreNeedId,
} from "@/lib/feedback-config";
import { sendFeedbackNotification } from "@/lib/email";
import { normalizeUserSourceFields, userSourceSchema } from "@/lib/user-source-schema";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackServerEvent } from "@/lib/analytics/server";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const schema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().max(100).optional(),
    coreNeeds: z.array(z.enum(CORE_NEED_IDS as [CoreNeedId, ...CoreNeedId[]])).default([]),
    adoptionDrivers: z
      .array(z.enum(ADOPTION_DRIVER_IDS as [AdoptionDriverId, ...AdoptionDriverId[]]))
      .default([]),
    message: z.string().max(5000).optional(),
    pageUrl: z.string().max(500).optional(),
    website: z.string().max(0).optional(),
  })
  .and(userSourceSchema);

function hasMeaningfulInput(data: z.infer<typeof schema>): boolean {
  return (
    data.coreNeeds.length > 0 ||
    data.adoptionDrivers.length > 0 ||
    Boolean(data.message?.trim())
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    if (data.website) {
      return NextResponse.json({ success: true, id: "ok" });
    }

    if (!hasMeaningfulInput(data)) {
      return NextResponse.json(
        { error: "Select at least one option or leave a message" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? data.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const recentCount = await prisma.userFeedback.count({
      where: { email, createdAt: { gte: since } },
    });

    if (recentCount >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    let planTier = null;
    let name = data.name?.trim() || null;

    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { planTier: true, name: true, email: true },
      });
      if (user) {
        planTier = user.planTier;
        name = name || user.name;
      }
    }

    const feedback = await prisma.userFeedback.create({
      data: {
        userId: session?.user?.id ?? null,
        email,
        name,
        planTier,
        coreNeeds: data.coreNeeds,
        adoptionDrivers: data.adoptionDrivers,
        message: data.message?.trim() || null,
        ...normalizeUserSourceFields(data),
        pageUrl: data.pageUrl?.trim() || null,
      },
    });

    const source = normalizeUserSourceFields(data);

    const emailResult = await sendFeedbackNotification({
      id: feedback.id,
      email: feedback.email,
      name: feedback.name,
      planTier: feedback.planTier,
      userSource: feedback.userSource,
      userSourceDetail: feedback.userSourceDetail,
      coreNeeds: data.coreNeeds,
      adoptionDrivers: data.adoptionDrivers,
      message: feedback.message,
      pageUrl: feedback.pageUrl,
      createdAt: feedback.createdAt,
    });

    if (!emailResult.sent) {
      await prisma.userFeedback.update({
        where: { id: feedback.id },
        data: { emailError: emailResult.error ?? "Unknown email error" },
      });
      console.error("[feedback] email failed:", emailResult.error);
    } else {
      await prisma.userFeedback.update({
        where: { id: feedback.id },
        data: { emailSent: true },
      });
    }

    await trackServerEvent(session?.user?.id ?? email, AnalyticsEvents.FEEDBACK_SUBMITTED, {
      feedback_id: feedback.id,
      user_source: source.userSource,
      user_source_detail: source.userSourceDetail,
      core_needs: data.coreNeeds,
      adoption_drivers: data.adoptionDrivers,
      has_message: Boolean(feedback.message),
      plan_tier: planTier,
      is_logged_in: Boolean(session?.user?.id),
    });

    return NextResponse.json({
      success: true,
      id: feedback.id,
      emailSent: emailResult.sent,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("[feedback]", err);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
