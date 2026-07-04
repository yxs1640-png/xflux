import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
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

  const deliveries = await prisma.monitorWebhookDelivery.findMany({
    where: { taskId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ deliveries });
}
