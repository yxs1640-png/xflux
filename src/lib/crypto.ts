import crypto from "crypto";
import bcrypt from "bcryptjs";

const API_KEY_PREFIX = "xflux_";

export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const random = crypto.randomBytes(24).toString("base64url");
  const key = `${API_KEY_PREFIX}${random}`;
  const hash = hashApiKey(key);
  const prefix = key.slice(0, 12) + "...";
  return { key, hash, prefix };
}

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSecret(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
