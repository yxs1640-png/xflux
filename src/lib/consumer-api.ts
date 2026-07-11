import type { TwitterTweet, TwitterUser } from "./twitter-types";
import {
  extractTweetsFromResponse,
  extractUserFromResponse,
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

const USER_LOOKUP_ATTEMPTS: Array<{
  endpoint: string;
  params: (username: string) => Record<string, string | number | undefined>;
}> = [
  { endpoint: "UserResultByScreenName", params: (u) => ({ username: u }) },
  { endpoint: "UserResultByScreenName", params: (u) => ({ screenname: u }) },
  { endpoint: "UserResultByScreenName", params: (u) => ({ screen_name: u }) },
  { endpoint: "UserByScreenName", params: (u) => ({ username: u }) },
  { endpoint: "UserByScreenName", params: (u) => ({ screenname: u }) },
  { endpoint: "GetUserByScreenName", params: (u) => ({ username: u }) },
];

export async function getUserByUsernameFromConsumer(
  username: string
): Promise<TwitterUser | null> {
  const clean = username.replace("@", "").trim();
  let lastError: ConsumerApiError | null = null;

  for (const attempt of USER_LOOKUP_ATTEMPTS) {
    try {
      const raw = await consumerFetch<unknown>(attempt.endpoint, attempt.params(clean));
      const user = extractUserFromResponse(raw, clean);
      if (user) return user;
    } catch (err) {
      if (err instanceof ConsumerApiError) {
        lastError = err;
        if (err.status !== 404 && err.status !== 400) throw err;
      } else {
        throw err;
      }
    }
  }

  try {
    const raw = await consumerFetch<unknown>("Search", {
      q: `from:${clean}`,
      query: `from:${clean}`,
      count: 5,
    });
    const user = extractUserFromResponse(raw, clean);
    if (user) return user;

    const tweets = extractTweetsFromResponse(raw);
    const withAuthor = tweets.find((t) => t.author?.username.toLowerCase() === clean);
    if (withAuthor?.author) return withAuthor.author;
  } catch (err) {
    if (err instanceof ConsumerApiError && err.status !== 404 && err.status !== 400) {
      throw err;
    }
    if (err instanceof ConsumerApiError) lastError = err;
  }

  if (lastError && process.env.NODE_ENV === "development") {
    console.warn(`[consumer-api] User @${clean} not found after all attempts`, lastError.message);
  }

  return null;
}

export async function getUserTweetsFromConsumer(
  username: string,
  limit = 20
): Promise<TwitterTweet[]> {
  const user = await getUserByUsernameFromConsumer(username);
  const clean = username.replace("@", "").trim();
  const count = Math.min(Math.max(limit, 1), 100);
  const validUserId = user?.id && /^\d+$/.test(user.id) ? user.id : undefined;

  const attempts: Array<Record<string, string | number | undefined>> = [
    { q: `from:${clean}`, count },
    { query: `from:${clean}`, count },
    ...(validUserId
      ? [
          { user_id: validUserId, username: clean, screenname: clean, count },
          { userId: validUserId, username: clean, count },
        ]
      : [{ username: clean, screenname: clean, count }]),
  ];

  let lastError: ConsumerApiError | null = null;

  for (const endpoint of ["Search", "UserTweets", "UserMedia"]) {
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
          if (err.status !== 404 && err.status !== 400) throw err;
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
