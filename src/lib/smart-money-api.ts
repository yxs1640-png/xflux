import "server-only";

import type { PredictorClaim, PredictorNiche, PredictorProfile } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PREDICTOR_NICHES } from "@/lib/predictor-discovery/types";

const DEFAULT_DAYS = 14;
const MAX_LIMIT = 50;

export function parseNiche(raw: string | null): PredictorNiche | undefined {
  if (!raw?.trim()) return undefined;
  const upper = raw.trim().toUpperCase() as PredictorNiche;
  if ((PREDICTOR_NICHES as string[]).includes(upper)) return upper;
  const bySlug = PREDICTOR_NICHES.find((n) => n.toLowerCase() === raw.trim().toLowerCase());
  return bySlug;
}

export function parseExclude(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((h) => h.trim().toLowerCase().replace(/^@/, ""))
        .filter(Boolean)
    ),
  ];
}

export function parseLimit(raw: string | null, fallback: number): number {
  const n = parseInt(raw || String(fallback), 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, MAX_LIMIT);
}

export function parseDays(raw: string | null): number {
  const n = parseInt(raw || String(DEFAULT_DAYS), 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_DAYS;
  return Math.min(n, 90);
}

export function sinceDaysAgo(days: number): Date {
  return new Date(Date.now() - days * 86_400_000);
}

type ClaimRow = Pick<
  PredictorClaim,
  | "tweetId"
  | "tweetText"
  | "niche"
  | "subject"
  | "direction"
  | "claimSummary"
  | "confidence"
  | "status"
  | "tweetCreatedAt"
>;

type ProfileWithClaims = PredictorProfile & { claims: ClaimRow[] };

export function serializeClaim(
  claim: ClaimRow,
  username: string
): {
  tweet_id: string;
  claim_summary: string;
  subject: string;
  direction: string | null;
  confidence: number;
  niche: string;
  status: string;
  tweet_created_at: string;
  tweet_text: string;
  url: string;
} {
  return {
    tweet_id: claim.tweetId,
    claim_summary: claim.claimSummary,
    subject: claim.subject,
    direction: claim.direction,
    confidence: claim.confidence,
    niche: claim.niche,
    status: claim.status,
    tweet_created_at: claim.tweetCreatedAt.toISOString(),
    tweet_text: claim.tweetText,
    url: `https://x.com/${username}/status/${claim.tweetId}`,
  };
}

export function serializePredictor(p: ProfileWithClaims) {
  return {
    username: p.username,
    display_name: p.displayName,
    niche: p.niche,
    bio: p.bio,
    follower_count: p.followerCount,
    discovery_score: p.discoveryScore,
    accuracy_score: p.accuracyScore,
    total_claims: p.totalClaims,
    hit_count: p.hitCount,
    miss_count: p.missCount,
    profile_url: `https://www.xfluxapi.com/predictors/u/${p.username}`,
    x_url: `https://x.com/${p.username}`,
    recent_claims: p.claims.map((c) => serializeClaim(c, p.username)),
  };
}

/** Ranked Smart Money accounts with recent claims, excluding handles. */
export async function listSmartMoney(options: {
  niche?: PredictorNiche;
  exclude?: string[];
  limit?: number;
  days?: number;
  claimsPerAccount?: number;
}) {
  const days = options.days ?? DEFAULT_DAYS;
  const since = sinceDaysAgo(days);
  const limit = options.limit ?? 10;
  const claimsPerAccount = options.claimsPerAccount ?? 3;
  const exclude = options.exclude ?? [];

  // Over-fetch then trim so exclude + "has recent claim" still fills limit.
  const take = Math.min(limit + exclude.length + 20, 100);

  const rows = await prisma.predictorProfile.findMany({
    where: {
      ...(options.niche ? { niche: options.niche } : {}),
      ...(exclude.length ? { username: { notIn: exclude } } : {}),
      claims: { some: { tweetCreatedAt: { gte: since } } },
    },
    orderBy: [{ discoveryScore: "desc" }, { accuracyScore: "desc" }],
    take,
    include: {
      claims: {
        where: { tweetCreatedAt: { gte: since } },
        orderBy: { tweetCreatedAt: "desc" },
        take: claimsPerAccount,
      },
    },
  });

  return rows.filter((r) => r.claims.length > 0).slice(0, limit);
}

export async function getSmartMoneyProfile(options: {
  username: string;
  days?: number;
  limit?: number;
}) {
  const username = options.username.toLowerCase().replace(/^@/, "");
  const days = options.days ?? DEFAULT_DAYS;
  const since = sinceDaysAgo(days);
  const limit = options.limit ?? 20;

  return prisma.predictorProfile.findUnique({
    where: { username },
    include: {
      claims: {
        where: { tweetCreatedAt: { gte: since } },
        orderBy: { tweetCreatedAt: "desc" },
        take: limit,
      },
    },
  });
}

export async function listSmartMoneyClaims(options: {
  niche?: PredictorNiche;
  exclude?: string[];
  limit?: number;
  days?: number;
}) {
  const days = options.days ?? DEFAULT_DAYS;
  const since = sinceDaysAgo(days);
  const limit = options.limit ?? 30;
  const exclude = options.exclude ?? [];

  return prisma.predictorClaim.findMany({
    where: {
      tweetCreatedAt: { gte: since },
      ...(options.niche ? { niche: options.niche } : {}),
      ...(exclude.length
        ? { predictor: { username: { notIn: exclude } } }
        : {}),
    },
    orderBy: { tweetCreatedAt: "desc" },
    take: limit,
    include: { predictor: true },
  });
}
