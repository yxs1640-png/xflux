export type ComparePage = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  competitorName: string;
  rows: { label: string; them: string; us: string }[];
  whenThem: string[];
  whenUs: string[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
};

export const COMPARE_PAGES: ComparePage[] = [
  {
    slug: "x-api",
    title: "XFlux vs Official X API",
    description:
      "Compare XFlux flat plans and account monitors to the official X/Twitter API — when to use each for reads, alerts, streaming, and write access.",
    keywords: [
      "xflux vs x api",
      "twitter api alternative",
      "x api pricing comparison",
      "cheap twitter api vs official",
    ],
    competitorName: "Official X API",
    rows: [
      {
        label: "Access",
        them: "Developer portal, app setup, tier approval varies",
        us: "Instant signup — API key in under a minute",
      },
      {
        label: "Pricing model",
        them: "Pay-per-use and/or high monthly tiers",
        us: "Flat monthly plans (API quota + monitors)",
      },
      {
        label: "Starter cost (directional)",
        them: "Basic/PPU historically $100+/mo class; Pro stream ~$5k/mo",
        us: "Free: 1k calls + 1 monitor. Starter: $19/mo",
      },
      {
        label: "Profiles / timelines / search",
        them: "Yes",
        us: "Yes — REST + MCP",
      },
      {
        label: "Account monitors + webhooks",
        them: "DIY polling or expensive streaming products",
        us: "Built-in monitors; live HMAC webhooks on Starter+",
      },
      {
        label: "Filtered / realtime stream",
        them: "Pro filtered stream often cited ~$5,000/mo",
        us: "Account-level monitors as a practical alternative",
      },
      {
        label: "Post / like / DM (write)",
        them: "Yes (with credentials)",
        us: "No — read & monitor focus",
      },
      {
        label: "MCP for AI agents",
        them: "Community wrappers using your X keys",
        us: "Official package @xflux/xflux-mcp-server",
      },
    ],
    whenThem: [
      "You need write access (post, like, DM) or user-delegated OAuth",
      "You require official enterprise firehose / filtered stream SLAs",
      "Compliance mandates first-party X developer contracts",
    ],
    whenUs: [
      "You only need public reads plus alerts when specific accounts post",
      "You want flat pricing from Free/$19 instead of PPU surprises or $5k stream",
      "You want monitors, signed webhooks, Make.com, MCP, and Signals in one account",
    ],
    faqs: [
      {
        question: "Is XFlux a drop-in replacement for the official X API?",
        answer:
          "No. XFlux covers public reads, account monitors, webhooks, and MCP. Official X remains the path for write APIs and enterprise streaming.",
      },
      {
        question: "Are official prices fixed in this comparison?",
        answer:
          "No — X packaging changes. Verify current rates on docs.x.com. XFlux prices are on /pricing.",
      },
      {
        question: "Do monitors consume REST quota?",
        answer:
          "No. Scheduled monitor polling is separate from /api/v1 call quotas.",
      },
    ],
    relatedLinks: [
      { href: "/docs/compare/pricing", label: "Pricing vs official (docs)" },
      { href: "/pricing", label: "XFlux pricing" },
      { href: "/twitter-webhook", label: "Twitter webhooks" },
      { href: "/mcp", label: "MCP overview" },
      { href: "/blog/x-api-cost-2026", label: "X API cost 2026" },
    ],
  },
  {
    slug: "sorsa",
    title: "XFlux vs Sorsa API",
    description:
      "Sorsa focuses on cheap, high-volume X/Twitter reads with tutorial SEO; XFlux adds flat plans plus account monitors, signed webhooks, MCP, and Signals.",
    keywords: [
      "xflux vs sorsa",
      "sorsa api alternative",
      "sorsa twitter api",
      "twitter api alternative comparison",
    ],
    competitorName: "Sorsa API",
    rows: [
      {
        label: "Primary pitch",
        them: "Cheap public reads / scraper-style REST (volume-oriented)",
        us: "Read API + always-on account monitors + signed webhooks",
      },
      {
        label: "Pricing shape",
        them: "Flat per-request / plan tiers aimed at low $/1k reads — verify on their site",
        us: "Flat monthly Free → Scale with included call quotas + monitor slots",
      },
      {
        label: "Account monitors",
        them: "Not the core product story — usually DIY polling",
        us: "Dashboard monitors with optional keyword filters",
      },
      {
        label: "Signed webhooks",
        them: "Typically not the differentiator",
        us: "HMAC-SHA256 monitor.hit delivery on Starter+",
      },
      {
        label: "AI / MCP",
        them: "Bring your own agent wiring",
        us: "@xflux/xflux-mcp-server for Claude & Cursor",
      },
      {
        label: "Content / discovery",
        them: "Strong language how-to blog (Python/Node/Go)",
        us: "Live Signals digests + Smart Money predictors + docs/blog",
      },
    ],
    whenThem: [
      "You mainly need bulk public reads at the lowest unit cost",
      "You already own polling, alerting, and agent infrastructure",
      "You are evaluating pure lookup APIs and do not need monitors",
    ],
    whenUs: [
      "You need alerts when specific @handles post — without writing a poller",
      "You want predictable Free/$19+ plans covering reads and monitors",
      "You want MCP, Make.com routing, and Signals in the same product",
    ],
    faqs: [
      {
        question: "Who wins on raw $/1k tweet price?",
        answer:
          "Volume-oriented read APIs like Sorsa often advertise very low unit rates. Compare your expected monthly calls against XFlux plan quotas — unit price alone ignores monitor/webhook work.",
      },
      {
        question: "Is XFlux a scraper marketplace?",
        answer:
          "No. XFlux is a self-serve read API with first-class account monitors and signed webhooks on paid plans.",
      },
      {
        question: "Can I use both?",
        answer:
          "Yes. Some teams use a cheap bulk-read API for backfills and XFlux for live monitors, webhooks, and agent MCP access.",
      },
    ],
    relatedLinks: [
      { href: "/pricing", label: "XFlux pricing" },
      { href: "/compare/x-api", label: "vs Official X API" },
      { href: "/twitter-webhook", label: "Webhooks" },
      { href: "/mcp", label: "MCP" },
      { href: "/blog/twitter-api-alternative", label: "API alternatives guide" },
    ],
  },
  {
    slug: "socialdata",
    title: "XFlux vs SocialData",
    description:
      "SocialData offers deep monitor API documentation; XFlux pairs monitors with a Dashboard, Make.com webhooks, MCP, and signal digests.",
    keywords: [
      "xflux vs socialdata",
      "socialdata alternative",
      "twitter monitor api",
      "socialdata vs xflux",
    ],
    competitorName: "SocialData",
    rows: [
      {
        label: "Monitor API docs",
        them: "Strong, developer-oriented monitor API documentation",
        us: "Monitors primarily via Dashboard; read-only list/hits on REST + MCP",
      },
      {
        label: "Product UX",
        them: "API-first workflows",
        us: "Dashboard for monitors/webhooks + REST for lookups",
      },
      {
        label: "Automation",
        them: "Integrate via their APIs",
        us: "Signed webhooks + documented Make.com / Discord patterns",
      },
      {
        label: "Read API",
        them: "Social data endpoints (varies by plan)",
        us: "Profiles, timelines, search, tweet lookup",
      },
      {
        label: "Extras",
        them: "Focus on social data APIs",
        us: "MCP, Smart Money predictors, live Signals digests",
      },
      {
        label: "Pricing shape",
        them: "Their own tiers — verify on their site",
        us: "Flat Free/$19+ with monitors included",
      },
    ],
    whenThem: [
      "You want to drive monitors entirely through a programmatic monitor API",
      "You already standardized on SocialData’s docs and client libs",
      "You only need their specific social-data endpoints",
    ],
    whenUs: [
      "You prefer Dashboard setup plus Make.com for routing alerts",
      "You want Claude/Cursor MCP and Smart Money discovery in-product",
      "You want a single flat plan covering reads and account watches",
    ],
    faqs: [
      {
        question: "Does XFlux expose a full CRUD monitors HTTP API?",
        answer:
          "Monitors are created and configured in the Dashboard. REST exposes read-only list and hits; MCP mirrors that read-only access.",
      },
      {
        question: "Can I still automate alerts?",
        answer:
          "Yes — signed HTTP webhooks on Starter+ to your server or Make.com Custom Webhooks.",
      },
      {
        question: "Is this an affiliate comparison?",
        answer:
          "No. Features change on both sides — verify SocialData’s current docs and pricing on their site.",
      },
    ],
    relatedLinks: [
      { href: "/docs/monitors", label: "Monitors docs" },
      { href: "/docs/integrations/make", label: "Make.com guide" },
      { href: "/signals", label: "Signals" },
      { href: "/predictors", label: "Smart Money" },
      { href: "/mcp", label: "MCP" },
    ],
  },
];

export function getComparePage(slug: string): ComparePage | undefined {
  return COMPARE_PAGES.find((p) => p.slug === slug);
}

export function getAllCompareSlugs(): string[] {
  return COMPARE_PAGES.map((p) => p.slug);
}
