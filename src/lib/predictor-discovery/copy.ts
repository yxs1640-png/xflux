/**
 * User-facing copy for /predictors (Smart Money).
 * Routes and code keep "predictor" internally; labels here are what people see.
 */

export const SMART_MONEY = {
  /** Short nav / sidebar label */
  nav: "Smart Money",

  /** Public hub badge */
  badge: "Smart Money",

  /** Page H1 on /predictors */
  headline: "Who to watch on X before the market moves",

  /** One-line value prop */
  subhead:
    "We find public accounts that regularly make forward-looking macro, trading, crypto, and geopolitics calls on X — rank them by activity, surface recent calls, and let you monitor any @handle with webhooks.",

  /** SEO title (browser tab) — keeps some search terms */
  seoTitle: "Smart Money on X — Accounts Worth Monitoring",

  seoDescription:
    "Discover X/Twitter accounts that post market-moving calls before catalysts hit. Ranked by activity with recent calls extracted — one-click monitor + webhook alerts via XFlux.",

  /** Dashboard H1 */
  dashboardTitle: "Smart Money",

  dashboardIntro:
    "X accounts that post forward-looking market calls — ranked by how actively they call macro, flow, crypto, and geopolitics. Pick anyone and add a Monitor for webhook alerts.",

  /** Leaderboard */
  table: {
    account: "Account",
    topic: "Topic",
    activity: "Activity",
    trackRecord: "Track record",
    calls14d: "Calls (14d)",
    latestCall: "Latest call",
  },

  activityHint: "How often they make extractable calls lately",
  trackRecordHint: "Right vs wrong when the author later confirms (≥3 resolved)",

  empty:
    "No accounts indexed yet. We scan macro and trading voices on X once per day — check back soon.",

  emptyAdminHint: "Admins can run a scan now from the button above.",

  /** Profile page */
  profileCallsHeading: "Recent calls (last 14 days)",

  stats: {
    activity: "Activity",
    trackRecord: "Track record",
    totalCalls: "Calls",
    hitsMisses: "Right / Wrong",
  },

  monitorCta: (username: string) => `Monitor @${username}`,

  /** Niche hub */
  allLink: "← All Smart Money accounts",
  nicheTitle: (label: string) => `${label} voices to watch`,

  /** Disclaimer */
  disclaimer:
    "Not financial advice. Calls are detected automatically from public tweets; track record uses the author's own follow-up language, not market prices. Always verify before trading.",

  /** Admin */
  adminRefresh: "Refresh rankings (admin)",
  adminDone: (accounts: number, calls: number) =>
    `Updated ${accounts} accounts, ${calls} new calls indexed.`,
} as const;
