export interface DocNavItem {
  title: string;
  href: string;
  description?: string;
}

export const DOC_NAV: DocNavItem[] = [
  { title: "Introduction", href: "/docs", description: "What is XFlux" },
  { title: "Quickstart", href: "/docs/quickstart", description: "Get your first API call in 5 minutes" },
  { title: "API Reference", href: "/docs/api", description: "REST endpoints" },
  { title: "Monitors", href: "/docs/monitors", description: "Poll accounts and record new tweets" },
  { title: "Webhooks", href: "/docs/webhooks", description: "Signed POST callbacks on monitor hits" },
  { title: "Make.com integration", href: "/docs/integrations/make", description: "Twitter webhooks → Make automation" },
  { title: "Trading keyword templates", href: "/docs/guides/trading-keywords", description: "Copy-paste monitor filters for macro & flow" },
  { title: "MCP server", href: "/docs/integrations/mcp", description: "Use XFlux from Claude Desktop & Cursor" },
  { title: "Plans & Limits", href: "/docs/limits", description: "Quotas, intervals, and errors" },
];

import { LEGAL } from "./legal-config";

export const DOC_BASE_URL = `${LEGAL.website}/api/v1`;
