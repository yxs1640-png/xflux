import type { TwitterTweet, TwitterUser } from "./twitter-types";
import {
  extractTweetsFromResponse,
  mapConsumerProfilePassthrough,
} from "./twitter-normalizers";

function getConsumerEnv() {
  const apiKey = (process.env.CONSUMER_API_KEY ?? "").trim();
  return {
    baseUrl: (process.env.CONSUMER_API_BASE_URL || "http://89.167.53.180").replace(/\/$/, ""),
    apiKey,
    prefix: process.env.CONSUMER_API_PREFIX || "/consumer",
  };
}

export function isConsumerApiConfigured(): boolean {
  const { apiKey } = getConsumerEnv();
  return Boolean(apiKey && apiKey.length > 3 && !apiKey.startsWith("replace"));
}

function isRetryableConsumerStatus(status: number): boolean {
  return status === 400 || status === 404 || status === 405;
}

class ConsumerApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function consumerFetch<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const { baseUrl, apiKey, prefix } = getConsumerEnv();

  if (!isConsumerApiConfigured()) {
    throw new ConsumerApiError(
      "CONSUMER_API_KEY is empty in .env — save the file and restart npm run dev",
      503
    );
  }

  const path = `${prefix}/${endpoint.replace(/^\//, "")}`;
  const url = new URL(path, `${baseUrl}/`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const controller = new AbortController();
  const timeoutMs = Number(process.env.XFLUX_UPSTREAM_TIMEOUT_MS || 25_000);
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: "GET",
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ConsumerApiError(`Consumer API timeout after ${timeoutMs}ms`, 504);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new ConsumerApiError(`Consumer API ${endpoint} returned ${res.status}`, res.status);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ConsumerApiError(`Invalid JSON from Consumer API ${endpoint}`, 502);
  }
}

const PROFILE_PARAM_KEYS = ["username", "screenname", "screen_name"] as const;

export async function getUserByUsernameFromConsumer(
  username: string
): Promise<TwitterUser | null> {
  const clean = username.replace("@", "").trim();
  let lastError: ConsumerApiError | null = null;

  for (const paramKey of PROFILE_PARAM_KEYS) {
    try {
      const raw = await consumerFetch<unknown>("UserResultByScreenName", {
        [paramKey]: clean,
      });
      const user = mapConsumerProfilePassthrough(raw, clean);
      if (user) return user;
    } catch (err) {
      if (err instanceof ConsumerApiError) {
        lastError = err;
        if (!isRetryableConsumerStatus(err.status)) throw err;
      } else {
        throw err;
      }
    }
  }

  if (lastError && process.env.NODE_ENV === "development") {
    console.warn(`[consumer-api] User @${clean} not found`, lastError.message);
  }

  return null;
}

function fallbackAuthor(username: string): TwitterUser {
  return {
    id: "",
    username,
    name: username,
    followers_count: 0,
    following_count: 0,
    tweet_count: 0,
    verified: false,
    created_at: "",
  };
}

async function searchTimelineFromConsumer(
  clean: string,
  count: number
): Promise<TwitterTweet[]> {
  for (const params of [
    { q: `from:${clean}`, count },
    { query: `from:${clean}`, count },
  ]) {
    try {
      const raw = await consumerFetch<unknown>("Search", params);
      const tweets = extractTweetsFromResponse(raw).slice(0, count);
      if (tweets.length) return tweets;
    } catch (err) {
      if (err instanceof ConsumerApiError && !isRetryableConsumerStatus(err.status)) {
        throw err;
      }
    }
  }
  return [];
}

export async function getUserTweetsFromConsumer(
  username: string,
  limit = 20
): Promise<TwitterTweet[]> {
  const clean = username.replace("@", "").trim();
  const count = Math.min(Math.max(limit, 1), 100);

  // Fast path: one Search call — skip profile lookup (saves 1–3 round trips per account).
  const fromSearch = await searchTimelineFromConsumer(clean, count);
  if (fromSearch.length) {
    const author = fromSearch[0]?.author ?? fallbackAuthor(clean);
    return fromSearch.map((t) => ({
      ...t,
      author_id: t.author_id || author.id,
      author: t.author ?? author,
    }));
  }

  const user = await getUserByUsernameFromConsumer(username);
  const validUserId = user?.id && /^\d+$/.test(user.id) ? user.id : undefined;

  const attempts: Array<Record<string, string | number | undefined>> = [
    ...(validUserId
      ? [
          { user_id: validUserId, username: clean, screenname: clean, count },
          { userId: validUserId, username: clean, count },
        ]
      : [{ username: clean, screenname: clean, count }]),
  ];

  let lastError: ConsumerApiError | null = null;

  for (const endpoint of ["UserTweets", "UserMedia"]) {
    for (const params of attempts) {
      try {
        const raw = await consumerFetch<unknown>(endpoint, params);
        const tweets = extractTweetsFromResponse(raw).slice(0, count);
        if (tweets.length) {
          return tweets.map((t) => ({
            ...t,
            author_id: validUserId ?? user?.id ?? t.author_id,
            author: user ?? t.author,
          }));
        }
      } catch (err) {
        if (err instanceof ConsumerApiError) {
          lastError = err;
          if (!isRetryableConsumerStatus(err.status)) throw err;
        }
      }
    }
  }

  if (lastError && lastError.status >= 500) throw lastError;
  return [];
}

export async function searchTweetsFromConsumer(
  query: string,
  limit = 20
): Promise<TwitterTweet[]> {
  const count = Math.min(Math.max(limit, 1), 100);
  const raw = await consumerFetch<unknown>("Search", {
    q: query,
    query,
    count,
  });
  return extractTweetsFromResponse(raw).slice(0, count);
}

export async function getTweetByIdFromConsumer(id: string): Promise<TwitterTweet | null> {
  let raw: unknown;

  try {
    raw = await consumerFetch<unknown>("TweetDetailConversationv2", {
      tweet_id: id,
      tweetId: id,
      id,
    });
  } catch {
    raw = await consumerFetch<unknown>("TweetResultByRestId", {
      tweet_id: id,
      tweetId: id,
      id,
    });
  }

  const tweets = extractTweetsFromResponse(raw);
  return tweets.find((t) => t.id === id) ?? tweets[0] ?? null;
}

export { ConsumerApiError };
