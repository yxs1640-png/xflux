import type { SignalBrief, SignalItem } from "./types";

const THEME_RULES: Array<{ label: string; patterns: RegExp[] }> = [
  {
    label: "Agent safety & governance",
    patterns: [/safeguard|incident|investigation|alignment|security|pause.*train/i, /misuse|abuse|policy/i],
  },
  {
    label: "Agent product launches",
    patterns: [/agent|computer use|browser|automate|workflow|tool use/i, /can now (use|sign|book|schedule)/i],
  },
  {
    label: "Model & API releases",
    patterns: [/model|api platform|now live|release|launch|benchmark|multimodal/i, /deepseek|gpt|claude|opus/i],
  },
  {
    label: "Research & training",
    patterns: [/training|rl |reinforcement|frontier|research|paper|arxiv/i],
  },
  {
    label: "Industry & funding",
    patterns: [/billion|million|funding|partnership|foundation|nonprofit/i],
  },
];

function truncate(text: string, max = 140): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

function detectThemes(items: SignalItem[]): Array<{ label: string; count: number }> {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const rule of THEME_RULES) {
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

export function buildAiBrief(items: SignalItem[]): SignalBrief {
  if (items.length === 0) {
    return {
      headline: "No fresh AI signals in the last fetch — monitors may still be catching up.",
      highlights: [],
      synthesis:
        "We poll leading AI accounts and search every few minutes. Check back shortly or set up your own monitors for @sama, @karpathy, and labs you care about.",
      guidance: [
        "Create a free account and add monitors for accounts that move your workflow.",
        "Use the REST API if you need on-demand timeline pulls in your own pipeline.",
      ],
      themes: [],
    };
  }

  const themes = detectThemes(items);
  const leadAuthors = topByAuthor(items, 5);

  const highlights = leadAuthors.map(
    (item) =>
      `@${item.username} posted: "${truncate(item.text)}"`
  );

  const themeSummary =
    themes.length > 0
      ? themes.map((t) => t.label.toLowerCase()).join(", ")
      : "product updates and research chatter";

  const hasSafety = themes.some((t) => t.label.includes("safety"));
  const hasAgents = themes.some((t) => t.label.includes("Agent product"));
  const hasModels = themes.some((t) => t.label.includes("Model"));

  let synthesis = `Across ${leadAuthors.length} watched accounts and live search, today's AI conversation clusters around ${themeSummary}. `;

  if (hasSafety && hasAgents) {
    synthesis +=
      "The juxtaposition is notable: vendors are shipping agent automation while simultaneously tightening safety reviews after real-world incidents — builders should assume stricter guardrails and slower release cycles for high-capability features.";
  } else if (hasAgents) {
    synthesis +=
      "Agent automation is the dominant product narrative — browser/computer use and workflow completion are moving from demos to shipped features, which increases demand for reliable account-level triggers.";
  } else if (hasModels) {
    synthesis +=
      "Model and API releases are driving attention; teams evaluating providers should watch benchmark claims alongside production API availability and rate limits.";
  } else if (hasSafety) {
    synthesis +=
      "Governance and safety messaging is elevated — expect more pauses, audits, and public post-mortems as capabilities accelerate.";
  } else {
    synthesis +=
      "Signal is mixed but active; the fastest-moving posts are coming from lab leaders and platform accounts rather than generic hashtag noise.";
  }

  const guidance: string[] = [];

  if (hasAgents) {
    guidance.push(
      "If you ship agent workflows: monitor @sama, @AnthropicAI, and your dependency vendors — feature announcements often precede API or policy changes by days."
    );
  }
  if (hasModels) {
    guidance.push(
      "Model release days create search and timeline spikes — use monitors + webhooks instead of polling search every minute."
    );
  }
  if (hasSafety) {
    guidance.push(
      "Treat safety incidents as leading indicators: downstream apps may face new usage policies or delayed rollouts."
    );
  }
  guidance.push(
    "Don't refresh manually — add monitors for the @handles above; Free tier includes 1 monitor, paid plans add webhooks."
  );
  guidance.push(
    "Cross-check high-signal posts against your own search queries (e.g. product names, competitors) via the REST API."
  );

  const headline =
    themes[0]?.label != null
      ? `Live AI pulse: ${themes[0].label} leads ${items.length} fresh signals`
      : `${items.length} fresh AI signals from watched accounts and search`;

  return {
    headline,
    highlights,
    synthesis,
    guidance: guidance.slice(0, 4),
    themes,
  };
}
