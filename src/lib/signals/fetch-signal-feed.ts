import "server-only";

import { unstable_cache } from "next/cache";
import { getUserTweets, searchTweets } from "@/lib/twitter-proxy";
import type { TwitterTweet } from "@/lib/twitter-types";
import { buildSignalBrief } from "./build-signal-brief";
import type { SignalTopicConfig } from "./topics";
import type { SignalFeed, SignalItem } from "./types";

const TWEETS_PER_ACCOUNT = 4;
const SEARCH_LIMIT = 10;
const MAX_ITEMS = 24;
/** Cap per upstream call so one slow account does not block the whole page. */
const ACCOUNT_FETCH_MS = 8_000;
const SEARCH_FETCH_MS = 10_000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

function tweetToSignal(
  tweet: TwitterTweet,
  source: SignalItem["source"],
  fallbackUsername?: string
): SignalItem | null {
  const username = tweet.author?.username ?? fallbackUsername;
  if (!username || !tweet.text?.trim()) return null;

  return {
    id: tweet.id,
    username,
    displayName: tweet.author?.name ?? username,
    text: tweet.text.trim(),
    createdAt: tweet.created_at,
    tweetUrl: `https://x.com/${username}/status/${tweet.id}`,
    source,
    metrics: tweet.public_metrics,
  };
}

function dedupeAndSort(items: SignalItem[]): SignalItem[] {
  const seen = new Set<string>();
  return items
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function fetchSignalFeed(topic: SignalTopicConfig): Promise<SignalFeed> {
  const fetchedAt = new Date().toISOString();

  const [accountSettled, searchResults] = await Promise.all([
    Promise.allSettled(
      topic.watchAccounts.map(async (username) =>
        withTimeout(
          getUserTweets(username, TWEETS_PER_ACCOUNT)
            .then((tweets) =>
              tweets
                .map((t) => tweetToSignal(t, "timeline", username))
                .filter((x): x is SignalItem => x !== null)
            )
            .catch(() => [] as SignalItem[]),
          ACCOUNT_FETCH_MS,
          [] as SignalItem[]
        )
      )
    ),
    withTimeout(
      searchTweets(topic.searchQuery, SEARCH_LIMIT).catch(() => [] as TwitterTweet[]),
      SEARCH_FETCH_MS,
      [] as TwitterTweet[]
    ),
  ]);

  const fromAccounts: SignalItem[] = [];
  for (const result of accountSettled) {
    if (result.status === "fulfilled") fromAccounts.push(...result.value);
  }

  const fromSearch = searchResults
    .map((t) => tweetToSignal(t, "search"))
    .filter((x): x is SignalItem => x !== null);

  const items = dedupeAndSort([...fromAccounts, ...fromSearch]).slice(0, MAX_ITEMS);
  const brief = buildSignalBrief(items, topic);

  return {
    items,
    brief,
    fetchedAt,
    accountCount: topic.watchAccounts.length,
    searchQuery: topic.searchQuery,
  };
}

export function getCachedSignalFeed(topic: SignalTopicConfig): Promise<SignalFeed> {
  return unstable_cache(
    () => fetchSignalFeed(topic),
    ["signal-feed", topic.slug],
    { revalidate: 120, tags: [`signal-feed-${topic.slug}`] }
  )();
}

/** Bypass cache — used after manual refresh or `?refresh=1`. */
export function getFreshSignalFeed(topic: SignalTopicConfig): Promise<SignalFeed> {
  return fetchSignalFeed(topic);
}

export function getSignalFeed(
  topic: SignalTopicConfig,
  options?: { fresh?: boolean }
): Promise<SignalFeed> {
  return options?.fresh ? getFreshSignalFeed(topic) : getCachedSignalFeed(topic);
}
