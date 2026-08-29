import {
  BADGE_CLASS_BY_CATEGORY,
  type SignalThemeRule,
  type SignalTopicConfig,
  type TopicSeed,
} from "./topic-types";

const DEFAULT_THEME_RULES: SignalThemeRule[] = [
  { label: "Breaking & launches", patterns: [/breaking|just|announced|launch|live now|shipped/i] },
  { label: "Analysis & threads", patterns: [/thread|analysis|breakdown|deep dive|here's why/i] },
  { label: "Tools & tutorials", patterns: [/tool|guide|tutorial|how to|open source|free/i] },
  { label: "Community debate", patterns: [/hot take|debate|unpopular|everyone|wrong about/i] },
];

/** SERP title — insert refresh cadence before the subtitle when missing. */
export function enrichSignalPageTitle(pageTitle: string): string {
  if (/updated every|refreshed every|\d+-min update/i.test(pageTitle)) return pageTitle;
  if (pageTitle.includes(" — ")) {
    return pageTitle.replace(" — ", " · Updated every 2 min — ");
  }
  return `${pageTitle} · Updated every 2 min`;
}

/** Meta description — ensure live + refresh cadence for Google snippets. */
export function enrichSignalDescription(description: string): string {
  const trimmed = description.trim().replace(/\s+/g, " ");
  if (/refreshed every|updated every|updates every/i.test(trimmed)) {
    return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
  }

  let body = trimmed.replace(/\.\s*$/, "");
  if (!/\blive\b/i.test(body)) {
    body = `Live X/Twitter digest — ${body.charAt(0).toLowerCase()}${body.slice(1)}`;
  }

  return `${body}. Refreshed every 2 min — see who posted what now.`;
}

export function makeTopic(seed: TopicSeed): SignalTopicConfig {
  const handles = seed.watchAccounts.slice(0, 3).map((a) => `@${a}`).join(", ");
  const pulse = seed.pulseLabel.toLowerCase();

  return {
    slug: seed.slug,
    category: seed.category,
    title: seed.title,
    pageTitle: enrichSignalPageTitle(seed.pageTitle),
    description: enrichSignalDescription(seed.description),
    keywords: seed.keywords,
    intro: seed.intro,
    registerSrc: `signals_${seed.slug.replace(/-/g, "_")}`,
    badgeClass: seed.badgeClass ?? BADGE_CLASS_BY_CATEGORY[seed.category],
    watchAccounts: seed.watchAccounts,
    searchQuery: seed.searchQuery,
    pulseLabel: seed.pulseLabel,
    themeRules: seed.themeRules ?? DEFAULT_THEME_RULES,
    emptyHeadline: `No fresh ${pulse} signals in the last fetch.`,
    emptySynthesis: `Poll ${handles} or set monitors for ${pulse} keywords you care about.`,
    faq: seed.faq ?? [
      {
        question: `Which accounts does the ${seed.title} digest track?`,
        answer: `We poll ${seed.watchAccounts.map((a) => `@${a}`).join(", ")} plus live search — cached up to 2 minutes; use Refresh now for the latest posts.`,
      },
      {
        question: "How do I get alerts when these accounts post?",
        answer:
          "Create a free XFlux account, add a monitor for any public @username, and get Dashboard alerts. Paid plans add signed HTTP webhooks.",
      },
    ],
  };
}
