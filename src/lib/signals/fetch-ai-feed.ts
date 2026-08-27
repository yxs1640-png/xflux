import "server-only";

import { getUserTweets, searchTweets } from "@/lib/twitter-proxy";
import type { TwitterTweet } from "@/lib/twitter-types";
import { buildAiBrief } from "./build-ai-brief";
import type { SignalFeed, SignalItem } from "./types";

/** AI / LLM leaders & labs — polled on each page refresh. */
export const AI_WATCH_ACCOUNTS = [
  "sama",
  "karpathy",
  "DeepSeekAI",
  "AnthropicAI",
  "ylecun",
] as const;

export const AI_SEARCH_QUERY =
  '(AI OR "artificial intelligence" OR LLM OR "ai agents") lang:en -filter:replies';

const TWEETS_PER_ACCOUNT = 4;
const SEARCH_LIMIT = 10;

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

export async function fetchAiSignalFeed(): Promise<SignalFeed> {
  const fetchedAt = new Date().toISOString();

  const [accountSettled, searchResults] = await Promise.all([
    Promise.allSettled(
      AI_WATCH_ACCOUNTS.map(async (username) => {
        const tweets = await getUserTweets(username, TWEETS_PER_ACCOUNT);
        return tweets
          .map((t) => tweetToSignal(t, "timeline", username))
          .filter((x): x is SignalItem => x !== null);
      })
    ),
    searchTweets(AI_SEARCH_QUERY, SEARCH_LIMIT).catch(() => [] as TwitterTweet[]),
  ]);

  const fromAccounts: SignalItem[] = [];
  for (const result of accountSettled) {
    if (result.status === "fulfilled") fromAccounts.push(...result.value);
  }

  const fromSearch = searchResults
    .map((t) => tweetToSignal(t, "search"))
    .filter((x): x is SignalItem => x !== null);

  const items = dedupeAndSort([...fromAccounts, ...fromSearch]).slice(0, 24);
  const brief = buildAiBrief(items);

  return {
    items,
    brief,
    fetchedAt,
    accountCount: AI_WATCH_ACCOUNTS.length,
    searchQuery: AI_SEARCH_QUERY,
  };
}
