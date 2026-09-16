import type { PredictorNiche } from "@prisma/client";
import type { ExtractedClaim } from "./types";

const PREDICTION_VERBS =
  /\b(will|expect|expects|predict|predicts|forecast|forecasts|see|sees|call for|calling for|going to|should hit|targeting|targets|anticipate|anticipates)\b/i;

const MACRO_SUBJECTS =
  /\b(fed|fomc|cpi|ppi|inflation|deflation|rates?|rate cut|rate hike|treasury|yield|gdp|jobs|recession|soft landing)\b/i;
const TRADING_SUBJECTS =
  /\b(\$[A-Z]{1,5}|spy|qqq|iwm|s&p|nasdaq|dow|stocks?|market|earnings|eps|guidance|options?|flow)\b/i;
const CRYPTO_SUBJECTS =
  /\b(bitcoin|btc|ethereum|eth|solana|sol|crypto|altcoin|memecoin|etf|halving|liquidation)\b/i;
const GEOPOLITICS_SUBJECTS =
  /\b(war|sanction|tariff|oil|china|russia|ukraine|middle east|geopolit|nato|risk.?off|policy)\b/i;

const BULLISH = /\b(rally|rise|surge|pump|breakout|bullish|higher|moon|rip|rip higher|beat|cut rates)\b/i;
const BEARISH = /\b(crash|dump|fall|drop|bearish|lower|recession|risk.?off|miss|hike rates|selloff)\b/i;

function subjectForNiche(text: string, niche: PredictorNiche): string | null {
  const patterns: Record<PredictorNiche, RegExp> = {
    MACRO: MACRO_SUBJECTS,
    TRADING: TRADING_SUBJECTS,
    CRYPTO: CRYPTO_SUBJECTS,
    GEOPOLITICS: GEOPOLITICS_SUBJECTS,
  };
  const match = text.match(patterns[niche]);
  if (match) return match[0];
  const ticker = text.match(/\$[A-Z]{1,5}/);
  if (ticker && (niche === "TRADING" || niche === "CRYPTO")) return ticker[0];
  return null;
}

function directionFromText(text: string): string | null {
  const bull = BULLISH.test(text);
  const bear = BEARISH.test(text);
  if (bull && !bear) return "bullish";
  if (bear && !bull) return "bearish";
  if (bull && bear) return "mixed";
  return null;
}

function buildSummary(text: string, subject: string, direction: string | null): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  const snippet = trimmed.length > 160 ? `${trimmed.slice(0, 157)}…` : trimmed;
  if (direction) return `${direction} on ${subject}: ${snippet}`;
  return `${subject}: ${snippet}`;
}

function confidenceScore(text: string, subject: string, direction: string | null): number {
  let score = 0.35;
  if (PREDICTION_VERBS.test(text)) score += 0.25;
  if (subject) score += 0.15;
  if (direction && direction !== "mixed") score += 0.1;
  if (/\b(by|before|this week|tomorrow|q[1-4]|202[4-9]|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(text)) {
    score += 0.1;
  }
  if (/\$[A-Z]{1,5}/.test(text)) score += 0.05;
  return Math.min(0.95, score);
}

/** Extract zero or one primary claim from a tweet. */
export function extractClaimFromTweet(
  text: string,
  niche: PredictorNiche
): ExtractedClaim | null {
  if (!text || text.length < 20) return null;
  if (!PREDICTION_VERBS.test(text)) return null;

  const subject = subjectForNiche(text, niche);
  if (!subject) return null;

  const direction = directionFromText(text);
  const confidence = confidenceScore(text, subject, direction);
  if (confidence < 0.5) return null;

  return {
    subject,
    direction,
    claimSummary: buildSummary(text, subject, direction),
    confidence,
  };
}

export function extractClaimsFromTweets(
  tweets: Array<{ id: string; text: string; createdAt?: Date | string | null }>,
  niche: PredictorNiche
): Array<ExtractedClaim & { tweetId: string; tweetText: string; tweetCreatedAt: Date }> {
  const out: Array<ExtractedClaim & { tweetId: string; tweetText: string; tweetCreatedAt: Date }> =
    [];

  for (const tweet of tweets) {
    const claim = extractClaimFromTweet(tweet.text, niche);
    if (!claim) continue;
    out.push({
      ...claim,
      tweetId: tweet.id,
      tweetText: tweet.text,
      tweetCreatedAt: tweet.createdAt ? new Date(tweet.createdAt) : new Date(),
    });
  }
  return out;
}
