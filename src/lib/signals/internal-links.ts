import type { SignalCategoryId } from "./topic-types";
import { getSignalTopic, type SignalTopicConfig } from "./topics";

/** Homepage featured digests — align with GSC indexing priorities. */
export const POPULAR_SIGNAL_SLUGS = [
  "ai",
  "crypto",
  "trading",
  "startups",
  "twitter-api",
  "webhooks",
  "machine-learning",
  "forex",
] as const;

/** Two representative topics linked from each hub category section. */
export const HUB_CATEGORY_FEATURED_SLUGS: Record<SignalCategoryId, readonly [string, string]> = {
  "ai-tech": ["ai", "ai-agents"],
  crypto: ["crypto", "bitcoin"],
  markets: ["trading", "forex"],
  business: ["startups", "saas"],
  developers: ["javascript", "open-source"],
  security: ["cybersecurity", "cloud-infra"],
  policy: ["geopolitics", "tech-policy"],
  science: ["biotech", "data-science"],
  culture: ["gaming", "design-ux"],
  product: ["twitter-api", "webhooks"],
  niche: ["prompt-engineering", "local-llm"],
};

export const DOCS_RELATED_SIGNALS: Record<string, readonly string[]> = {
  "/docs": ["ai", "startups", "twitter-api"],
  "/docs/quickstart": ["ai", "trading", "crypto"],
  "/docs/api": ["twitter-api", "webhooks", "ai"],
  "/docs/monitors": ["trading", "startups", "account-monitors"],
  "/docs/webhooks": ["webhooks", "twitter-api", "trading"],
  "/docs/limits": ["ai", "startups"],
};

export function resolveSignalTopics(slugs: readonly string[]): SignalTopicConfig[] {
  return slugs
    .map((slug) => getSignalTopic(slug))
    .filter((topic): topic is SignalTopicConfig => Boolean(topic));
}
