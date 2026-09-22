export interface DocNavItem {
  title: string;
  href: string;
  description?: string;
}

export interface DocNavSection {
  title: string;
  items: DocNavItem[];
}

export const DOC_NAV_SECTIONS: DocNavSection[] = [
  {
    title: "Start",
    items: [
      { title: "Introduction", href: "/docs", description: "What is XFlux" },
      { title: "Quickstart", href: "/docs/quickstart", description: "Get your first API call in 5 minutes" },
      { title: "Authentication", href: "/docs/authentication", description: "API keys and request headers" },
    ],
  },
  {
    title: "API",
    items: [
      { title: "API Reference", href: "/docs/api", description: "REST endpoints" },
      { title: "Errors", href: "/docs/errors", description: "Error codes and HTTP status" },
      { title: "Search operators", href: "/docs/guides/search", description: "from:, lang:, quotes, and examples" },
      { title: "Plans & Limits", href: "/docs/limits", description: "Quotas, intervals, and rate limits" },
    ],
  },
  {
    title: "Monitors",
    items: [
      { title: "Monitors", href: "/docs/monitors", description: "Poll accounts and record new tweets" },
      { title: "Webhooks", href: "/docs/webhooks", description: "Signed POST callbacks on monitor hits" },
      {
        title: "Trading keyword templates",
        href: "/docs/guides/trading-keywords",
        description: "Copy-paste monitor filters for macro & flow",
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "Make.com integration", href: "/docs/integrations/make", description: "Twitter webhooks → Make automation" },
      { title: "MCP server", href: "/docs/integrations/mcp", description: "Use XFlux from Claude Desktop & Cursor" },
    ],
  },
  {
    title: "Use cases",
    items: [
      { title: "Overview", href: "/use-cases", description: "Jobs XFlux is built for" },
      { title: "Trading alerts", href: "/use-cases/trading-alerts", description: "Macro & flow monitors" },
      { title: "AI research", href: "/use-cases/ai-research", description: "Lab timelines, RAG, MCP" },
      { title: "Crypto alerts", href: "/use-cases/crypto-alerts", description: "KOL & memecoin monitors" },
      { title: "Smart Money", href: "/predictors", description: "X accounts ranked by market calls" },
    ],
  },
  {
    title: "Compare",
    items: [
      {
        title: "Pricing vs official X API",
        href: "/docs/compare/pricing",
        description: "Cost, access, monitors, and when to use which",
      },
    ],
  },
  {
    title: "Help",
    items: [{ title: "FAQ", href: "/docs/faq", description: "Common questions" }],
  },
];

/** Flat list for search / sitemap helpers */
export const DOC_NAV: DocNavItem[] = DOC_NAV_SECTIONS.flatMap((section) => section.items);

import { LEGAL } from "./legal-config";

export const DOC_BASE_URL = `${LEGAL.website}/api/v1`;
