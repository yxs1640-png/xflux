import { requireDashboardSession } from "@/lib/dashboard-session";
import { prisma } from "@/lib/db";
import { ApiKeysClient } from "./api-keys-client";

export const preferredRegion = "bom1";

export default async function ApiKeysPage() {
  const session = await requireDashboardSession();

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id, isActive: true },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const initialKeys = keys.map((key) => ({
    ...key,
    lastUsedAt: key.lastUsedAt?.toISOString() ?? null,
    createdAt: key.createdAt.toISOString(),
  }));

  return <ApiKeysClient initialKeys={initialKeys} />;
}
