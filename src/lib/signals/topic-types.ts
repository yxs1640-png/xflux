export type SignalThemeRule = {
  label: string;
  patterns: RegExp[];
};

export type SignalFaq = {
  question: string;
  answer: string;
};

export type SignalCategoryId =
  | "ai-tech"
  | "crypto"
  | "markets"
  | "business"
  | "developers"
  | "security"
  | "policy"
  | "science"
  | "culture"
  | "product"
  | "niche";

export type SignalTopicConfig = {
  slug: string;
  category: SignalCategoryId;
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

export type SignalCategory = {
  id: SignalCategoryId;
  label: string;
  description: string;
};

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  {
    id: "ai-tech",
    label: "AI & Technology",
    description: "Models, agents, dev tools, and tech industry voices.",
  },
  {
    id: "crypto",
    label: "Crypto & Web3",
    description: "Bitcoin, Ethereum, DeFi, chains, and on-chain narratives.",
  },
  {
    id: "markets",
    label: "Markets & Finance",
    description: "Stocks, macro, forex, commodities, and fintech.",
  },
  {
    id: "business",
    label: "Startups & Business",
    description: "Founders, SaaS, growth, VC, and indie builders.",
  },
  {
    id: "developers",
    label: "Developers",
    description: "Languages, frameworks, open source, and DevRel.",
  },
  {
    id: "security",
    label: "Security & Infra",
    description: "Cybersecurity, cloud, SRE, and platform engineering.",
  },
  {
    id: "policy",
    label: "Policy & News",
    description: "Geopolitics, regulation, and tech policy debates.",
  },
  {
    id: "science",
    label: "Science & Health",
    description: "Research, biotech, climate, and data science.",
  },
  {
    id: "culture",
    label: "Culture & Lifestyle",
    description: "Gaming, sports, design, productivity, and media.",
  },
  {
    id: "product",
    label: "XFlux & API",
    description: "Twitter/X API, webhooks, and account monitoring use cases.",
  },
  {
    id: "niche",
    label: "Niche & Verticals",
    description: "Long-tail industries, subcultures, and specialist builder communities.",
  },
];

export const BADGE_CLASS_BY_CATEGORY: Record<SignalCategoryId, string> = {
  "ai-tech": "border-violet-500/30 bg-violet-500/10 text-violet-300",
  crypto: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  markets: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  business: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  developers: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  security: "border-red-500/30 bg-red-500/10 text-red-300",
  policy: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  science: "border-lime-500/30 bg-lime-500/10 text-lime-300",
  culture: "border-pink-500/30 bg-pink-500/10 text-pink-300",
  product: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  niche: "border-teal-500/30 bg-teal-500/10 text-teal-300",
};

export type TopicSeed = {
  slug: string;
  category: SignalCategoryId;
  title: string;
  pageTitle: string;
  description: string;
  keywords: string[];
  intro: string;
  watchAccounts: readonly string[];
  searchQuery: string;
  pulseLabel: string;
  themeRules?: SignalThemeRule[];
  faq?: SignalFaq[];
  badgeClass?: string;
};
