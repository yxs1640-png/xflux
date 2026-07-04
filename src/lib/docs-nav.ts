export interface DocNavItem {
  title: string;
  href: string;
  description?: string;
}

export const DOC_NAV: DocNavItem[] = [
  { title: "Introduction", href: "/docs", description: "What is XFlux" },
  { title: "Quickstart", href: "/docs/quickstart", description: "Get your first API call in 5 minutes" },
  { title: "API Reference", href: "/docs/api", description: "REST endpoints" },
  { title: "Monitors", href: "/docs/monitors", description: "Track KOL tweets automatically" },
  { title: "Webhooks", href: "/docs/webhooks", description: "Receive real-time push notifications" },
  { title: "Plans & Limits", href: "/docs/limits", description: "Quotas, intervals, and errors" },
];

export const DOC_BASE_URL = "https://your-domain.vercel.app/api/v1";
