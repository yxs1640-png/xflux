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

  const bySlug: Record<string, string> = {
    ai: `Today's AI conversation clusters around ${themeSummary}. ${top.includes("safety") ? "Safety and shipping are both in the timeline — assume tighter review cycles on agent features." : top.includes("Model") ? "Model releases are driving attention; validate benchmark claims against your own evals before switching providers." : "Lab leaders are setting the narrative — generic hashtag noise is secondary."}`,
    crypto: `Crypto discourse today centers on ${themeSummary}. ${top.includes("Bitcoin") ? "BTC narrative dominates — macro and ETF flows often lead alt moves by hours." : top.includes("On-chain") ? "On-chain alerts are elevated; pair whale trackers with exchange accounts for context." : "Cross-check influencer takes with on-chain data before sizing positions."}`,
    trading: `Market chatter highlights ${themeSummary}. ${top.includes("Macro") ? "Macro headlines may override single-name setups today — watch rates and FX first." : top.includes("Unusual") ? "Unusual flow posts are spiking; confirm with price action before chasing." : "Fin-twitter is mixed — prioritize accounts with a track record on your timeframe."}`,
    startups: `Founder Twitter today focuses on ${themeSummary}. ${top.includes("Product") ? "Launch season energy is up — good window to study GTM patterns from accounts you admire." : top.includes("Fundraising") ? "Fundraising talk is visible; treat public ARR claims as marketing until verified." : "Builder discourse is active — monitor founders in your stack for partnership and API shifts."}`,
  };

  return (
    bySlug[topic.slug] ??
    `Signal clusters around ${themeSummary} across ${authorCount} watched accounts and search.`
  );
}

function buildGuidance(topic: SignalTopicConfig, themes: Array<{ label: string; count: number }>): string[] {
  const tips: string[] = [];
  const handles = topic.watchAccounts.slice(0, 3).map((a) => `@${a}`).join(", ");

  const bySlug: Record<string, string[]> = {
    ai: [
      "Monitor lab leaders before model/API docs update — announcements often hit X first.",
      "Use webhooks on paid plans to pipe high-signal posts into Slack or your agent stack.",
    ],
    crypto: [
      "Set monitors on exchange founders + on-chain accounts you trust — narratives move fast.",
      "Search API works for $TICKER spikes; monitors work for account-level breaking posts.",
    ],
    trading: [
      "Monitor flow accounts and macro voices separately — they lead different time horizons.",
      "Don't poll manually during market hours; 1 monitor per key account scales better.",
    ],
    startups: [
      "Track founders you compete with or sell to — launch posts precede Product Hunt by days.",
      "Free tier includes 1 monitor; start with the account that most affects your roadmap.",
    ],
  };

  tips.push(...(bySlug[topic.slug] ?? []));
  tips.push(`Add monitors for ${handles} — refreshed every 2 min on this page, faster on paid plans.`);
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
