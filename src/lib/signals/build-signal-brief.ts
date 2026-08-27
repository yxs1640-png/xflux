import type { SignalTopicConfig } from "./topics";
import type { SignalBrief, SignalItem } from "./types";

function truncate(text: string, max = 140): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

function detectThemes(
  items: SignalItem[],
  rules: SignalTopicConfig["themeRules"]
): Array<{ label: string; count: number }> {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const rule of rules) {
      if (rule.patterns.some((p) => p.test(item.text))) {
        counts.set(rule.label, (counts.get(rule.label) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

function topByAuthor(items: SignalItem[], limit = 5): SignalItem[] {
  const picked: SignalItem[] = [];
  const seenAuthors = new Set<string>();

  for (const item of items) {
    if (seenAuthors.has(item.username)) continue;
    seenAuthors.add(item.username);
    picked.push(item);
    if (picked.length >= limit) break;
  }

  return picked;
}

function buildSynthesis(
  topic: SignalTopicConfig,
  themes: Array<{ label: string; count: number }>,
  authorCount: number
): string {
  if (themes.length === 0) {
    return `Across ${authorCount} watched accounts and live search, ${topic.pulseLabel.toLowerCase()} chatter is active but diffuse — focus monitors on the specific @handles that move your book or product.`;
  }

  const themeSummary = themes.map((t) => t.label.toLowerCase()).join(", ");
  const top = themes[0]?.label ?? "";

  const byCategory: Record<string, string> = {
    "ai-tech": `Today's ${topic.pulseLabel} conversation clusters around ${themeSummary}. Lab and builder accounts are setting the narrative — validate claims against your own stack before switching tools.`,
    crypto: `Crypto discourse today centers on ${themeSummary}. ${top.includes("Bitcoin") ? "BTC narrative dominates — macro and ETF flows often lead alt moves." : "Cross-check influencer takes with on-chain data before sizing positions."}`,
    markets: `Market chatter highlights ${themeSummary}. ${top.includes("Macro") ? "Macro headlines may override single-name setups today." : "Fin-twitter is mixed — prioritize accounts with a track record on your timeframe."}`,
    business: `Founder and operator Twitter focuses on ${themeSummary}. ${top.includes("Product") || top.includes("launch") ? "Launch energy is up — study GTM patterns from accounts you admire." : "Builder discourse is active — monitor founders in your niche for partnership signals."}`,
    developers: `Dev community chatter centers on ${themeSummary}. Framework maintainers often post breaking changes on X before docs update — monitors beat manual refresh.`,
    security: `Security discourse highlights ${themeSummary}. ${top.includes("Breaches") || top.includes("CVE") ? "Active incident window — widen monitors to vendors and threat intel accounts you trust." : "Defensive patterns and tooling shifts are visible in the timeline."}`,
    policy: `Policy and news chatter focuses on ${themeSummary}. Headline risk can move markets and product roadmaps — track primary sources, not only commentators.`,
    science: `Research and science discourse clusters around ${themeSummary}. Primary sources and preprints often surface on X before mainstream coverage.`,
    culture: `${topic.pulseLabel} conversation today highlights ${themeSummary}. Creator and media accounts drive discovery cycles faster than aggregators.`,
    product: `Integration and API discourse centers on ${themeSummary}. Developer-facing announcements on X often precede official docs — monitors help you ship faster.`,
    niche: `${topic.pulseLabel} niche chatter clusters around ${themeSummary}. Smaller communities move fast on X — a focused monitor beats scrolling broad hashtags.`,
  };

  return (
    byCategory[topic.category] ??
    `Signal clusters around ${themeSummary} across ${authorCount} watched accounts and search.`
  );
}

function buildGuidance(topic: SignalTopicConfig, themes: Array<{ label: string; count: number }>): string[] {
  const tips: string[] = [];
  const handles = topic.watchAccounts.slice(0, 3).map((a) => `@${a}`).join(", ");

  const byCategory: Record<string, string[]> = {
    "ai-tech": [
      "Monitor lab leaders before model/API docs update — announcements often hit X first.",
      "Use webhooks on paid plans to pipe high-signal posts into Slack or your agent stack.",
    ],
    crypto: [
      "Set monitors on exchange founders + on-chain accounts you trust — narratives move fast.",
      "Search API works for $TICKER spikes; monitors work for account-level breaking posts.",
    ],
    markets: [
      "Monitor flow accounts and macro voices separately — they lead different time horizons.",
      "Don't poll manually during market hours; 1 monitor per key account scales better.",
    ],
    business: [
      "Track founders you compete with or sell to — launch posts precede public launches by days.",
      "Free tier includes 1 monitor; start with the account that most affects your roadmap.",
    ],
    developers: [
      "Follow maintainers of frameworks you ship on — breaking changes surface on X first.",
      "Pair digest browsing with monitors on 1–2 accounts you cannot afford to miss.",
    ],
    security: [
      "Monitor CERT accounts, vendors you run, and researchers you trust for early CVE signal.",
      "Webhook alerts help during active incident windows when you are not watching X.",
    ],
    policy: [
      "Track primary wire accounts and policymakers — commentary lags official statements.",
      "Regulatory headlines can affect compliance roadmaps; widen monitors beyond influencers.",
    ],
    science: [
      "Researchers and journals post preprints and trial readouts on X before press coverage.",
      "Monitor a small set of primary sources rather than broad hashtag noise.",
    ],
    culture: [
      "Beat reporters and official league accounts break news before aggregators repost.",
      "Monitors help during live events when timelines move too fast to scroll.",
    ],
    product: [
      "API and webhook changes are often announced on X before docs catch up.",
      "XFlux monitors any public @username — start with the dev account that ships your integration.",
    ],
    niche: [
      "Niche communities reward specific @handle monitors over generic keyword search.",
      "Start with 1–2 accounts that define your sub-niche — free tier includes 1 monitor.",
    ],
  };

  tips.push(...(byCategory[topic.category] ?? []));
  tips.push(`Add monitors for ${handles} — use Refresh now for latest posts; paid plans poll faster with alerts.`);
  tips.push("Register free — 1,000 API calls/mo plus Dashboard hit history.");

  if (themes.some((t) => t.label.toLowerCase().includes("regulation"))) {
    tips.unshift("Regulatory headlines: widen monitors to policy accounts, not just price influencers.");
  }

  return tips.slice(0, 4);
}

export function buildSignalBrief(items: SignalItem[], topic: SignalTopicConfig): SignalBrief {
  if (items.length === 0) {
    return {
      headline: topic.emptyHeadline,
      highlights: [],
      synthesis: topic.emptySynthesis,
      guidance: [
        "Create a free account and add a monitor for the account that moves your workflow.",
        "Use the REST API for on-demand pulls; monitors for always-on alerts.",
      ],
      themes: [],
    };
  }

  const themes = detectThemes(items, topic.themeRules);
  const leadAuthors = topByAuthor(items, 5);
  const highlights = leadAuthors.map(
    (item) => `@${item.username} posted: "${truncate(item.text)}"`
  );

  const headline =
    themes[0] != null
      ? `Live ${topic.pulseLabel} pulse: ${themes[0].label} leads ${items.length} fresh signals`
      : `${items.length} fresh ${topic.pulseLabel.toLowerCase()} signals from watched accounts and search`;

  return {
    headline,
    highlights,
    synthesis: buildSynthesis(topic, themes, leadAuthors.length),
    guidance: buildGuidance(topic, themes),
    themes,
  };
}
