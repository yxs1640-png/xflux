import { prisma } from "./db";
import { hashApiKey } from "./crypto";

export async function validateApiKey(
  key: string | null
): Promise<{ userId: string; apiKeyId: string } | null> {
  if (!key || !key.startsWith("xflux_")) return null;

  const hash = hashApiKey(key);
  const apiKey = await prisma.apiKey.findFirst({
    where: { keyHash: hash, isActive: true },
    include: { user: true },
  });

  if (!apiKey) return null;

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return { userId: apiKey.userId, apiKeyId: apiKey.id };
}

export function extractApiKey(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);

  const headerKey = request.headers.get("x-api-key");
  if (headerKey) return headerKey;

  return null;
}
