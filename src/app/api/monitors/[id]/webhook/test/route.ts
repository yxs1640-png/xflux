import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PlanTier } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendTestWebhook } from "@/lib/monitor-webhook";
import { PLAN_WEBHOOK_ACCESS } from "@/lib/quota";

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
    include: { user: true },
  });

  if (!task) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  if (!PLAN_WEBHOOK_ACCESS[task.user.planTier as PlanTier]) {
    return NextResponse.json(
      { error: "Webhooks require Starter plan or higher." },
      { status: 403 }
    );
  }

  if (!task.webhookUrl) {
    return NextResponse.json({ error: "Configure a webhook URL first" }, { status: 400 });
  }

  const result = await sendTestWebhook(id);

  const deliveries = await prisma.monitorWebhookDelivery.findMany({
    where: { taskId: id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json({ result, deliveries });
}
