import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissions = await prisma.signalTopicSubmission.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { email: true, planTier: true } },
    },
  });

  return NextResponse.json({ submissions });
}
