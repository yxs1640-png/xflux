export type SignalThemeRule = {
  label: string;
  patterns: RegExp[];
};

export type SignalTopicConfig = {
  slug: string;
  title: string;
  pageTitle: string;
  description: string;
  intro: string;
  registerSrc: string;
  badgeClass: string;
  watchAccounts: readonly string[];
  searchQuery: string;
  themeRules: SignalThemeRule[];
  emptyHeadline: string;
  emptySynthesis: string;
  pulseLabel: string;
};

export const SIGNAL_TOPICS: SignalTopicConfig[] = [
  {
    slug: "ai",
    title: "AI & LLM",
    pageTitle: "Live AI Signals from X/Twitter — Account Updates & Analysis",
    description:
      "Real-time AI and LLM signals from @sama, @karpathy, labs, and live search — who posted what, key themes, and what to monitor next.",
    intro:
      "Who posted what in AI — model releases, agent products, safety news, and research — with themes and monitor suggestions.",
    registerSrc: "signals_ai",
    badgeClass: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    watchAccounts: ["sama", "karpathy", "DeepSeekAI", "AnthropicAI", "ylecun"],
    searchQuery:
      '(AI OR "artificial intelligence" OR LLM OR "ai agents") lang:en -filter:replies',
    pulseLabel: "AI",
    themeRules: [
      {
        label: "Agent safety & governance",
        patterns: [/safeguard|incident|investigation|alignment|security|pause.*train/i],
      },
      {
        label: "Agent product launches",
        patterns: [/agent|computer use|browser|automate|workflow|tool use/i],
      },
      {
        label: "Model & API releases",
        patterns: [/model|api platform|now live|release|launch|benchmark|multimodal/i],
      },
      {
        label: "Research & training",
        patterns: [/training|reinforcement|frontier|research|paper|arxiv/i],
      },
    ],
    emptyHeadline: "No fresh AI signals in the last fetch.",
    emptySynthesis:
      "We poll leading AI accounts every few minutes. Add monitors for @sama, @karpathy, and labs you track.",
  },
  {
    slug: "crypto",
    title: "Crypto & Bitcoin",
    pageTitle: "Live Crypto Signals from X/Twitter — BTC, ETH & Market Pulse",
    description:
      "Real-time crypto signals from key voices and $BTC/$ETH search — who posted what, market themes, and accounts to monitor.",
    intro:
      "Bitcoin, Ethereum, and crypto market chatter from founders, on-chain analysts, and live search — summarized for traders and builders.",
    registerSrc: "signals_crypto",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    watchAccounts: ["saylor", "VitalikButerin", "cz_binance", "lookonchain", "coinbase"],
    searchQuery: "($BTC OR $ETH OR bitcoin OR crypto) lang:en -filter:replies",
    pulseLabel: "Crypto",
    themeRules: [
      {
        label: "Bitcoin & macro",
        patterns: [/\$BTC|bitcoin|satoshi|halving|ETF|microstrategy/i],
      },
      {
        label: "Ethereum & L2",
        patterns: [/\$ETH|ethereum|layer 2|L2|rollup|vitalik/i],
      },
      {
        label: "Exchange & regulation",
        patterns: [/SEC|regulation|exchange|binance|coinbase|compliance/i],
      },
      {
        label: "On-chain & flows",
        patterns: [/whale|inflow|outflow|on-chain|liquidation|funding rate/i],
      },
    ],
    emptyHeadline: "No fresh crypto signals in the last fetch.",
    emptySynthesis:
      "Poll @saylor, @VitalikButerin, on-chain accounts, or set search monitors for $BTC and $ETH narratives.",
  },
  {
    slug: "trading",
    title: "Trading & Markets",
    pageTitle: "Live Trading Signals from X/Twitter — Stocks & Market Movers",
    description:
      "Real-time trading and stock market signals from fin-twitter — unusual activity, macro takes, and who to monitor.",
    intro:
      "Market-moving posts from traders, macro accounts, and live search — themes, context, and monitor ideas for active investors.",
    registerSrc: "signals_trading",
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    watchAccounts: ["unusual_whales", "zerohedge", "PelosiTracker_", "DeItaone", "elerianm"],
    searchQuery: "(stocks OR trading OR market OR $SPY) lang:en -filter:replies",
    pulseLabel: "Markets",
    themeRules: [
      {
        label: "Macro & rates",
        patterns: [/fed|rate|inflation|GDP|jobs|treasury|yield/i],
      },
      {
        label: "Unusual options flow",
        patterns: [/option|call|put|flow|whale|OI|open interest/i],
      },
      {
        label: "Earnings & equities",
        patterns: [/earnings|EPS|guidance|\$[A-Z]{2,5}|stock|shares/i],
      },
      {
        label: "Geopolitics & risk",
        patterns: [/war|sanction|tariff|china|oil|risk-off|rally/i],
      },
    ],
    emptyHeadline: "No fresh market signals in the last fetch.",
    emptySynthesis:
      "Monitor @unusual_whales, macro voices, or tickers you trade — webhooks fire within your plan poll interval.",
  },
  {
    slug: "startups",
    title: "Startups & Founders",
    pageTitle: "Live Startup Signals from X/Twitter — Founders & Product Launches",
    description:
      "Real-time startup and founder signals from YC-adjacent voices — launches, fundraising chatter, and builders to watch.",
    intro:
      "Founder posts, product launches, and startup discourse — who said what, what's trending, and which accounts indie hackers monitor.",
    registerSrc: "signals_startups",
    badgeClass: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    watchAccounts: ["paulg", "Jason", "naval", "sama", "levelsio"],
    searchQuery: '(startup OR founder OR "product launch" OR indie) lang:en -filter:replies',
    pulseLabel: "Startups",
    themeRules: [
      {
        label: "Product launches",
        patterns: [/launch|shipped|live on|just released|beta|waitlist/i],
      },
      {
        label: "Fundraising & growth",
        patterns: [/raised|seed|series|ARR|MRR|revenue|valuation/i],
      },
      {
        label: "Founder advice",
        patterns: [/founder|startup|build in public|lessons|mistake/i],
      },
      {
        label: "AI x startups",
        patterns: [/AI|LLM|agent|SaaS|API|automation/i],
      },
    ],
    emptyHeadline: "No fresh startup signals in the last fetch.",
    emptySynthesis:
      "Track @paulg, @levelsio, and founders in your niche — get Dashboard hits when they post.",
  },
];

const TOPIC_BY_SLUG = Object.fromEntries(SIGNAL_TOPICS.map((t) => [t.slug, t]));

export function getSignalTopic(slug: string): SignalTopicConfig | undefined {
  return TOPIC_BY_SLUG[slug];
}

export function getAllSignalSlugs(): string[] {
  return SIGNAL_TOPICS.map((t) => t.slug);
}
