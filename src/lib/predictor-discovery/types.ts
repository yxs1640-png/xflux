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
    description: "Fed, inflation, CPI, rates, and macro catalyst voices on X.",
  },
  TRADING: {
    slug: "trading",
    label: "Trading & markets",
    description: "Equity, index, flow, and market-timing accounts.",
  },
  CRYPTO: {
    slug: "crypto",
    label: "Crypto",
    description: "Bitcoin, majors, and on-chain narrative predictors.",
  },
  GEOPOLITICS: {
    slug: "geopolitics",
    label: "Geopolitics",
    description: "Policy, sanctions, war, and risk-off forecast accounts.",
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
