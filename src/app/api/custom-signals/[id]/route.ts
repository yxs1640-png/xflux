import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getCustomSignalLimits,
  validateCustomSignalInput,
} from "@/lib/custom-signals/service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const board = await prisma.customSignal.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!board) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ board });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const board = await prisma.customSignal.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!board) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limits = await getCustomSignalLimits(session.user.id);
  const body = await request.json();
  const validated = validateCustomSignalInput({
    name: body.name ?? board.name,
    watchAccountsRaw: body.watchAccounts ?? board.watchAccounts.join(", "),
    searchQuery: body.searchQuery ?? board.searchQuery ?? undefined,
    accountLimit: limits.accountLimit,
  });

  if (validated.error) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const updated = await prisma.customSignal.update({
    where: { id },
    data: {
      name: (body.name ?? board.name).trim(),
      watchAccounts: validated.accounts,
      searchQuery: validated.searchQuery,
      monitorKeywords:
        body.monitorKeywords !== undefined
          ? body.monitorKeywords?.trim() || null
          : board.monitorKeywords,
    },
  });

  return NextResponse.json({ board: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await prisma.customSignal.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
