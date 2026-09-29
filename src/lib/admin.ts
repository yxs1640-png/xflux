import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/** Hardcoded admin allowlist — no env switch. */
const ADMIN_EMAILS = ["test12132@qq.com"] as const;

const adminSet = new Set(ADMIN_EMAILS.map((e) => e.toLowerCase()));

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminSet.has(email.toLowerCase());
}

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return null;
  }
  return session;
}
