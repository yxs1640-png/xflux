import "server-only";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { sendEmailVerificationEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/seo";

export const EMAIL_VERIFY_TOKEN_TTL_MS = 48 * 60 * 60 * 1000;
/** Minimum gap between verification emails (register already sends one). */
export const EMAIL_VERIFY_RESEND_COOLDOWN_MS = 90 * 1000;

export function hashEmailVerifyToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Seconds until another verification email may be sent; 0 = allowed now. */
export function emailVerifyResendWaitSec(emailVerifyExpiresAt: Date | null | undefined): number {
  if (!emailVerifyExpiresAt) return 0;
  const sentAt = emailVerifyExpiresAt.getTime() - EMAIL_VERIFY_TOKEN_TTL_MS;
  const elapsed = Date.now() - sentAt;
  if (elapsed >= EMAIL_VERIFY_RESEND_COOLDOWN_MS) return 0;
  return Math.ceil((EMAIL_VERIFY_RESEND_COOLDOWN_MS - elapsed) / 1000);
}

export async function issueEmailVerification(userId: string, email: string): Promise<{ sent: boolean; error?: string }> {
  const raw = randomBytes(32).toString("hex");
  const hash = hashEmailVerifyToken(raw);
  const expiresAt = new Date(Date.now() + EMAIL_VERIFY_TOKEN_TTL_MS);

  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerifyTokenHash: hash,
      emailVerifyExpiresAt: expiresAt,
    },
  });

  const verifyUrl = `${SITE_URL}/verify-email?token=${raw}`;
  return sendEmailVerificationEmail({ to: email, verifyUrl });
}

export type VerifyEmailResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "expired" | "already" };

export async function consumeEmailVerificationToken(rawToken: string): Promise<VerifyEmailResult> {
  const token = rawToken.trim();
  if (!token || token.length < 32) return { ok: false, error: "invalid" };

  const hash = hashEmailVerifyToken(token);
  const user = await prisma.user.findFirst({
    where: { emailVerifyTokenHash: hash },
    select: {
      id: true,
      emailVerifiedAt: true,
      emailVerifyExpiresAt: true,
    },
  });

  if (!user) return { ok: false, error: "invalid" };
  if (user.emailVerifiedAt) return { ok: false, error: "already" };
  if (!user.emailVerifyExpiresAt || user.emailVerifyExpiresAt.getTime() < Date.now()) {
    return { ok: false, error: "expired" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      emailVerifyTokenHash: null,
      emailVerifyExpiresAt: null,
    },
  });

  return { ok: true };
}
