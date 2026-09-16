import "server-only";

import type { PredictorNiche } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getUserByUsername, getUserTweets, searchTweets } from "@/lib/twitter-proxy";
import { extractClaimsFromTweets } from "./extract-claims";
import { NICHE_SEEDS } from "./seeds";
import { computeDiscoveryScore, countClaimStatuses } from "./score-predictor";
import { verifyClaim } from "./verify-claims";
import type { DiscoveryResult } from "./types";
import { PREDICTOR_NICHES } from "./types";

const TWEETS_PER_ACCOUNT = 40;
const SEARCH_LIMIT = 15;
const DISCOVERY_DAYS = 14;

function withinDiscoveryWindow(date: Date): boolean {
  return Date.now() - date.getTime() <= DISCOVERY_DAYS * 24 * 60 * 60 * 1000;
}

function tweetUsername(tweet: {
  author?: { username?: string };
  authorUsername?: string;
}): string | null {
  return tweet.author?.username ?? tweet.authorUsername ?? null;
}

async function upsertPredictorClaims(
  username: string,
  niche: PredictorNiche,
  profile: { displayName?: string; bio?: string; followerCount?: number },
  claims: ReturnType<typeof extractClaimsFromTweets>
): Promise<number> {
  if (claims.length === 0) return 0;

  const predictor = await prisma.predictorProfile.upsert({
    where: { username },
    create: {
      username,
      displayName: profile.displayName ?? null,
      bio: profile.bio ?? null,
      followerCount: profile.followerCount ?? null,
      niche,
      lastScannedAt: new Date(),
    },
    update: {
      displayName: profile.displayName ?? undefined,
      bio: profile.bio ?? undefined,
      followerCount: profile.followerCount ?? undefined,
      niche,
      lastScannedAt: new Date(),
    },
  });

  let added = 0;
  for (const claim of claims) {
    if (!withinDiscoveryWindow(claim.tweetCreatedAt)) continue;
    try {
      await prisma.predictorClaim.upsert({
        where: {
          predictorId_tweetId: { predictorId: predictor.id, tweetId: claim.tweetId },
        },
        create: {
          predictorId: predictor.id,
          tweetId: claim.tweetId,
          tweetText: claim.tweetText,
          niche,
          subject: claim.subject,
          direction: claim.direction,
          claimSummary: claim.claimSummary,
          confidence: claim.confidence,
          tweetCreatedAt: claim.tweetCreatedAt,
        },
        update: {
          tweetText: claim.tweetText,
          claimSummary: claim.claimSummary,
          confidence: claim.confidence,
        },
      });
      added++;
    } catch {
      // skip duplicate races
    }
  }

  const allClaims = await prisma.predictorClaim.findMany({
    where: { predictorId: predictor.id },
  });

  const discoveryScore = computeDiscoveryScore({
    claims: allClaims.map((c) => ({
      confidence: c.confidence,
      tweetCreatedAt: c.tweetCreatedAt,
    })),
    followerCount: profile.followerCount ?? null,
  });

  const statusCounts = countClaimStatuses(allClaims);

  await prisma.predictorProfile.update({
    where: { id: predictor.id },
    data: {
      discoveryScore,
      totalClaims: allClaims.length,
      ...statusCounts,
    },
  });

  return added;
}

async function scanAccount(username: string, niche: PredictorNiche): Promise<number> {
  const user = await getUserByUsername(username);
  const tweets = await getUserTweets(username, TWEETS_PER_ACCOUNT);
  const recent = tweets.filter((t) => {
    const created = t.created_at ? new Date(t.created_at) : new Date();
    return withinDiscoveryWindow(created);
  });

  const claims = extractClaimsFromTweets(
    recent.map((t) => ({
      id: t.id,
      text: t.text,
      createdAt: t.created_at,
    })),
    niche
  );

  return upsertPredictorClaims(username, niche, {
    displayName: user?.name,
    bio: user?.description,
    followerCount: user?.followers_count,
  }, claims);
}

async function scanSearchQuery(query: string, niche: PredictorNiche): Promise<number> {
  const tweets = await searchTweets(query, SEARCH_LIMIT);
  let added = 0;
  const seenAuthors = new Set<string>();

  for (const tweet of tweets) {
    const username = tweetUsername(tweet);
    if (!username || seenAuthors.has(username)) continue;
    seenAuthors.add(username);

    const created = tweet.created_at ? new Date(tweet.created_at) : new Date();
    if (!withinDiscoveryWindow(created)) continue;

    const claim = extractClaimsFromTweets(
      [{ id: tweet.id, text: tweet.text, createdAt: tweet.created_at }],
      niche
    );
    if (claim.length === 0) continue;

    const user = await getUserByUsername(username);
    added += await upsertPredictorClaims(
      username.toLowerCase(),
      niche,
      {
        displayName: user?.name ?? tweet.author?.name,
        bio: user?.description,
        followerCount: user?.followers_count ?? tweet.author?.followers_count,
      },
      claim
    );
  }

  return added;
}

async function verifyOpenClaims(): Promise<void> {
  const openClaims = await prisma.predictorClaim.findMany({
    where: { status: "OPEN" },
    include: { predictor: true },
    take: 100,
    orderBy: { tweetCreatedAt: "asc" },
  });

  for (const claim of openClaims) {
    const tweets = await getUserTweets(claim.predictor.username, 30);
    const laterTweets = tweets
      .filter((t) => t.created_at && new Date(t.created_at) > claim.tweetCreatedAt)
      .map((t) => ({ text: t.text, createdAt: new Date(t.created_at!) }));

    const result = verifyClaim({
      claimText: claim.tweetText,
      claimCreatedAt: claim.tweetCreatedAt,
      laterTweets,
    });

    if (result.status === claim.status) continue;

    await prisma.predictorClaim.update({
      where: { id: claim.id },
      data: {
        status: result.status,
        statusReason: result.reason,
        verifiedAt: result.status !== "OPEN" ? new Date() : null,
      },
    });

    const allClaims = await prisma.predictorClaim.findMany({
      where: { predictorId: claim.predictorId },
    });
    const statusCounts = countClaimStatuses(allClaims);
    await prisma.predictorProfile.update({
      where: { id: claim.predictorId },
      data: statusCounts,
    });
  }
}

export async function runPredictorDiscovery(options?: {
  niche?: PredictorNiche;
}): Promise<DiscoveryResult> {
  const niches = options?.niche ? [options.niche] : PREDICTOR_NICHES;

  const run = await prisma.predictorDiscoveryRun.create({
    data: { status: "RUNNING", niche: options?.niche ?? null },
  });

  let seedsScanned = 0;
  let authorsFound = 0;
  let claimsAdded = 0;

  try {
    for (const niche of niches) {
      const config = NICHE_SEEDS[niche];

      for (const account of config.accounts) {
        seedsScanned++;
        try {
          const added = await scanAccount(account.toLowerCase(), niche);
          if (added > 0) authorsFound++;
          claimsAdded += added;
        } catch (err) {
          console.warn(`[predictor-discovery] seed @${account} failed:`, err);
        }
      }

      for (const query of config.searchQueries) {
        seedsScanned++;
        try {
          claimsAdded += await scanSearchQuery(query, niche);
        } catch (err) {
          console.warn(`[predictor-discovery] search failed:`, err);
        }
      }
    }

    await verifyOpenClaims();

    const authorCount = await prisma.predictorProfile.count();

    await prisma.predictorDiscoveryRun.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        seedsScanned,
        authorsFound: authorCount,
        claimsAdded,
        finishedAt: new Date(),
      },
    });

    return { runId: run.id, seedsScanned, authorsFound: authorCount, claimsAdded };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await prisma.predictorDiscoveryRun.update({
      where: { id: run.id },
      data: { status: "FAILED", error: message, finishedAt: new Date() },
    });
    throw err;
  }
}
