import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

function adminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = adminEmails();
  if (admins.size === 0) return false;
  return admins.has(email.toLowerCase());
}

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return null;
  }
  return session;
}
