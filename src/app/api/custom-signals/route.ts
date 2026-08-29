import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getCustomSignalLimits,
  validateCustomSignalInput,
} from "@/lib/custom-signals/service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [boards, limits] = await Promise.all([
    prisma.customSignal.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    }),
    getCustomSignalLimits(session.user.id),
  ]);

  return NextResponse.json({ boards, limits });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limits = await getCustomSignalLimits(session.user.id);
  if (limits.boardCount >= limits.boardLimit) {
    return NextResponse.json(
      { error: `Board limit reached (${limits.boardLimit} on ${limits.planTier}). Upgrade for more.` },
      { status: 403 }
    );
  }

  const body = await request.json();
  const validated = validateCustomSignalInput({
    name: body.name ?? "",
    watchAccountsRaw: body.watchAccounts ?? "",
    searchQuery: body.searchQuery,
    accountLimit: limits.accountLimit,
  });

  if (validated.error) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const board = await prisma.customSignal.create({
    data: {
      userId: session.user.id,
      name: body.name.trim(),
      watchAccounts: validated.accounts,
      searchQuery: validated.searchQuery,
      monitorKeywords: body.monitorKeywords?.trim() || null,
    },
  });

  return NextResponse.json({ board });
}
