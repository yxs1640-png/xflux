export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  description?: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  profile_image_url?: string;
  profile_banner_url?: string;
  profile_image_shape?: string;
  verified: boolean;
  legacy_verified?: boolean;
  verified_type?: string;
  created_at: string;
  location?: string;
  url?: string;
  website?: string;
  protected?: boolean;
  can_dm?: boolean;
  suspended?: boolean;
  professional_type?: string;
  professional_categories?: string[];
  has_extended_profile?: boolean;
}

export interface TwitterTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  author?: TwitterUser;
}

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
    if (typeof v === "bigint") return v.toString();
    if (typeof v === "number" && Number.isFinite(v)) return String(Math.trunc(v));
  }
  return "";
}

function isStubUser(user: TwitterUser): boolean {
  return user.id.startsWith("user_");
}

/** Snowflake tweet IDs are often mistaken for user rest_id in search payloads. */
function looksLikeTweetId(id: string): boolean {
  return /^\d{16,}$/.test(id);
}

function isUsableUser(user: TwitterUser | null): user is TwitterUser {
  if (!user || isStubUser(user) || looksLikeTweetId(user.id)) return false;

  const hasMetrics =
    user.followers_count > 0 || user.following_count > 0 || user.tweet_count > 0;
  if (hasMetrics) return true;

  // Zero-metric nodes from Search are usually tweet authors, not profiles.
  if (user.name.toLowerCase() === user.username.toLowerCase()) return false;

  return user.created_at !== new Date(0).toISOString();
}

function userScore(user: TwitterUser): number {
  return (
    user.followers_count * 1_000_000 +
    user.tweet_count * 1_000 +
    user.following_count
  );
}

function enrichProfileExtras(
  resultNode: Record<string, unknown> | null,
  legacy?: Record<string, unknown> | null
): Partial<TwitterUser> {
  if (!resultNode && !legacy) return {};

  const dm = resultNode ? asRecord(resultNode.dm_permissions) : null;
  const locationNode = resultNode ? asRecord(resultNode.location) : null;
  const privacy = resultNode ? asRecord(resultNode.privacy) : null;
  const professional = resultNode ? asRecord(resultNode.professional) : null;
  const verification = resultNode ? asRecord(resultNode.verification) : null;
  const banner = resultNode ? asRecord(resultNode.banner) : null;
  const website = resultNode ? asRecord(resultNode.website) : null;
  const properties = resultNode ? asRecord(resultNode.properties) : null;
  const profileBio = resultNode ? asRecord(resultNode.profile_bio) : null;
  const bioEntities = profileBio ? asRecord(profileBio.entities) : null;
  const bioUrlBlock = bioEntities ? asRecord(bioEntities.url) : null;
  const bioUrls = Array.isArray(bioUrlBlock?.urls) ? bioUrlBlock.urls : [];
  const firstBioUrl = bioUrls.length ? asRecord(bioUrls[0]) : null;

  const categoriesRaw = Array.isArray(professional?.category) ? professional.category : [];
  const professional_categories = categoriesRaw
    .map((c) => pickString(asRecord(c)?.name))
    .filter(Boolean);

  const legacyEntities = legacy ? asRecord(legacy.entities) : null;
  const legacyUrlBlock = legacyEntities ? asRecord(legacyEntities.url) : null;
  const legacyUrls = Array.isArray(legacyUrlBlock?.urls) ? legacyUrlBlock.urls : [];
  const firstLegacyUrl = legacyUrls.length ? asRecord(legacyUrls[0]) : null;

  const expandedUrl =
    pickString(
      firstBioUrl?.expanded_url,
      firstLegacyUrl?.expanded_url,
      legacy?.url,
      website?.url
    ) || undefined;

  const websiteDisplay =
    pickString(
      firstBioUrl?.display_url,
      firstLegacyUrl?.display_url,
      expandedUrl?.replace(/^https?:\/\//, "")
    ) || undefined;

  const legacyVerified = verification
    ? Boolean(verification.verified)
    : legacy
      ? Boolean(legacy.verified)
      : undefined;

  const out: Partial<TwitterUser> = {};

  const location = pickString(locationNode?.location, legacy?.location);
  if (location) out.location = location;

  if (expandedUrl) out.url = expandedUrl;
  if (websiteDisplay) out.website = websiteDisplay;

  const bannerUrl = pickString(
    banner?.image_url,
    legacy?.profile_banner_url,
    legacy?.profile_banner_url_https
  );
  if (bannerUrl) out.profile_banner_url = bannerUrl;

  const shape = pickString(resultNode?.profile_image_shape);
  if (shape) out.profile_image_shape = shape;

  if (dm && typeof dm.can_dm === "boolean") out.can_dm = dm.can_dm;
  else if (legacy && typeof legacy.can_dm === "boolean") out.can_dm = legacy.can_dm;

  if (privacy && typeof privacy.protected === "boolean") out.protected = privacy.protected;
  else if (legacy && typeof legacy.protected === "boolean") out.protected = legacy.protected;

  if (privacy && typeof privacy.suspended === "boolean") out.suspended = privacy.suspended;

  const verifiedType = pickString(verification?.verified_type, legacy?.verified_type);
  if (verifiedType) out.verified_type = verifiedType;

  if (legacyVerified !== undefined) out.legacy_verified = legacyVerified;

  const professionalType = pickString(professional?.professional_type);
  if (professionalType) out.professional_type = professionalType;
  if (professional_categories.length) out.professional_categories = professional_categories;

  if (properties && typeof properties.has_extended_profile === "boolean") {
    out.has_extended_profile = properties.has_extended_profile;
  } else if (legacy && typeof legacy.has_extended_profile === "boolean") {
    out.has_extended_profile = legacy.has_extended_profile;
  }

  return out;
}

function buildUserFromLegacy(
  legacy: Record<string, unknown>,
  resultNode: Record<string, unknown> | null,
  fallbackUsername?: string
): TwitterUser | null {
  const core = resultNode ? asRecord(resultNode.core) : null;
  const username = pickString(
    legacy.screen_name,
    legacy.screenName,
    legacy.username,
    core?.screen_name,
    core?.screenName,
    fallbackUsername
  ).replace("@", "");

  if (!username) return null;

  const relationshipCounts = resultNode ? asRecord(resultNode.relationship_counts) : null;
  const publicMetrics = resultNode ? asRecord(resultNode.public_metrics) : null;
  const verification = resultNode ? asRecord(resultNode.verification) : null;
  const avatar = resultNode ? asRecord(resultNode.avatar) : null;

  return {
    id: pickString(
      resultNode?.rest_id,
      legacy.id_str,
      legacy.id,
      legacy.user_id,
      `user_${username}`
    ),
    username,
    name: pickString(legacy.name, core?.name, username),
    description: pickString(legacy.description, legacy.bio) || undefined,
    followers_count: pickNumber(
      legacy.followers_count,
      legacy.follower_count,
      relationshipCounts?.followers,
      publicMetrics?.followers_count,
      resultNode?.followers_count
    ),
    following_count: pickNumber(
      legacy.friends_count,
      legacy.following_count,
      relationshipCounts?.following,
      publicMetrics?.following_count,
      resultNode?.following_count
    ),
    tweet_count: pickNumber(
      legacy.statuses_count,
      legacy.tweet_count,
      legacy.media_count,
      publicMetrics?.tweet_count,
      resultNode?.tweet_count
    ),
    profile_image_url:
      pickString(
        legacy.profile_image_url_https,
        legacy.profile_image_url,
        avatar?.image_url
      ) || undefined,
    verified: Boolean(
      verification?.is_blue_verified ||
        legacy.verified ||
        legacy.is_blue_verified ||
        resultNode?.is_blue_verified
    ),
    created_at: pickString(legacy.created_at, core?.created_at) || new Date(0).toISOString(),
    ...enrichProfileExtras(resultNode, legacy),
  };
}

function buildUserFromModernResult(
  resultNode: Record<string, unknown>,
  fallbackUsername?: string,
  wrapperRestId?: string
): TwitterUser | null {
  const core = asRecord(resultNode.core);
  const relationshipCounts = asRecord(resultNode.relationship_counts);
  const tweetCounts = asRecord(resultNode.tweet_counts);
  const verification = asRecord(resultNode.verification);
  const profileBio = asRecord(resultNode.profile_bio);
  const avatar = asRecord(resultNode.avatar);

  const username = pickString(core?.screen_name, core?.screenName, fallbackUsername).replace(
    "@",
    ""
  );
  if (!username) return null;

  return {
    id: pickString(resultNode.rest_id, wrapperRestId, `user_${username}`),
    username,
    name: pickString(core?.name, username),
    description: pickString(profileBio?.description) || undefined,
    followers_count: pickNumber(relationshipCounts?.followers),
    following_count: pickNumber(relationshipCounts?.following),
    tweet_count: pickNumber(tweetCounts?.tweets, tweetCounts?.media_tweets),
    profile_image_url: pickString(avatar?.image_url) || undefined,
    verified: Boolean(verification?.is_blue_verified || verification?.verified),
    created_at: pickString(core?.created_at) || new Date(0).toISOString(),
    ...enrichProfileExtras(resultNode, null),
  };
}

function findProfileResultNode(root: Record<string, unknown>): Record<string, unknown> | null {
  return (
    asRecord(asRecord(asRecord(root.data)?.user_results)?.result) ??
    asRecord(asRecord(asRecord(root.data)?.user)?.result) ??
    asRecord(asRecord(root.user_results)?.result) ??
    asRecord(asRecord(root.user)?.result) ??
    asRecord(root.result) ??
    asRecord(asRecord(root.data)?.user)
  );
}

/** UserResultByScreenName — map Consumer profile 1:1 (legacy or modern user_results shape). */
export function mapConsumerProfilePassthrough(
  raw: unknown,
  fallbackUsername: string
): TwitterUser | null {
  const root = asRecord(raw);
  if (!root) return null;

  const resultNode = findProfileResultNode(root);
  if (!resultNode) return null;

  const userResults =
    asRecord(asRecord(root.data)?.user_results) ?? asRecord(root.user_results);
  const wrapperRestId = pickString(userResults?.rest_id);

  const legacy = asRecord(resultNode.legacy);
  if (legacy) {
    return buildUserFromLegacy(legacy, resultNode, fallbackUsername);
  }

  return buildUserFromModernResult(resultNode, fallbackUsername, wrapperRestId);
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
      const user = buildUserFromLegacy(legacy, resultNode, fallbackUsername);
      if (user && isUsableUser(user)) return user;
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
  let resultForLegacy: Record<string, unknown> | null = null;

  for (const c of candidates) {
    if (asRecord(c.legacy)) {
      legacy = asRecord(c.legacy);
      resultForLegacy = c;
    }
    if (asRecord(c.core)) core = asRecord(c.core);
    if (legacy) break;
    if (c.screen_name || c.screenName || c.username) {
      legacy = c;
      break;
    }
  }

  if (legacy) {
    const user = buildUserFromLegacy(legacy, resultForLegacy, fallbackUsername);
    if (user && isUsableUser(user)) return user;
  }

  const node = candidates[candidates.length - 1];
  if (!node) return null;

  const coreNode = core ?? node;
  const username = pickString(
    node.screen_name,
    node.screenName,
    node.username,
    fallbackUsername
  ).replace("@", "");

  if (!username) return null;

  const followers_count = pickNumber(node.followers_count, node.follower_count);
  const following_count = pickNumber(node.friends_count, node.following_count);
  const tweet_count = pickNumber(node.statuses_count, node.tweet_count, node.media_count);
  const id = pickString(node.id_str, node.rest_id, node.id, node.user_id, `user_${username}`);

  if (
    id === `user_${username}` &&
    followers_count === 0 &&
    following_count === 0 &&
    tweet_count === 0 &&
    !pickString(node.created_at)
  ) {
    return null;
  }

  return {
    id,
    username,
    name: pickString(node.name, coreNode.name, username),
    description: pickString(node.description, node.bio) || undefined,
    followers_count,
    following_count,
    tweet_count,
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
  const acc: { best: TwitterUser | null } = { best: null };
  const expected = username?.replace("@", "").trim().toLowerCase();

  function consider(user: TwitterUser | null) {
    if (!user || !isUsableUser(user)) return;
    if (expected && user.username.toLowerCase() !== expected) return;
    const score = userScore(user);
    if (!acc.best || score > userScore(acc.best)) acc.best = user;
  }

  consider(normalizeUser(raw, username));

  const root = asRecord(raw);
  if (!root) {
    return acc.best && isUsableUser(acc.best) ? acc.best : null;
  }

  const queue: unknown[] = [root];
  while (queue.length) {
    const current = queue.shift();
    const obj = asRecord(current);
    if (!obj) continue;

    consider(normalizeUser(obj, username));

    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") queue.push(value);
    }
  }

  if (!acc.best) return null;
  if (!isUsableUser(acc.best)) return null;

  // Profile lookup should not return a zero-metric shell for the requested handle.
  if (
    expected &&
    acc.best.username.toLowerCase() === expected &&
    acc.best.followers_count === 0 &&
    acc.best.following_count === 0 &&
    acc.best.tweet_count === 0
  ) {
    return null;
  }

  return acc.best;
}
