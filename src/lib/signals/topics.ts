export type SignalThemeRule = {
  label: string;
  patterns: RegExp[];
};

export type SignalFaq = {
  question: string;
  answer: string;
};

export type SignalTopicConfig = {
  slug: string;
  title: string;
  /** Browser tab / SERP title (before | XFlux suffix) */
  pageTitle: string;
  description: string;
  keywords: string[];
  intro: string;
  registerSrc: string;
  badgeClass: string;
  watchAccounts: readonly string[];
  searchQuery: string;
  themeRules: SignalThemeRule[];
  emptyHeadline: string;
  emptySynthesis: string;
  pulseLabel: string;
  faq: SignalFaq[];
};

export const SIGNAL_HUB_KEYWORDS = [
  "Twitter signals",
  "X Twitter monitor",
  "Twitter account alerts",
  "real-time Twitter feed",
  "Twitter API monitor",
  "crypto Twitter alerts",
  "AI Twitter news",
];

export const SIGNAL_TOPICS: SignalTopicConfig[] = [
  {
    slug: "ai",
    title: "AI & LLM",
    pageTitle: "Live AI Signals on X/Twitter — LLM, Agents & Model News",
    description:
      "Free live AI signal digest on X/Twitter: @sama, @karpathy, labs, and search — who posted what, agent & model themes, and accounts to monitor with webhooks.",
    keywords: [
      "AI Twitter signals",
      "LLM news Twitter",
      "monitor @sama",
      "OpenAI Twitter alerts",
      "AI agent news",
      "Twitter API for AI",
      "X account monitor",
    ],
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
    faq: [
      {
        question: "Which AI accounts does this digest track?",
        answer:
          "We poll @sama, @karpathy, @DeepSeekAI, @AnthropicAI, @ylecun, plus live search for AI, LLM, and agent keywords — refreshed every two minutes.",
      },
      {
        question: "How do I get notified when @sama or OpenAI leaders post?",
        answer:
          "Sign up for XFlux free, add a monitor for any public @username, and get Dashboard alerts. Starter plan ($19/mo) adds signed HTTP webhooks.",
      },
    ],
  },
  {
    slug: "crypto",
    title: "Crypto & Bitcoin",
    pageTitle: "Live Crypto Signals on X — BTC, ETH & On-Chain Alerts",
    description:
      "Free live crypto signal digest on X/Twitter: @saylor, @VitalikButerin, on-chain accounts, and $BTC/$ETH search — market themes and monitors for traders.",
    keywords: [
      "crypto Twitter signals",
      "Bitcoin Twitter alerts",
      "monitor @saylor",
      "BTC news Twitter",
      "on-chain Twitter alerts",
      "crypto account monitor",
      "Ethereum Twitter feed",
    ],
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
    faq: [
      {
        question: "Can I monitor Bitcoin and crypto influencers on X?",
        answer:
          "Yes. XFlux monitors any public @username on a schedule and surfaces new tweets in your Dashboard or via webhooks — no manual refresh.",
      },
      {
        question: "Does this page replace a trading bot?",
        answer:
          "No — it summarizes public posts for context. Use monitors + webhooks to pipe high-signal accounts into your own alerting stack.",
      },
    ],
  },
  {
    slug: "trading",
    title: "Trading & Markets",
    pageTitle: "Live Stock Market Signals on X/Twitter — Trading & Macro Pulse",
    description:
      "Free live trading signal digest on X: @unusual_whales, macro voices, and market search — unusual flow, earnings chatter, and accounts to monitor.",
    keywords: [
      "stock market Twitter signals",
      "trading alerts Twitter",
      "unusual whales monitor",
      "fin twitter feed",
      "options flow Twitter",
      "macro Twitter alerts",
      "market monitor X",
    ],
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
    faq: [
      {
        question: "How fast do trading account monitors update?",
        answer:
          "Free plan polls every ~5 minutes. Paid plans poll as fast as 1 second per monitor, with signed webhooks when new tweets are detected.",
      },
      {
        question: "Can I track @unusual_whales and macro accounts together?",
        answer:
          "Yes — add one monitor per @username (Free includes 1 monitor; Starter includes 3). Each fires independently when that account posts.",
      },
    ],
  },
  {
    slug: "startups",
    title: "Startups & Founders",
    pageTitle: "Live Startup Signals on X — Founders, Launches & Indie Hackers",
    description:
      "Free live startup signal digest on X/Twitter: @paulg, @levelsio, founders, and launch search — product ships, fundraising chatter, and monitors to set up.",
    keywords: [
      "startup Twitter signals",
      "founder Twitter monitor",
      "indie hacker alerts",
      "product launch Twitter",
      "YC Twitter feed",
      "build in public monitor",
      "startup account alerts",
    ],
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
    faq: [
      {
        question: "Why monitor founders instead of scrolling X?",
        answer:
          "Monitors run on a schedule and capture posts you would miss — useful for launch timing, competitor moves, and partnership hints from key accounts.",
      },
      {
        question: "Is this useful for indie hackers?",
        answer:
          "Yes. Many indie builders monitor @levelsio, @paulg, and niche founders to catch launches and GTM patterns early.",
      },
    ],
  },
];

const TOPIC_BY_SLUG = Object.fromEntries(SIGNAL_TOPICS.map((t) => [t.slug, t]));

export function getSignalTopic(slug: string): SignalTopicConfig | undefined {
  return TOPIC_BY_SLUG[slug];
}

export function getAllSignalSlugs(): string[] {
  return SIGNAL_TOPICS.map((t) => t.slug);
}
