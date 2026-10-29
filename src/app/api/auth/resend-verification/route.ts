import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  emailVerifyResendWaitSec,
  issueEmailVerification,
} from "@/lib/email-verification";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      emailVerifiedAt: true,
      emailVerifyExpiresAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const waitSec = emailVerifyResendWaitSec(user.emailVerifyExpiresAt);
  if (waitSec > 0) {
    return NextResponse.json(
      {
        error: `We already sent a link — check inbox/spam, or try again in ${waitSec}s.`,
        retryAfterSec: waitSec,
      },
      { status: 429 }
    );
  }

  const result = await issueEmailVerification(session.user.id, user.email);
  if (!result.sent) {
    return NextResponse.json(
      { error: result.error || "Failed to send verification email" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
