import type { PredictorClaimStatus } from "@prisma/client";

const HIT_PATTERNS =
  /\b(called it|was right|nailed it|as predicted|told you|in the money|correct call|aged well)\b/i;
const MISS_PATTERNS =
  /\b(was wrong|missed|incorrect|bad call|aged poorly|didn't happen|did not happen)\b/i;

const CLAIM_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const VERIFY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export interface VerifyInput {
  claimText: string;
  claimCreatedAt: Date;
  laterTweets: Array<{ text: string; createdAt: Date }>;
}

export interface VerifyResult {
  status: PredictorClaimStatus;
  reason: string;
}

/** Heuristic verification using the author's later tweets (no market data API). */
export function verifyClaim(input: VerifyInput): VerifyResult {
  const now = Date.now();
  const claimAge = now - input.claimCreatedAt.getTime();

  if (claimAge > CLAIM_MAX_AGE_MS) {
    return { status: "EXPIRED", reason: "Claim window (14d) elapsed without clear outcome." };
  }

  const relevant = input.laterTweets.filter((t) => {
    const afterClaim = t.createdAt.getTime() > input.claimCreatedAt.getTime();
    const withinWindow = t.createdAt.getTime() - input.claimCreatedAt.getTime() <= VERIFY_WINDOW_MS;
    return afterClaim && withinWindow;
  });

  for (const tweet of relevant) {
    if (HIT_PATTERNS.test(tweet.text)) {
      return { status: "HIT", reason: "Author referenced a successful call in a later tweet." };
    }
    if (MISS_PATTERNS.test(tweet.text)) {
      return { status: "MISS", reason: "Author acknowledged a wrong call in a later tweet." };
    }
  }

  if (claimAge > 7 * 24 * 60 * 60 * 1000) {
    return {
      status: "INCONCLUSIVE",
      reason: "No explicit outcome language found in follow-up tweets.",
    };
  }

  return { status: "OPEN", reason: "Awaiting follow-up tweets or market resolution." };
}
