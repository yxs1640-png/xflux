import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLAN_MONITOR_LIMITS, getDefaultMonitorInterval } from "@/lib/quota";
import { MonitorStatus, PlanTier } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();
  const username = String(body.username ?? "")
    .toLowerCase()
    .replace(/^@/, "")
    .trim();
  const keywords = body.keywords ? String(body.keywords).trim() : null;

  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  const planTier = user.planTier as PlanTier;
  const limit = PLAN_MONITOR_LIMITS[planTier];
  const active = await prisma.monitorTask.count({
    where: { userId: user.id, isActive: true },
  });

  const existing = await prisma.monitorTask.findFirst({
    where: { userId: user.id, targetUsername: username },
  });
  if (existing) {
    return NextResponse.json({ monitor: existing, created: false });
  }

  if (active >= limit) {
    return NextResponse.json(
      { error: `Monitor limit reached (${limit})` },
      { status: 403 }
    );
  }

  const monitor = await prisma.monitorTask.create({
    data: {
      userId: user.id,
      targetUsername: username,
      keywords,
      checkInterval: getDefaultMonitorInterval(planTier),
      status: MonitorStatus.ACTIVE,
    },
  });

  return NextResponse.json({ monitor, created: true });
}
