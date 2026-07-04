import { config } from "../config.js";
import {
  extractTweetsFromResponse,
  extractUserFromResponse,
  type TwitterTweet,
  type TwitterUser,
} from "./normalizers.js";

export class ConsumerApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: string
  ) {
    super(message);
    this.name = "ConsumerApiError";
  }
}

async function consumerFetch<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const path = `${config.consumerApiPrefix}/${endpoint.replace(/^\//, "")}`;
  const url = new URL(path, `${config.consumerApiBaseUrl}/`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-Api-Key": config.consumerApiKey,
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new ConsumerApiError(
      `Consumer API ${endpoint} failed (${res.status})`,
      res.status,
      text
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ConsumerApiError(`Invalid JSON from Consumer API ${endpoint}`, 502, text);
  }
}

export async function fetchUserByUsername(username: string): Promise<TwitterUser> {
  const clean = username.replace("@", "").trim();
  const raw = await consumerFetch<unknown>("UserResultByScreenName", {
    username: clean,
    screenname: clean,
  });

  const user = extractUserFromResponse(raw, clean);
  if (!user) {
    throw new ConsumerApiError(`User @${clean} not found`, 404);
  }

  return user;
}

export async function fetchUserTweets(
  username: string,
  limit = 20
): Promise<TwitterTweet[]> {
  const user = await fetchUserByUsername(username);
  const count = Math.min(Math.max(limit, 1), 100);

  let raw: unknown;
  try {
    raw = await consumerFetch<unknown>("UserTweets", {
      user_id: user.id,
      userId: user.id,
      username: user.username,
      screenname: user.username,
      count,
    });
  } catch (err) {
    if (err instanceof ConsumerApiError && (err.status === 404 || err.status === 400)) {
      raw = await consumerFetch<unknown>("UserMedia", {
        user_id: user.id,
        userId: user.id,
        count,
      });
    } else {
      throw err;
    }
  }

  const tweets = extractTweetsFromResponse(raw).slice(0, count);
  return tweets.map((t) => ({ ...t, author_id: user.id, author: user }));
}

export async function searchTweets(query: string, limit = 20): Promise<TwitterTweet[]> {
  const count = Math.min(Math.max(limit, 1), 100);
  const raw = await consumerFetch<unknown>("Search", {
    q: query,
    query,
    count,
  });

  return extractTweetsFromResponse(raw).slice(0, count);
}

export async function fetchTweetById(id: string): Promise<TwitterTweet> {
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
  const tweet = tweets.find((t) => t.id === id) ?? tweets[0];

  if (!tweet) {
    throw new ConsumerApiError(`Tweet ${id} not found`, 404);
  }

  return tweet;
}
