import type { PredictorClaim } from "@prisma/client";

export function computeDiscoveryScore(input: {
  claims: Array<{ confidence: number; tweetCreatedAt: Date }>;
  followerCount: number | null;
}): number {
  const now = Date.now();
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;

  const recent = input.claims.filter(
    (c) => now - c.tweetCreatedAt.getTime() <= fourteenDays
  );

  if (recent.length === 0) return 0;

  const avgConfidence =
    recent.reduce((sum, c) => sum + c.confidence, 0) / recent.length;
  const frequency = Math.min(recent.length, 20) / 20;
  const followerBoost = input.followerCount
    ? Math.min(Math.log10(Math.max(input.followerCount, 10)) / 6, 1) * 0.15
    : 0;

  return Math.round((frequency * 50 + avgConfidence * 35 + followerBoost * 15) * 10) / 10;
}

export function computeAccuracyScore(
  hitCount: number,
  missCount: number
): number | null {
  const total = hitCount + missCount;
  if (total < 3) return null;
  return Math.round((hitCount / total) * 1000) / 10;
}

export function countClaimStatuses(claims: Pick<PredictorClaim, "status">[]) {
  let hitCount = 0;
  let missCount = 0;
  let verifiedClaims = 0;

  for (const c of claims) {
    if (c.status === "HIT") {
      hitCount++;
      verifiedClaims++;
    } else if (c.status === "MISS") {
      missCount++;
      verifiedClaims++;
    } else if (c.status === "INCONCLUSIVE") {
      verifiedClaims++;
    }
  }

  return {
    hitCount,
    missCount,
    verifiedClaims,
    accuracyScore: computeAccuracyScore(hitCount, missCount),
  };
}
