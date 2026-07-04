import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { pollMonitorTask } from "@/lib/monitor-poll";

function serializeMonitor<T extends { webhookUrl: string | null; webhookSecret: string | null }>(
  monitor: T
) {
  const { webhookSecret, ...rest } = monitor;
  return {
    ...rest,
    hasWebhook: Boolean(monitor.webhookUrl),
    webhookSecret: webhookSecret ? `whsec_${webhookSecret.slice(-8)}` : null,
  };
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const task = await prisma.monitorTask.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!task) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const result = await pollMonitorTask(id);

  const monitor = await prisma.monitorTask.findUnique({
    where: { id },
    include: {
      hits: {
        orderBy: { detectedAt: "desc" },
        take: 3,
      },
      deliveries: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return NextResponse.json({
    result,
    monitor: monitor ? serializeMonitor(monitor) : null,
  });
}
