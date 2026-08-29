import type { CustomSignal, CommunitySignalTopic } from "@prisma/client";
import { makeTopic } from "@/lib/signals/make-topic";
import type { SignalCategoryId, SignalTopicConfig } from "@/lib/signals/topics";

function normalizeAccounts(accounts: string[]): string[] {
  return accounts
    .map((a) => a.replace(/^@/, "").trim())
    .filter(Boolean);
}

export function topicConfigFromCustomSignal(signal: CustomSignal): SignalTopicConfig {
  const accounts = normalizeAccounts(signal.watchAccounts);
  const slug = `custom-${signal.id}`;
  const searchQuery =
    signal.searchQuery?.trim() ||
    buildSearchQueryFromAccounts(accounts);

  return makeTopic({
    slug,
    category: "niche",
    title: signal.name,
    pageTitle: `${signal.name} — Custom X/Twitter Signal Digest`,
    description: `Live custom signal digest tracking ${accounts.map((a) => `@${a}`).join(", ")} on X/Twitter.`,
    keywords: [signal.name, "custom Twitter signals", "XFlux signal board"],
    intro: `Your private board tracking ${accounts.length} account${accounts.length === 1 ? "" : "s"}${signal.searchQuery ? " plus live search" : ""}.`,
    watchAccounts: accounts,
    searchQuery,
    pulseLabel: signal.name.slice(0, 24),
  });
}

export function topicConfigFromCommunity(row: CommunitySignalTopic): SignalTopicConfig {
  const accounts = normalizeAccounts(row.watchAccounts as string[]);
  const category = row.category as SignalCategoryId;
  const keywords = Array.isArray(row.keywords) ? (row.keywords as string[]) : [];

  return makeTopic({
    slug: row.slug,
    category,
    title: row.title,
    pageTitle: row.pageTitle,
    description: row.description,
    keywords,
    intro: row.intro,
    watchAccounts: accounts,
    searchQuery: row.searchQuery,
    pulseLabel: row.pulseLabel,
  });
}

export function buildSearchQueryFromAccounts(accounts: string[], extra?: string): string {
  const normalized = normalizeAccounts(accounts);
  if (normalized.length === 0 && !extra?.trim()) {
    return "lang:en -filter:replies";
  }
  const fromClause =
    normalized.length > 0
      ? `(${normalized.map((a) => `from:${a}`).join(" OR ")})`
      : "";
  const extraClause = extra?.trim() ? `(${extra.trim()})` : "";
  const parts = [fromClause, extraClause, "lang:en -filter:replies"].filter(Boolean);
  return parts.join(" ");
}

export function parseAccountList(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(/[\n,]+/)
        .map((a) => a.replace(/^@/, "").trim())
        .filter(Boolean)
    ),
  ];
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
