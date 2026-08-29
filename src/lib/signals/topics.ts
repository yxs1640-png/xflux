import { SIGNAL_TOPIC_CATALOG } from "./topic-catalog";
import type { SignalCategory, SignalCategoryId, SignalTopicConfig } from "./topic-types";
import { SIGNAL_CATEGORIES } from "./topic-types";

export type {
  SignalCategory,
  SignalCategoryId,
  SignalFaq,
  SignalThemeRule,
  SignalTopicConfig,
} from "./topic-types";

export { SIGNAL_CATEGORIES };

export const SIGNAL_HUB_KEYWORDS = [
  "Twitter signals",
  "X Twitter monitor",
  "Twitter account alerts",
  "real-time Twitter feed",
  "Twitter API monitor",
  "crypto Twitter alerts",
  "AI Twitter news",
  "stock market Twitter",
  "startup Twitter monitor",
  "webhook Twitter integration",
  "social listening X",
  "Twitter webhook alerts",
  "niche Twitter monitor",
  "long tail social alerts",
  "Obsidian Twitter feed",
  "homelab X alerts",
  "bug bounty Twitter",
];

export const SIGNAL_TOPICS: SignalTopicConfig[] = SIGNAL_TOPIC_CATALOG;

const TOPIC_BY_SLUG = Object.fromEntries(SIGNAL_TOPICS.map((t) => [t.slug, t]));

export function getSignalTopic(slug: string): SignalTopicConfig | undefined {
  return TOPIC_BY_SLUG[slug];
}

export function getAllSignalSlugs(): string[] {
  return SIGNAL_TOPICS.map((t) => t.slug);
}

export function getTopicsByCategory(categoryId: SignalCategoryId): SignalTopicConfig[] {
  return SIGNAL_TOPICS.filter((t) => t.category === categoryId);
}

export function getSignalTopicCount(): number {
  return SIGNAL_TOPICS.length;
}

export function getSignalCategoryLabel(categoryId: SignalCategoryId): string {
  return SIGNAL_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}

export function getRelatedSignalTopics(
  topic: SignalTopicConfig,
  limit = 5
): SignalTopicConfig[] {
  return SIGNAL_TOPICS.filter(
    (t) => t.category === topic.category && t.slug !== topic.slug
  ).slice(0, limit);
}
