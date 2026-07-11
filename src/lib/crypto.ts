import crypto from "crypto";
import bcrypt from "bcryptjs";

export { generateApiKey, hashApiKey } from "./api-key-crypto";

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
