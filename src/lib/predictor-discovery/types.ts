import type { PredictorClaimStatus, PredictorNiche } from "@prisma/client";

export type { PredictorClaimStatus, PredictorNiche };

export const PREDICTOR_NICHES: PredictorNiche[] = [
  "MACRO",
  "TRADING",
  "CRYPTO",
  "GEOPOLITICS",
];

export const NICHE_META: Record<
  PredictorNiche,
  { slug: string; label: string; description: string }
> = {
  MACRO: {
    slug: "macro",
    label: "Macro & rates",
    description: "Voices that call Fed moves, CPI, yields, and recession risk before headlines spread.",
  },
  TRADING: {
    slug: "trading",
    label: "Trading & markets",
    description: "Flow scanners, index commentators, and accounts that post actionable market calls.",
  },
  CRYPTO: {
    slug: "crypto",
    label: "Crypto",
    description: "Bitcoin, majors, and on-chain accounts that lead narrative shifts early.",
  },
  GEOPOLITICS: {
    slug: "geopolitics",
    label: "Geopolitics",
    description: "Policy, sanctions, and conflict watchers that move risk sentiment on X.",
  },
};

export function nicheFromSlug(slug: string): PredictorNiche | undefined {
  return PREDICTOR_NICHES.find((n) => NICHE_META[n].slug === slug);
}

export function slugFromNiche(niche: PredictorNiche): string {
  return NICHE_META[niche].slug;
}

export interface ExtractedClaim {
  subject: string;
  direction: string | null;
  claimSummary: string;
  confidence: number;
}

export interface DiscoveryCandidate {
  username: string;
  displayName?: string;
  bio?: string;
  followerCount?: number;
  niche: PredictorNiche;
  claims: ExtractedClaim[];
  tweetId: string;
  tweetText: string;
  tweetCreatedAt: Date;
}

export interface DiscoveryResult {
  runId: string;
  seedsScanned: number;
  authorsFound: number;
  claimsAdded: number;
}
