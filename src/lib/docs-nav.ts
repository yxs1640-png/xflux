export interface DocNavItem {
  titleKey: string;
  href: string;
  descriptionKey?: string;
}

export interface DocNavSection {
  titleKey: string;
  items: DocNavItem[];
}

export const DOC_NAV_SECTIONS: DocNavSection[] = [
  {
    titleKey: "start",
    items: [
      { titleKey: "introduction", href: "/docs" },
      { titleKey: "quickstart", href: "/docs/quickstart" },
      { titleKey: "authentication", href: "/docs/authentication" },
    ],
  },
  {
    titleKey: "api",
    items: [
      { titleKey: "apiReference", href: "/docs/api" },
      { titleKey: "errors", href: "/docs/errors" },
      { titleKey: "searchOperators", href: "/docs/guides/search" },
      { titleKey: "plansLimits", href: "/docs/limits" },
    ],
  },
  {
    titleKey: "monitors",
    items: [
      { titleKey: "monitorsItem", href: "/docs/monitors" },
      { titleKey: "webhooks", href: "/docs/webhooks" },
      { titleKey: "tradingKeywords", href: "/docs/guides/trading-keywords" },
    ],
  },
  {
    titleKey: "integrations",
    items: [
      { titleKey: "make", href: "/docs/integrations/make" },
      { titleKey: "mcp", href: "/docs/integrations/mcp" },
    ],
  },
  {
    titleKey: "useCases",
    items: [
      { titleKey: "overview", href: "/use-cases" },
      { titleKey: "tradingAlerts", href: "/use-cases/trading-alerts" },
      { titleKey: "aiResearch", href: "/use-cases/ai-research" },
      { titleKey: "cryptoAlerts", href: "/use-cases/crypto-alerts" },
      { titleKey: "smartMoney", href: "/predictors" },
    ],
  },
  {
    titleKey: "compare",
    items: [{ titleKey: "pricingVsOfficial", href: "/docs/compare/pricing" }],
  },
  {
    titleKey: "help",
    items: [{ titleKey: "faq", href: "/docs/faq" }],
  },
];

/** Flat list for search / sitemap helpers */
export const DOC_NAV: DocNavItem[] = DOC_NAV_SECTIONS.flatMap((section) => section.items);

import { LEGAL } from "./legal-config";

export const DOC_BASE_URL = `${LEGAL.website}/api/v1`;
