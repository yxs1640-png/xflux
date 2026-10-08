import type { BlogPost } from "./posts";

/** Wave E — expand beyond cornerstone SEO posts (2026-09-28). */
export const BLOG_POSTS_WAVE_E: BlogPost[] = [
  {
    slug: "twitter-api-search-operators",
    title: "X/Twitter Search Operators for APIs (from:, since:, lang:)",
    description:
      "Use X advanced search operators with a read API — from:user, since:, until:, lang:, filter:replies — plus XFlux /api/v1/search examples.",
    datePublished: "2026-09-28",
    keywords: [
      "twitter search operators",
      "twitter api search from",
      "x api search query",
      "twitter advanced search api",
      "xflux search",
    ],
    sections: [
      {
        heading: "Why operators beat keyword soup",
        paragraphs: [
          "A bare keyword like “CPI” returns noise: memes, replies, and unrelated brands. Operators narrow the query the same way X’s advanced search UI does — but through an API so you can automate it.",
          "XFlux search accepts the query string in q. You do not need the official X API approval path to run these reads. Docs: /docs/guides/search.",
        ],
      },
      {
        heading: "Operators that matter for monitoring",
        paragraphs: [
          "from:username — only posts by that account (no @ required in most clients). Useful when you already know who to watch but want a one-shot pull instead of a monitor.",
          "since:YYYY-MM-DD and until:YYYY-MM-DD — bound the window. Keep windows short when exploring; wide ranges burn quota and return stale noise.",
          "lang:en (or other ISO codes) — cut cross-language spam. filter:replies / -filter:replies — include or exclude reply threads. min_faves / min_retweets — engagement floors when you care about reach, not volume.",
          "Combine carefully: from:FederalReserve lang:en since:2026-09-01 is usually better than stuffing five unrelated keywords.",
        ],
      },
      {
        heading: "Example with XFlux",
        paragraphs: [
          "Bearer auth against https://www.xfluxapi.com/api/v1/search. URL-encode the query.",
        ],
        code: `curl -G "https://www.xfluxapi.com/api/v1/search" \\
  -H "Authorization: Bearer xflux_YOUR_KEY" \\
  --data-urlencode "q=from:FederalReserve lang:en" \\
  --data-urlencode "limit=10"

# Python
import os, requests
r = requests.get(
    "https://www.xfluxapi.com/api/v1/search",
    headers={"Authorization": f"Bearer {os.environ['XFLUX_API_KEY']}"},
    params={"q": "CPI OR FOMC -filter:replies lang:en", "limit": 20},
    timeout=30,
)
r.raise_for_status()
print(len(r.json()["data"]))`,
      },
      {
        heading: "Search vs account monitors",
        paragraphs: [
          "Search is on-demand: great for research, backfills, and agent tools (MCP xflux_search_tweets). Account monitors are for always-on “this @handle posted” with signed webhooks on paid plans.",
          "Trading/macro keyword templates: /docs/guides/trading-keywords. Webhook delivery: /blog/twitter-account-monitor-webhook.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do all official X operators work?",
        answer:
          "Common read operators (from, since, until, lang, filter, OR, quotes) are the practical set. Exotic or write-oriented operators are out of scope for a read API.",
      },
      {
        question: "Does search count against my monthly quota?",
        answer:
          "Yes — each search request consumes API calls on your plan. Free includes 1,000 calls/month. See /pricing and /docs/limits.",
      },
      {
        question: "Can I search private accounts?",
        answer:
          "No. XFlux is for public X/Twitter data only.",
      },
    ],
  },
  {
    slug: "webhook-vs-polling-twitter",
    title: "Webhook vs Polling for Twitter/X Account Alerts",
    description:
      "Compare polling timelines vs signed HTTP webhooks for X account alerts — latency, cost, failure modes, and when XFlux monitors fit.",
    datePublished: "2026-09-28",
    keywords: [
      "twitter webhook vs polling",
      "twitter account alerts",
      "x api polling",
      "signed webhooks twitter",
      "twitter monitor webhook",
    ],
    sections: [
      {
        heading: "The polling trap",
        paragraphs: [
          "The default DIY pattern: cron every N minutes, GET user timeline, diff tweet IDs, notify Slack/Discord. It works until you scale — more accounts means more requests, more rate-limit juggling, and quieter failures when a job silently skips a tick.",
          "Polling also forces a latency floor. A 5-minute cron means up to 5 minutes late on market-moving posts. Shortening the interval multiplies API spend.",
        ],
      },
      {
        heading: "What webhooks change",
        paragraphs: [
          "With monitors, the platform watches schedules and POSTs to your HTTPS endpoint when new tweets appear. Paid XFlux plans sign payloads so you can verify authenticity (HMAC). You still need an idempotent handler — duplicate deliveries happen in any webhook system.",
          "You trade cron complexity for endpoint reliability: TLS, fast 2xx responses, and retries. That is usually the right trade for production alerts.",
        ],
      },
      {
        heading: "When polling is still fine",
        paragraphs: [
          "One-off research scripts, MCP agent sessions, and low-stakes dashboards can poll search or timelines on demand. Free-tier exploration often starts there.",
          "Hybrid pattern: poll/search to discover accounts, then promote winners to monitors + webhooks so you stop babysitting cron.",
        ],
      },
      {
        heading: "Practical checklist",
        paragraphs: [
          "Prefer webhooks when latency or missed posts cost money. Prefer polling when you are still exploring queries. Verify signatures, log delivery IDs, and keep handlers under a few hundred ms.",
          "Setup guide: /docs/monitors and /docs/webhooks. Narrative walkthrough: /blog/twitter-account-monitor-webhook. Discord path: /twitter-discord-alerts.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Free include live webhooks?",
        answer:
          "Free can create a monitor and send test pings. Live hit delivery on new tweets is on Starter and above. See /pricing.",
      },
      {
        question: "How do I verify XFlux webhooks?",
        answer:
          "Use the signing secret from the dashboard and verify the HMAC header before trusting the body. Details in /docs/webhooks.",
      },
      {
        question: "What if my endpoint is down?",
        answer:
          "Design for retries and catch-up. Keep your receiver highly available; do not put long work on the request path — queue and ack quickly.",
      },
    ],
  },
  {
    slug: "twitter-api-free-tier",
    title: "Twitter/X API Free Tier in 2026: What You Actually Get",
    description:
      "Compare free options for reading public X data — official X API access reality vs freemium alternatives like XFlux (1,000 calls + 1 monitor).",
    datePublished: "2026-09-28",
    keywords: [
      "twitter api free tier",
      "x api free 2026",
      "free twitter api alternative",
      "twitter api free plan",
      "xflux free tier",
    ],
    sections: [
      {
        heading: "“Free Twitter API” is a loaded phrase",
        paragraphs: [
          "Developers still search for a free Twitter API. After X’s pricing changes, official access for serious read volume is paid and gated. Hobby projects that used to scrape or lean on dead free tiers need a clear freemium path — or they stall.",
          "When evaluating free tiers, ask three questions: Is it a trial that expires, or an ongoing monthly allotment? Are write actions required for your use case? Do you need push alerts, or only occasional reads?",
        ],
      },
      {
        heading: "What XFlux Free includes",
        paragraphs: [
          "XFlux Free: 1,000 API calls per month, 1 account monitor, self-serve signup, no credit card. Reads cover profiles, timelines, tweet lookup, and search. Docs and dashboard are included.",
          "Live signed webhooks on new posts start on paid plans (from $19/mo). Free is meant to validate auth, integrate clients, and prove the monitor UX — not to power a production newsroom.",
        ],
      },
      {
        heading: "How to stay inside 1,000 calls",
        paragraphs: [
          "Cache profile lookups. Prefer monitors over tight polling loops. Use search with operators and small limits. Batch experiments in one script instead of flapping the same endpoint in a UI hot reload.",
          "When you hit the ceiling, Starter jumps to 150,000 calls/month plus webhook delivery. Pricing detail: /pricing and /blog/x-api-cost-2026.",
        ],
      },
      {
        heading: "Alternatives framing",
        paragraphs: [
          "Scrapers and unofficial clients can look “free” until they break TOS, IP blocks, or your pager. Managed read APIs trade money for stability. Compare options: /blog/twitter-api-alternative and /compare.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is XFlux affiliated with X Corp?",
        answer:
          "No. XFlux is an independent read API and monitoring product for public data.",
      },
      {
        question: "Do I need official X developer approval?",
        answer:
          "Not for XFlux self-serve. Create a key at /register and call the API.",
      },
      {
        question: "What happens when Free quota is exhausted?",
        answer:
          "Further API calls are rejected until the monthly window resets or you upgrade. Check usage under Dashboard → Usage.",
      },
    ],
  },
  {
    slug: "twitter-to-discord-alerts",
    title: "Discord Twitter Alerts Without Polling Timelines",
    description:
      "Discord Twitter integration for account alerts: discover handles, promote them to monitors, push signed webhooks into Discord — Free to test, Starter for live hits. Hub: /twitter-webhook.",
    datePublished: "2026-10-08",
    keywords: [
      "discord twitter",
      "discord twitter integration",
      "twitter to discord",
      "twitter discord webhook",
      "twitter discord integration",
      "monitor twitter discord",
    ],
    sections: [
      {
        heading: "Polling Discord alerts does not scale",
        paragraphs: [
          "Searches like “discord twitter” or “discord twitter integration” usually mean one job: when these public accounts post, the Discord channel lights up. DIY cron + timeline fetch works for one handle — then you own workers, cursors, rate limits, and silent misses.",
          "X does not ship a public new-tweet webhook. Treat Discord delivery as the last hop of a Twitter webhook pipeline: monitors detect posts, signed HTTP POSTs hit your stack, Discord Incoming Webhooks (or a bot) render the message. Product hub: /twitter-webhook. Landing: /twitter-discord-alerts.",
        ],
      },
      {
        heading: "Architecture: discover then promote",
        paragraphs: [
          "Discover candidates with search (from:user, cashtags, lang:) the same way you would for crypto KOLs. Keep accounts that produce actionable posts — not pure engagement bait.",
          "Promote keepers to XFlux monitors. Paste a Discord Incoming Webhook URL on the monitor (XFlux formats Discord payloads) or point at Make/n8n/your HTTPS receiver and forward yourself. Make path: /docs/integrations/make. Custom Node HMAC: /twitter-webhook-nodejs.",
        ],
        code: `// After verifying X-XFlux-Signature on the raw body...
const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
const { tweet, monitor } = payload; // monitor.hit shape

await fetch(discordWebhook, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: \`**@\${monitor.targetUsername}** posted:\\n\${tweet.text}\`,
  }),
});`,
      },
      {
        heading: "Alert hygiene",
        paragraphs: [
          "Split Discord channels by risk: macro vs crypto KOLs vs brand watches so traders can mute noise. Add keyword filters on noisy monitors. Deduplicate by tweet id; rate-limit if an account threads aggressively.",
          "Same hygiene playbook as the general webhook guide: /blog/twitter-webhooks-account-alerts. Keyword templates: /docs/guides/trading-keywords.",
        ],
      },
      {
        heading: "Budgeting API calls",
        paragraphs: [
          "Exploration burns search/timeline quota. Steady-state should be monitor-heavy so you are not polling every account for Discord. Free: 1 monitor, Dashboard hits, Test webhook pings to prove Discord wiring. Starter: live monitor.hit delivery and faster polling.",
          "If you also need Slack or a custom server, start from /twitter-webhook and branch to /twitter-slack-alerts — same monitor events, different destinations.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Discord call XFlux directly?",
        answer:
          "Discord Incoming Webhooks only receive POSTs. Either paste the Discord URL into XFlux (we format the payload) or use a middle layer (Make/n8n/your server) that XFlux calls first.",
      },
      {
        question: "Is a Discord bot token required?",
        answer:
          "Not for channel webhooks. Bot tokens are for richer bots (slash commands, roles). Webhooks cover most “post appeared” alerts.",
      },
      {
        question: "Where do I start?",
        answer:
          "Register → add one monitor → paste Discord webhook → Test → upgrade when you need live hits. Hub: /twitter-webhook. Product page: /twitter-discord-alerts.",
      },
    ],
  },
  {
    slug: "twitter-webhooks-account-alerts",
    title: "Twitter Webhooks for Account Alerts (Not Cron or Spreadsheets)",
    description:
      "X has no public Twitter webhook for new tweets. Use account monitors + signed HTTP webhooks for Discord, Slack, or your server — discover handles, promote keepers, budget Free vs Starter.",
    datePublished: "2026-10-08",
    keywords: [
      "twitter webhook",
      "webhooks twitter integration",
      "twitter webhook integration",
      "twitter webhook api",
      "twitter account webhook",
    ],
    sections: [
      {
        heading: "Cron and spreadsheets do not scale",
        paragraphs: [
          "Most teams searching for a Twitter webhook want one job: when these public accounts post, notify Slack, Discord, or our bot. Official X does not expose a simple public webhook for that. DIY means cron + timeline fetch + dedupe + secrets — fine for one handle, painful for a desk.",
          "Treat alerts as engineering: discover candidates with search, promote high-signal accounts to monitors, push hits to your stack. Hub overview: /twitter-webhook.",
        ],
      },
      {
        heading: "Discovery then promote",
        paragraphs: [
          "Use search operators (from:user, cashtags, lang:) to build a candidate list — same pattern as crypto KOL tracking. Pull a few timelines; keep accounts that produce actionable posts, not engagement bait.",
          "Promote keepers to XFlux monitors (Free: 1 monitor + Dashboard history). Pair Slack (/twitter-slack-alerts) or Discord (/twitter-discord-alerts, walkthrough /blog/twitter-to-discord-alerts) when you want channel delivery without writing a bot first.",
        ],
      },
      {
        heading: "Alert hygiene",
        paragraphs: [
          "Separate channels for macro vs crypto vs brand watches. Add keyword filters on noisy monitors. Cap how many accounts you enable on day one — each monitor is an ops commitment.",
          "For custom servers, verify HMAC on the raw body (/twitter-webhook-nodejs, /docs/webhooks). For no-code, use Make or n8n (/twitter-n8n-webhook).",
        ],
      },
      {
        heading: "Budgeting API calls",
        paragraphs: [
          "Exploration burns search/timeline calls. Steady-state should be monitor-heavy so you are not polling every account yourself. Free validates wiring and Test webhooks; Starter unlocks live monitor.hit POSTs and faster polling.",
          "If you were comparing enterprise AAA or filtered stream, start at /twitter-account-activity-api and /filtered-stream-alternative — then come back here for the webhook path.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is XFlux an official Twitter webhook product?",
        answer:
          "No. XFlux is an independent read API and account monitor service. We deliver signed HTTP webhooks when monitors detect new public tweets — not official AAA or filtered stream.",
      },
      {
        question: "Can Free plans receive live webhooks?",
        answer:
          "Free can save a URL and send Test pings. Live monitor.hit delivery requires Starter or above. Hits always show in the Dashboard.",
      },
      {
        question: "Where do I start?",
        answer:
          "Register → add one monitor → paste Discord/Slack/HTTPS → Test → upgrade when you need live delivery. Hub: /twitter-webhook. Discord deep-dive: /blog/twitter-to-discord-alerts.",
      },
    ],
  },
  {
    slug: "track-crypto-kols-twitter-api",
    title: "Track Crypto KOLs on X with an API (Not Spreadsheets)",
    description:
      "Monitor crypto influencers and project accounts on X/Twitter with search + account monitors — replace spreadsheet stalking with webhooks and quotas you can budget.",
    datePublished: "2026-09-28",
    keywords: [
      "crypto kol twitter",
      "track crypto influencers twitter",
      "twitter crypto alerts",
      "memecoin twitter monitor",
      "xflux crypto",
    ],
    sections: [
      {
        heading: "Spreadsheets do not scale",
        paragraphs: [
          "Crypto desks and indie traders keep lists of KOLs, founders, and deployers in Notion or Sheets, then manually refresh timelines. That breaks the moment you care about minutes, not hours — and it does not page Discord when someone shills a ticker.",
          "Treat KOL tracking as an engineering problem: discover candidates with search, promote high-signal accounts to monitors, push hits to your alert stack.",
        ],
      },
      {
        heading: "Discovery then promote",
        paragraphs: [
          "Use search operators for cashtags and narratives (example: $SOL OR “airdrop” lang:en -filter:replies) to build a candidate list. Pull timelines for accounts that repeatedly make falsifiable calls — not just engagement bait.",
          "Promote keepers to XFlux monitors. Pair with Smart Money (/predictors) when you want ranked prediction-style accounts instead of pure influencer fame.",
        ],
      },
      {
        heading: "Alert hygiene",
        paragraphs: [
          "Separate channels for L1/L2 news vs memecoin KOLs. Filter keywords on your receiver if a monitor is noisy. Cap how many accounts you watch on day one — each monitor is an ops commitment.",
          "Use-case page: /use-cases/crypto-alerts. Related: /blog/twitter-trading-alerts. Webhook hub: /twitter-webhook.",
        ],
      },
      {
        heading: "Budgeting API calls",
        paragraphs: [
          "Exploration burns search/timeline calls. Steady-state should be monitor-heavy so you are not polling every KOL every minute. Start on Free to validate wiring, then Starter+ for live webhooks and higher quotas. Same playbook as /blog/twitter-webhooks-account-alerts.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I monitor private Telegram alongside X?",
        answer:
          "XFlux focuses on public X/Twitter data. Use your own stack for Telegram; keep X alerts in the same Discord via a shared forwarder if needed.",
      },
      {
        question: "How is this different from Social Listening suites?",
        answer:
          "XFlux is developer-first REST + monitors + MCP — not a full brand social suite. You own the alerting UX.",
      },
      {
        question: "Where do I start?",
        answer:
          "Register → create a key → search a cashtag → add one monitor → wire Discord. Guides: /docs/guides/search, /twitter-discord-alerts, and /twitter-webhook.",
      },
    ],
  },
];
