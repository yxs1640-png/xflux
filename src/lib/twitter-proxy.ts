export type { TwitterTweet, TwitterUser } from "./twitter-types";

import type { TwitterTweet, TwitterUser } from "./twitter-types";
import {
  ConsumerApiError,
  getTweetByIdFromConsumer,
  getUserByUsernameFromConsumer,
  getUserTweetsFromConsumer,
  isConsumerApiConfigured,
  searchTweetsFromConsumer,
} from "./consumer-api";

const API_SERVER = process.env.XFLUX_API_SERVER_URL?.replace(/\/$/, "");
const INTERNAL_KEY = process.env.XFLUX_INTERNAL_KEY;
const UPSTREAM_TIMEOUT_MS = Number(process.env.XFLUX_UPSTREAM_TIMEOUT_MS || 25_000);

function isApiServerConfigured(): boolean {
  return Boolean(
    API_SERVER &&
      INTERNAL_KEY &&
      !INTERNAL_KEY.includes("replace") &&
      process.env.USE_API_SERVER !== "false"
  );
}

/** Vercel often cannot reach Consumer IP directly — prefer Fly in production. */
function shouldUseConsumerDirect(): boolean {
  if (!isConsumerApiConfigured()) return false;
  if (process.env.NODE_ENV === "production" && isApiServerConfigured()) {
    return false;
  }
  return true;
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = UPSTREAM_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export class ApiServerError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function fetchFromApiServer<T>(path: string): Promise<T | null> {
  if (!isApiServerConfigured()) return null;

  try {
    const res = await fetchWithTimeout(`${API_SERVER}${path}`, {
      headers: { "x-flux-internal-key": INTERNAL_KEY! },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      throw new ApiServerError(body || res.statusText, res.status);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiServerError) throw err;
    const message =
      err instanceof Error && err.name === "AbortError"
        ? `API server timeout after ${UPSTREAM_TIMEOUT_MS}ms`
        : "API server unreachable";
    console.error("[twitter-proxy]", message, err);
    throw new ApiServerError(message, 504);
  }
}

async function fetchFromTwitterApi<T>(
  path: string,
  params?: Record<string, string>
): Promise<T | null> {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) return null;

  const url = new URL(`https://api.twitter.com/2${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function getUserByUsername(
  username: string
): Promise<TwitterUser | null> {
  const clean = username.replace("@", "").toLowerCase();

  if (shouldUseConsumerDirect()) {
    try {
      const user = await getUserByUsernameFromConsumer(clean);
      if (user) return user;
    } catch (err) {
      if (err instanceof ConsumerApiError && err.status === 404) return null;
      if (err instanceof ConsumerApiError && err.status === 503) throw err;
      throw err;
    }
  } else if (process.env.NODE_ENV === "development") {
    console.warn("[twitter-proxy] CONSUMER_API_KEY is missing — set it in .env and restart dev server");
  }

  try {
    const fromServer = await fetchFromApiServer<{ data: TwitterUser }>(
      `/v1/users/${encodeURIComponent(clean)}`
    );
    if (fromServer?.data) return fromServer.data;
  } catch (err) {
    if (err instanceof ApiServerError && err.status === 404) return null;
    throw err;
  }

  const live = await fetchFromTwitterApi<{ data: TwitterUser }>(
    `/users/by/username/${clean}`,
    {
      "user.fields":
        "description,public_metrics,profile_image_url,verified,created_at",
    }
  );

  if (live?.data) {
    const u = live.data as TwitterUser & {
      public_metrics?: {
        followers_count: number;
        following_count: number;
        tweet_count: number;
      };
    };
    return {
      id: u.id,
      username: u.username,
      name: u.name,
      description: u.description,
      followers_count: u.public_metrics?.followers_count ?? 0,
      following_count: u.public_metrics?.following_count ?? 0,
      tweet_count: u.public_metrics?.tweet_count ?? 0,
      profile_image_url: u.profile_image_url,
      verified: u.verified ?? false,
      created_at: u.created_at,
    };
  }

  if (isConsumerApiConfigured() || isApiServerConfigured()) {
    throw new Error(
      "User profile not found — try search or verify the username."
    );
  }

  throw new Error("Data source temporarily unavailable. Please try again later.");
}

export async function getUserTweets(
  username: string,
  limit = 10
): Promise<TwitterTweet[]> {
  const clean = username.replace("@", "").toLowerCase();

  if (shouldUseConsumerDirect()) {
    try {
      return await getUserTweetsFromConsumer(clean, limit);
    } catch (err) {
      if (err instanceof ConsumerApiError) throw err;
    }
  }

  try {
    const fromServer = await fetchFromApiServer<{ data: TwitterTweet[] }>(
      `/v1/users/${encodeURIComponent(clean)}/tweets?limit=${limit}`
    );
    if (fromServer?.data) return fromServer.data;
  } catch (err) {
    if (err instanceof ApiServerError) throw err;
  }

  const user = await getUserByUsername(username);
  if (!user) return [];

  const live = await fetchFromTwitterApi<{ data: TwitterTweet[] }>(
    `/users/${user.id}/tweets`,
    {
      max_results: String(Math.min(limit, 100)),
      "tweet.fields": "created_at,public_metrics,author_id",
    }
  );

  if (live?.data?.length) {
    return live.data.map((t) => ({ ...t, author: user }));
  }

  return [];
}

export async function searchTweets(
  query: string,
  limit = 20
): Promise<TwitterTweet[]> {
  if (shouldUseConsumerDirect()) {
    try {
      return await searchTweetsFromConsumer(query, limit);
    } catch (err) {
      if (err instanceof ConsumerApiError) throw err;
    }
  }

  try {
    const fromServer = await fetchFromApiServer<{ data: TwitterTweet[] }>(
      `/v1/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (fromServer?.data) return fromServer.data;
  } catch (err) {
    if (err instanceof ApiServerError) throw err;
  }

  const live = await fetchFromTwitterApi<{ data: TwitterTweet[] }>(
    "/tweets/search/recent",
    {
      query,
      max_results: String(Math.min(limit, 100)),
      "tweet.fields": "created_at,public_metrics,author_id",
    }
  );

  if (live?.data?.length) return live.data;

  return [];
}

export async function getTweetById(id: string): Promise<TwitterTweet | null> {
  if (shouldUseConsumerDirect()) {
    try {
      return await getTweetByIdFromConsumer(id);
    } catch (err) {
      if (err instanceof ConsumerApiError && err.status === 404) return null;
      if (err instanceof ConsumerApiError) throw err;
    }
  }

  try {
    const fromServer = await fetchFromApiServer<{ data: TwitterTweet }>(
      `/v1/tweets/${encodeURIComponent(id)}`
    );
    if (fromServer?.data) return fromServer.data;
  } catch (err) {
    if (err instanceof ApiServerError && err.status === 404) return null;
    if (err instanceof ApiServerError) throw err;
  }

  const live = await fetchFromTwitterApi<{ data: TwitterTweet }>(
    `/tweets/${id}`,
    { "tweet.fields": "created_at,public_metrics,author_id" }
  );

  if (live?.data) return live.data;

  return null;
}

export async function postTweet(
  text: string
): Promise<{ id: string; text: string }> {
  throw new Error("Posting is not supported yet.");
}

export function isTwitterDataSourceConfigured(): boolean {
  if (shouldUseConsumerDirect()) return true;
  return isApiServerConfigured() || Boolean(process.env.TWITTER_BEARER_TOKEN?.trim());
}
