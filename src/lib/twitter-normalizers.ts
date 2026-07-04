import type { TwitterTweet, TwitterUser } from "./twitter-types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function pickNumber(...values: unknown[]): number {
  for (const v of values) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v !== "") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function pickString(...values: unknown[]): string {
  for (const v of values) {
    if (typeof v === "string" && v.length > 0) return v;
  }
  return "";
}

export function normalizeUser(raw: unknown, fallbackUsername?: string): TwitterUser | null {
  const root = asRecord(raw);
  if (!root) return null;

  const resultNode =
    asRecord(asRecord(asRecord(root.data)?.user)?.result) ??
    asRecord(asRecord(root.user)?.result) ??
    asRecord(root.result);

  if (resultNode) {
    const legacy = asRecord(resultNode.legacy);
    if (legacy) {
      const core = asRecord(resultNode.core);
      const username = pickString(
        legacy.screen_name,
        legacy.screenName,
        legacy.username,
        fallbackUsername
      ).replace("@", "");

      if (username) {
        return {
          id: pickString(resultNode.rest_id, legacy.id_str, legacy.id, legacy.user_id, `user_${username}`),
          username,
          name: pickString(legacy.name, core?.name, username),
          description: pickString(legacy.description, legacy.bio) || undefined,
          followers_count: pickNumber(legacy.followers_count, legacy.follower_count),
          following_count: pickNumber(legacy.friends_count, legacy.following_count),
          tweet_count: pickNumber(legacy.statuses_count, legacy.tweet_count, legacy.media_count),
          profile_image_url:
            pickString(legacy.profile_image_url_https, legacy.profile_image_url) || undefined,
          verified: Boolean(legacy.verified || legacy.is_blue_verified || resultNode.is_blue_verified),
          created_at: pickString(legacy.created_at) || new Date(0).toISOString(),
        };
      }
    }
  }

  const candidates = [
    root,
    asRecord(root.data),
    asRecord(asRecord(root.data)?.user),
    asRecord(asRecord(asRecord(root.data)?.user)?.result),
    asRecord(root.result),
    asRecord(asRecord(root.result)?.legacy),
    asRecord(root.legacy),
  ].filter(Boolean) as Record<string, unknown>[];

  let legacy: Record<string, unknown> | null = null;
  let core: Record<string, unknown> | null = null;

  for (const c of candidates) {
    if (asRecord(c.legacy)) legacy = asRecord(c.legacy);
    if (asRecord(c.core)) core = asRecord(c.core);
    if (legacy) break;
    if (c.screen_name || c.screenName || c.username) {
      legacy = c;
      break;
    }
  }

  const node = legacy ?? candidates[candidates.length - 1];
  if (!node) return null;

  const coreNode = core ?? node;
  const username = pickString(
    node.screen_name,
    node.screenName,
    node.username,
    fallbackUsername
  ).replace("@", "");

  if (!username) return null;

  return {
    id: pickString(node.id_str, node.rest_id, node.id, node.user_id, `user_${username}`),
    username,
    name: pickString(node.name, coreNode.name, username),
    description: pickString(node.description, node.bio) || undefined,
    followers_count: pickNumber(node.followers_count, node.follower_count),
    following_count: pickNumber(node.friends_count, node.following_count),
    tweet_count: pickNumber(node.statuses_count, node.tweet_count, node.media_count),
    profile_image_url:
      pickString(node.profile_image_url_https, node.profile_image_url) || undefined,
    verified: Boolean(node.verified || node.is_blue_verified || node.is_verified),
    created_at: pickString(node.created_at) || new Date(0).toISOString(),
  };
}

export function normalizeTweet(raw: unknown): TwitterTweet | null {
  const root = asRecord(raw);
  if (!root) return null;

  const candidates = [
    root,
    asRecord(root.legacy),
    asRecord(root.tweet),
    asRecord(asRecord(root.tweet)?.legacy),
    asRecord(asRecord(root.content)?.itemContent)?.tweet_results &&
      asRecord(asRecord(asRecord(asRecord(root.content)?.itemContent)?.tweet_results)?.result),
    asRecord(asRecord(root.result)?.legacy),
  ].filter(Boolean) as Record<string, unknown>[];

  const node = candidates.find((c) => c.full_text || c.text || c.id_str || c.id) ?? candidates[0];
  if (!node) return null;

  const legacy = asRecord(node.legacy) ?? node;
  const id = pickString(legacy.id_str, legacy.id, legacy.rest_id);
  const text = pickString(legacy.full_text, legacy.text);
  if (!id || !text) return null;

  return {
    id,
    text,
    author_id: pickString(legacy.user_id_str, legacy.author_id, legacy.user_id),
    created_at: pickString(legacy.created_at) || new Date().toISOString(),
    public_metrics: {
      retweet_count: pickNumber(legacy.retweet_count),
      reply_count: pickNumber(legacy.reply_count),
      like_count: pickNumber(legacy.favorite_count, legacy.like_count),
      quote_count: pickNumber(legacy.quote_count),
    },
  };
}

export function extractTweetsFromResponse(raw: unknown): TwitterTweet[] {
  const tweets: TwitterTweet[] = [];
  const seen = new Set<string>();

  function walk(node: unknown) {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    const obj = asRecord(node);
    if (!obj) return;

    const tweet = normalizeTweet(obj);
    if (tweet && !seen.has(tweet.id)) {
      seen.add(tweet.id);
      tweets.push(tweet);
    }

    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") walk(value);
    }
  }

  walk(raw);
  return tweets;
}

export function extractUserFromResponse(raw: unknown, username?: string): TwitterUser | null {
  const direct = normalizeUser(raw, username);
  if (direct) return direct;

  const root = asRecord(raw);
  if (!root) return null;

  const queue: unknown[] = [root];
  while (queue.length) {
    const current = queue.shift();
    const obj = asRecord(current);
    if (!obj) continue;

    const user = normalizeUser(obj, username);
    if (user) return user;

    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") queue.push(value);
    }
  }

  return null;
}
