import "server-only";

import { prisma } from "@/lib/db";

/** Top predictors for sitemap — fail soft if DB unavailable. */
export async function getPredictorUsernamesForSitemap(limit = 100): Promise<string[]> {
  try {
    const rows = await prisma.predictorProfile.findMany({
      orderBy: [{ discoveryScore: "desc" }, { accuracyScore: "desc" }],
      take: limit,
      select: { username: true },
    });
    return rows.map((r) => r.username);
  } catch {
    return [];
  }
}
