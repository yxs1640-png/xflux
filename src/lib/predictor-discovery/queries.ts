import "server-only";

import type { PredictorNiche } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getTopPredictors(options?: {
  niche?: PredictorNiche;
  limit?: number;
}) {
  return prisma.predictorProfile.findMany({
    where: options?.niche ? { niche: options.niche } : undefined,
    orderBy: [{ discoveryScore: "desc" }, { accuracyScore: "desc" }],
    take: options?.limit ?? 50,
    include: {
      claims: {
        orderBy: { tweetCreatedAt: "desc" },
        take: 3,
      },
    },
  });
}

export async function getPredictorByUsername(username: string) {
  return prisma.predictorProfile.findUnique({
    where: { username: username.toLowerCase().replace(/^@/, "") },
    include: {
      claims: {
        orderBy: { tweetCreatedAt: "desc" },
        take: 50,
      },
    },
  });
}

export async function getRecentClaims(options?: {
  niche?: PredictorNiche;
  limit?: number;
}) {
  return prisma.predictorClaim.findMany({
    where: options?.niche ? { niche: options.niche } : undefined,
    orderBy: { tweetCreatedAt: "desc" },
    take: options?.limit ?? 30,
    include: { predictor: true },
  });
}

export async function getDiscoveryStats() {
  const [predictors, claims, lastRun] = await Promise.all([
    prisma.predictorProfile.count(),
    prisma.predictorClaim.count(),
    prisma.predictorDiscoveryRun.findFirst({
      orderBy: { startedAt: "desc" },
    }),
  ]);
  return { predictors, claims, lastRun };
}
