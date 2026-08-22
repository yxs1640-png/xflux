import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getMonitorAlertsForUser,
  markMonitorHitsRead,
} from "@/lib/monitor-alerts";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alerts = await getMonitorAlertsForUser(session.user.id);
  return NextResponse.json({
    unreadCount: alerts.unreadCount,
    canWebhook: alerts.canWebhook,
    hits: alerts.hits.map((h) => ({
      ...h,
      detectedAt: h.detectedAt.toISOString(),
    })),
  });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await markMonitorHitsRead(session.user.id);
  return NextResponse.json({ ok: true });
}
