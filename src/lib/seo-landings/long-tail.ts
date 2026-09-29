export type LongTailLanding = {
  slug: string;
  path: `/${string}`;
  /** Primary long-tail query this page owns */
  primaryKeyword: string;
  title: string;
  description: string;
  keywords: string[];
  badge: string;
  h1: string;
  subtitle: string;
  registerSrc: string;
  cards: { title: string; text: string }[];
  howTitle: string;
  steps: { title: string; text: string }[];
  compareTitle?: string;
  compareBlurb?: string;
  compareCols?: { left: string; right: string };
  compareRows?: { label: string; left: string; right: string }[];
  codeTitle?: string;
  codeBlurb?: string;
  code?: string;
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
};

/**
 * One page → one primary long-tail. English-first for GSC English queries.
 * Honest framing: XFlux is account monitors + signed webhooks, not official AAA / filtered stream.
 */
export const LONG_TAIL_LANDINGS: LongTailLanding[] = [
  {
    slug: "twitter-account-activity-api",
    path: "/twitter-account-activity-api",
    primaryKeyword: "twitter account activity api",
    title: "Twitter Account Activity API — Practical Alternative",
    description:
      "Need Twitter Account Activity API–style alerts without enterprise AAA? XFlux monitors watch public @handles and POST signed webhooks from $19/mo. Free tier to start.",
    keywords: [
      "twitter account activity api",
      "account activity api twitter",
      "twitter aaa api",
      "x account activity api",
    ],
    badge: "Account Activity API alternative",
    h1: "Twitter Account Activity API–style alerts without enterprise AAA",
    subtitle:
      "Official Account Activity API (AAA) is enterprise-gated. If you only need new tweets from specific public accounts, XFlux account monitors + signed HTTP webhooks cover the same job at Starter pricing.",
    registerSrc: "seo_twitter_aaa",
    cards: [
      {
        title: "Watch named @accounts",
        text: "Create monitors for the handles you care about — optional keyword filters — no CRC challenge handshake to maintain.",
      },
      {
        title: "Signed webhooks on hit",
        text: "Starter+ POSTs monitor.hit events to Discord, Slack, Make, n8n, or your server with HMAC-SHA256 verification.",
      },
      {
        title: "Also a read API",
        text: "Same key covers profiles, timelines, and search when you need on-demand pulls — not only push alerts.",
      },
    ],
    howTitle: "Replace AAA-style account alerts in three steps",
    steps: [
      {
        title: "Create a free XFlux account",
        text: "Generate an API key and open Dashboard → Monitors. Free includes 1 monitor and hit history.",
      },
      {
        title: "Add the @handles you used to subscribe via AAA",
        text: "Set optional keywords (tickers, Fed, memecoin slang). Polling interval depends on plan (down to 1s on paid tiers).",
      },
      {
        title: "Paste a webhook URL on Starter+",
        text: "Save Discord/Slack/Make/your HTTPS URL, click Test, then upgrade when you need live hit delivery.",
      },
    ],
    compareTitle: "Official Account Activity API vs XFlux monitors",
    compareBlurb:
      "AAA is the right tool for enterprise subscription to account events across the X platform. XFlux is for developers who need account-level alerts and a read API without that procurement path.",
    compareCols: { left: "Official AAA", right: "XFlux" },
    compareRows: [
      {
        label: "Access",
        left: "Enterprise / partner process",
        right: "Self-serve signup",
      },
      {
        label: "Scope",
        left: "Subscribed account activity events",
        right: "Public @handles you configure",
      },
      {
        label: "Delivery",
        left: "Official webhook + CRC",
        right: "HMAC-signed HTTP webhooks (Starter+)",
      },
      {
        label: "Typical cost",
        left: "Enterprise contract",
        right: "From $19/mo Starter",
      },
    ],
    faqs: [
      {
        question: "Is XFlux the official Twitter Account Activity API?",
        answer:
          "No. XFlux is an independent read API and account monitor product. We do not resell official AAA. We solve a common subset: notify me when these public accounts post.",
      },
      {
        question: "When should I still use official AAA?",
        answer:
          "When you need official enterprise SLAs, full Activity event types, or contractual access to X’s Account Activity product. For watching a short list of public KOLs or brands, monitors are usually enough.",
      },
      {
        question: "Do Free plans get live webhooks?",
        answer:
          "Free can save a URL and send Test pings. Live monitor.hit delivery starts on Starter ($19/mo). Hits always appear in the Dashboard.",
      },
    ],
    related: [
      { href: "/account-activity-api-alternative", label: "Account Activity API alternative" },
      { href: "/filtered-stream-alternative", label: "Filtered stream alternative" },
      { href: "/twitter-webhook", label: "Twitter webhook integration" },
      { href: "/docs/webhooks", label: "Webhook docs" },
    ],
  },
  {
    slug: "account-activity-api-alternative",
    path: "/account-activity-api-alternative",
    primaryKeyword: "account activity api alternative",
    title: "Account Activity API Alternative — XFlux Monitors",
    description:
      "Looking for an Account Activity API alternative? XFlux watches public X/Twitter accounts and delivers signed webhooks from $19/mo — self-serve, no enterprise AAA.",
    keywords: [
      "account activity api alternative",
      "twitter aaa alternative",
      "x account activity alternative",
      "account activity webhook alternative",
    ],
    badge: "AAA alternative",
    h1: "Account Activity API alternative for public account alerts",
    subtitle:
      "Most teams searching for an Account Activity API alternative only need: specific @accounts → webhook when they tweet. That is XFlux monitors — not a full enterprise AAA clone.",
    registerSrc: "seo_aaa_alt",
    cards: [
      {
        title: "Self-serve in minutes",
        text: "No partner application for the common “alert me when @x posts” workflow.",
      },
      {
        title: "Webhook destinations you already use",
        text: "Discord, Slack, Make.com, n8n, or a custom HTTPS endpoint with signature verification.",
      },
      {
        title: "Transparent pricing",
        text: "Free tier for Dashboard hits; Starter from $19/mo for live delivery and faster polling.",
      },
    ],
    howTitle: "How this alternative works",
    steps: [
      {
        title: "Pick accounts, not an enterprise subscription list",
        text: "Add monitors for each public handle. Optional keywords reduce noise.",
      },
      {
        title: "Verify with Test webhook",
        text: "Confirm Discord/Slack/your server receives a signed (or Discord-formatted) payload.",
      },
      {
        title: "Upgrade when live delivery matters",
        text: "Starter unlocks live hit POSTs. Keep using the REST API for backfills and search.",
      },
    ],
    compareTitle: "What you get vs what you give up",
    compareBlurb:
      "An alternative means trade-offs. Use this table to decide quickly.",
    compareCols: { left: "You give up (vs official AAA)", right: "You gain with XFlux" },
    compareRows: [
      {
        label: "Event catalog",
        left: "Full official activity event set",
        right: "New public tweets from watched accounts",
      },
      {
        label: "Procurement",
        left: "Enterprise sales cycle",
        right: "Card checkout / free start",
      },
      {
        label: "Latency model",
        left: "Official push stream",
        right: "Scheduled polling (plan-based interval)",
      },
      {
        label: "Extras",
        left: "Platform-native AAA features",
        right: "Read REST API + MCP for agents",
      },
    ],
    faqs: [
      {
        question: "Is this a drop-in AAA replacement?",
        answer:
          "No. Payloads, auth, and event types differ. Plan a small adapter if you previously verified official AAA signatures.",
      },
      {
        question: "Can I watch private accounts?",
        answer:
          "XFlux monitors public timeline data available through our read path. Private/protected accounts are out of scope.",
      },
      {
        question: "Where do I see docs?",
        answer:
          "Start at /docs/monitors and /docs/webhooks. Integration guides cover Make.com and Discord.",
      },
    ],
    related: [
      { href: "/twitter-account-activity-api", label: "Twitter Account Activity API guide" },
      { href: "/twitter-activity-api", label: "Twitter Activity API" },
      { href: "/twitter-discord-alerts", label: "Discord alerts" },
      { href: "/docs/compare/pricing", label: "Pricing vs official X API" },
    ],
  },
  {
    slug: "twitter-activity-api",
    path: "/twitter-activity-api",
    primaryKeyword: "twitter activity api",
    title: "Twitter Activity API — What It Means & a Practical Path",
    description:
      "Twitter Activity API usually refers to Account Activity (AAA). For account-level tweet alerts without enterprise AAA, use XFlux monitors and signed webhooks from $19/mo.",
    keywords: [
      "twitter activity api",
      "x activity api",
      "twitter activity webhook",
      "activity api twitter",
    ],
    badge: "Activity API explained",
    h1: "Twitter Activity API: what people mean (and a practical path)",
    subtitle:
      "“Twitter Activity API” almost always points at Account Activity API. If your goal is activity alerts for a fixed account list, XFlux monitors deliver webhook notifications without the enterprise AAA track.",
    registerSrc: "seo_activity_api",
    cards: [
      {
        title: "Clarify the product name",
        text: "Official docs center on Account Activity API. Casual search often shortens it to “activity api”.",
      },
      {
        title: "Match the job, not the acronym",
        text: "Job: know when accounts post. Tool: monitors + webhooks. Official AAA is one implementation; XFlux is another for public handles.",
      },
      {
        title: "Keep read + alert together",
        text: "Use the same XFlux key for search/timelines and for push alerts when monitors fire.",
      },
    ],
    howTitle: "Practical setup for activity-style alerts",
    steps: [
      {
        title: "List the accounts that matter",
        text: "KOLs, brands, competitors, macro voices — same list you’d subscribe in AAA.",
      },
      {
        title: "Create monitors in XFlux",
        text: "One monitor per @handle (Free: 1; Starter: 3). Add keywords if you only care about certain posts.",
      },
      {
        title: "Route activity to your stack",
        text: "Webhook to Slack/Discord/automation tools, or verify HMAC on your API.",
      },
    ],
    faqs: [
      {
        question: "Is there a separate Twitter product called Activity API?",
        answer:
          "In practice, searchers mean Account Activity API (AAA). X’s product naming has changed over time; always check current docs.x.com for official offerings.",
      },
      {
        question: "Does XFlux provide the full Activity event set?",
        answer:
          "No. We focus on new public tweets from monitored accounts (with optional keyword filters), plus a general-purpose read API.",
      },
      {
        question: "How is this different from filtered stream?",
        answer:
          "Filtered stream is network-wide rule matching at high official tiers. Activity/AAA and XFlux monitors are account-centric. See /filtered-stream-alternative.",
      },
    ],
    related: [
      { href: "/twitter-account-activity-api", label: "Account Activity API page" },
      { href: "/account-activity-api-alternative", label: "AAA alternative" },
      { href: "/filtered-stream-alternative", label: "Filtered stream alternative" },
      { href: "/blog/webhook-vs-polling-twitter", label: "Webhook vs polling" },
    ],
  },
  {
    slug: "filtered-stream-alternative",
    path: "/filtered-stream-alternative",
    primaryKeyword: "twitter filtered stream alternative",
    title: "Twitter Filtered Stream Alternative — Account Monitors",
    description:
      "Need a Twitter filtered stream alternative for watching accounts? XFlux monitors + signed webhooks from $19/mo — not the ~$5,000/mo official Pro stream.",
    keywords: [
      "twitter filtered stream alternative",
      "x api filtered stream alternative",
      "filtered stream alternative",
      "cheap twitter stream alternative",
    ],
    badge: "Filtered stream alternative",
    h1: "Twitter filtered stream alternative for account-level alerts",
    subtitle:
      "Official filtered stream is built for network-wide rules at Pro-scale pricing. If you only need a filtered stream alternative for specific accounts, XFlux monitors are the cheaper, self-serve path.",
    registerSrc: "seo_filtered_stream",
    cards: [
      {
        title: "Account list, not global rules",
        text: "Point monitors at @handles. Optional keywords act as a lightweight filter on those timelines.",
      },
      {
        title: "Order-of-magnitude cost difference",
        text: "Starter from $19/mo for webhooks vs official Pro filtered stream often cited around $5,000/mo — confirm current X pricing on docs.x.com.",
      },
      {
        title: "Honest latency",
        text: "We poll on a schedule (plan-based). Not a substitute for sub-second enterprise firehose SLAs.",
      },
    ],
    howTitle: "When monitors beat filtered stream",
    steps: [
      {
        title: "Confirm your scope is account-centric",
        text: "Watching 3–50 known accounts → monitors. Matching arbitrary global keywords at scale → official stream.",
      },
      {
        title: "Configure monitors + keywords",
        text: "Use trading keyword templates if you filter for macro/crypto language.",
      },
      {
        title: "Deliver via webhook",
        text: "Push hits to Make, Discord, Slack, or your trading bot — signed payloads on Starter+.",
      },
    ],
    compareTitle: "Filtered stream vs XFlux monitors",
    compareCols: { left: "Official filtered stream", right: "XFlux monitors" },
    compareRows: [
      {
        label: "Best for",
        left: "Network-wide rule matching",
        right: "Known @accounts + keywords",
      },
      {
        label: "Pricing ballpark",
        left: "Pro stream ~$5,000/mo (verify)",
        right: "From $19/mo Starter",
      },
      {
        label: "Setup",
        left: "Official developer tiers + rules",
        right: "Dashboard monitors + webhook URL",
      },
      {
        label: "Delivery",
        left: "Streaming connection",
        right: "HTTP webhooks on schedule",
      },
    ],
    faqs: [
      {
        question: "Can XFlux replace filtered stream entirely?",
        answer:
          "Not for firehose / complex global rules. Yes for “these accounts, these keywords, notify me.”",
      },
      {
        question: "Is polling “real-time streaming”?",
        answer:
          "No — we avoid that claim. Paid plans can poll as often as every 1 second; that is still polling.",
      },
      {
        question: "Where is pricing comparison?",
        answer: "See /docs/compare/pricing and /compare/x-api for broader X API alternative context.",
      },
    ],
    related: [
      { href: "/twitter-account-activity-api", label: "Account Activity API" },
      { href: "/use-cases/trading-alerts", label: "Trading alerts use case" },
      { href: "/docs/compare/pricing", label: "Pricing vs X API" },
      { href: "/twitter-webhook", label: "Twitter webhooks" },
    ],
  },
  {
    slug: "twitter-slack-alerts",
    path: "/twitter-slack-alerts",
    primaryKeyword: "twitter slack alerts",
    title: "Twitter → Slack Alerts via Webhooks",
    description:
      "Send Twitter/X account alerts to Slack with XFlux monitors. Paste a Slack Incoming Webhook or route via Make — signed delivery from $19/mo.",
    keywords: [
      "twitter slack alerts",
      "twitter to slack webhook",
      "x slack webhook",
      "twitter slack integration",
    ],
    badge: "Slack alerts",
    h1: "Twitter Slack alerts from account monitors",
    subtitle:
      "Watch public @handles and push matches into Slack. XFlux formats Slack Incoming Webhook payloads for you — or send signed JSON to your own Slack bot.",
    registerSrc: "seo_slack_alerts",
    cards: [
      {
        title: "Slack Incoming Webhooks work",
        text: "Paste the Slack webhook URL on a monitor. We adapt the message body for Slack’s expected JSON.",
      },
      {
        title: "Or Make → Slack",
        text: "Prefer no-code? Custom Webhook in Make.com → Slack module. Same monitor.hit events.",
      },
      {
        title: "Keyword-filtered noise control",
        text: "Only alert when posts match tickers, product names, or macro phrases.",
      },
    ],
    howTitle: "Slack setup",
    steps: [
      {
        title: "Create a Slack Incoming Webhook",
        text: "In Slack apps, add Incoming Webhooks and copy the URL for your channel.",
      },
      {
        title: "Attach it to an XFlux monitor",
        text: "Dashboard → Monitors → Webhook → Save → Test. Free allows test pings.",
      },
      {
        title: "Upgrade for live hits",
        text: "Starter delivers when new tweets match. Discord users: see /twitter-discord-alerts.",
      },
    ],
    codeTitle: "What Slack receives (conceptual)",
    codeBlurb: "XFlux detects Slack webhook hosts and posts a Slack-compatible payload.",
    code: `XFlux monitor hit
        ↓
Slack Incoming Webhook URL detected
        ↓
POST { "text": "@handle: tweet text…" }
        ↓
Channel message in Slack`,
    faqs: [
      {
        question: "Do I need a custom Slack bot?",
        answer:
          "Not for Incoming Webhooks. Use a bot only if you want richer Block Kit UI or thread replies — then verify HMAC on your server and call Slack Web API.",
      },
      {
        question: "Is Discord supported the same way?",
        answer: "Yes — see /twitter-discord-alerts. Discord and Slack URLs are auto-detected.",
      },
      {
        question: "Make.com path?",
        answer: "Documented at /docs/integrations/make — Custom Webhook trigger → Slack.",
      },
    ],
    related: [
      { href: "/twitter-discord-alerts", label: "Discord alerts" },
      { href: "/twitter-n8n-webhook", label: "n8n twitter webhook" },
      { href: "/docs/integrations/make", label: "Make.com guide" },
      { href: "/twitter-webhook", label: "Webhook overview" },
    ],
  },
  {
    slug: "twitter-n8n-webhook",
    path: "/twitter-n8n-webhook",
    primaryKeyword: "n8n twitter webhook",
    title: "n8n Twitter Webhook — XFlux Monitor Hits",
    description:
      "Connect X/Twitter account monitors to n8n with XFlux webhooks. Receive monitor.hit events, verify HMAC, and automate Slack, email, or CRM — from $19/mo.",
    keywords: [
      "n8n twitter webhook",
      "n8n twitter alerts",
      "twitter webhook n8n",
      "xflux n8n",
    ],
    badge: "n8n automation",
    h1: "n8n Twitter webhook for account monitor hits",
    subtitle:
      "Point an XFlux monitor at your n8n Webhook node. On Starter+, each matching tweet POSTs a signed monitor.hit payload you can branch into any n8n workflow.",
    registerSrc: "seo_n8n",
    cards: [
      {
        title: "Webhook node as the entry",
        text: "Create an n8n Webhook trigger, copy the production URL into XFlux, then Test.",
      },
      {
        title: "Verify signatures in the flow",
        text: "Use a Function/Code node to check X-XFlux-Signature before trusting the body.",
      },
      {
        title: "Same pattern as Make.com",
        text: "If your team already uses Make, see /docs/integrations/make — concepts transfer cleanly to n8n.",
      },
    ],
    howTitle: "n8n wiring",
    steps: [
      {
        title: "Add Webhook trigger in n8n",
        text: "Method POST, path of your choice. Activate the workflow to get a public HTTPS URL.",
      },
      {
        title: "Save URL on the XFlux monitor",
        text: "Rotate secret if needed. Store the signing secret in n8n credentials/env.",
      },
      {
        title: "Branch on event === monitor.hit",
        text: "Map tweet.text / authorUsername into Slack, Telegram, Sheets, or your DB.",
      },
    ],
    codeTitle: "HMAC check sketch (n8n Code node)",
    codeBlurb: "Reject requests that fail signature or stale timestamps. Full details in webhook docs.",
    code: `// Pseudocode inside n8n Code node
const crypto = require("crypto");
const raw = $input.first().json.rawBody; // capture raw body
const ts = $input.first().headers["x-xflux-timestamp"];
const sig = $input.first().headers["x-xflux-signature"];
const expected =
  "sha256=" +
  crypto.createHmac("sha256", process.env.XFLUX_WEBHOOK_SECRET)
    .update(\`\${ts}.\${raw}\`)
    .digest("hex");
if (sig !== expected) throw new Error("bad signature");`,
    faqs: [
      {
        question: "Does XFlux have a native n8n node?",
        answer:
          "Not required — standard Webhook trigger works. A dedicated node may come later; signed HTTP is enough today.",
      },
      {
        question: "Free plan live delivery?",
        answer:
          "Free supports Test webhooks. Live hits need Starter+. You can still prototype the n8n graph with Test events.",
      },
      {
        question: "Make.com vs n8n?",
        answer:
          "Same XFlux event. Choose based on your automation stack — Make guide is already documented.",
      },
    ],
    related: [
      { href: "/docs/integrations/make", label: "Make.com (similar flow)" },
      { href: "/docs/webhooks", label: "Webhook signature docs" },
      { href: "/twitter-slack-alerts", label: "Slack alerts" },
      { href: "/twitter-webhook-nodejs", label: "Node.js webhook handler" },
    ],
  },
  {
    slug: "twitter-webhook-nodejs",
    path: "/twitter-webhook-nodejs",
    primaryKeyword: "twitter webhook nodejs",
    title: "Twitter Webhook in Node.js — Verify XFlux Signatures",
    description:
      "Handle Twitter/X account monitor webhooks in Node.js. Express example verifying XFlux HMAC-SHA256 signatures for monitor.hit events. Starter from $19/mo.",
    keywords: [
      "twitter webhook nodejs",
      "twitter webhook node.js",
      "x webhook express",
      "verify twitter webhook hmac node",
    ],
    badge: "Node.js tutorial",
    h1: "Twitter webhook Node.js handler (XFlux signed POSTs)",
    subtitle:
      "Receive account-monitor alerts in Express (or any Node HTTP server). Verify X-XFlux-Signature over the raw body, then process monitor.hit JSON.",
    registerSrc: "seo_webhook_nodejs",
    cards: [
      {
        title: "Raw body matters",
        text: "HMAC is over `{timestamp}.{rawBody}`. Use express.raw or equivalent — parsed JSON breaks verification.",
      },
      {
        title: "Timing-safe compare",
        text: "Compare signatures with crypto.timingSafeEqual to avoid leaking timing.",
      },
      {
        title: "Idempotent handlers",
        text: "Key off tweet id / delivery id so retries do not double-post to Slack or Discord.",
      },
    ],
    howTitle: "Node.js setup",
    steps: [
      {
        title: "Create monitor + webhook URL pointing at your server",
        text: "Expose HTTPS (ngrok for local tests). Save the signing secret from the Dashboard.",
      },
      {
        title: "Implement verification middleware",
        text: "Reject missing headers, skew > 5 minutes, or bad signatures with 401.",
      },
      {
        title: "Handle monitor.hit and monitor.test",
        text: "Test events validate connectivity; hit events are live matches on Starter+.",
      },
    ],
    codeTitle: "Express verification example",
    codeBlurb: "Production code should load the secret from env and log failures without echoing secrets.",
    code: `import express from "express";
import crypto from "crypto";

const app = express();
const secret = process.env.XFLUX_WEBHOOK_SECRET!;

app.post(
  "/webhooks/xflux",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const ts = req.header("X-XFlux-Timestamp") || "";
    const sig = req.header("X-XFlux-Signature") || "";
    const raw = req.body.toString("utf8");
    const expected =
      "sha256=" +
      crypto.createHmac("sha256", secret).update(\`\${ts}.\${raw}\`).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).end();
    }
    const event = JSON.parse(raw);
    if (event.event === "monitor.hit") {
      console.log(event.tweet.authorUsername, event.tweet.text);
    }
    res.status(200).send("ok");
  }
);`,
    faqs: [
      {
        question: "Python example?",
        answer:
          "Same header scheme — see /docs/webhooks and /docs/guides/python. This page focuses on Node.js.",
      },
      {
        question: "Discord without a server?",
        answer:
          "Paste a Discord Incoming Webhook URL into XFlux — no Node process required. See /twitter-discord-alerts.",
      },
      {
        question: "Official Twitter CRC challenge?",
        answer:
          "XFlux uses HMAC on our payloads, not the official AAA CRC challenge. Do not mix verifiers.",
      },
    ],
    related: [
      { href: "/docs/webhooks", label: "Full webhook docs" },
      { href: "/docs/guides/nodejs", label: "Node.js API guide" },
      { href: "/twitter-n8n-webhook", label: "n8n path" },
      { href: "/monitor-twitter-account-webhook", label: "Monitor + webhook guide" },
    ],
  },
  {
    slug: "monitor-twitter-account-webhook",
    path: "/monitor-twitter-account-webhook",
    primaryKeyword: "monitor twitter account webhook",
    title: "Monitor Twitter Account → Webhook Alerts",
    description:
      "Monitor a Twitter/X account and get webhook alerts when they post. XFlux scheduled monitors + signed HTTP webhooks from $19/mo. Free tier includes Dashboard hits.",
    keywords: [
      "monitor twitter account webhook",
      "twitter account monitor webhook",
      "watch twitter account webhook",
      "x account monitor webhook",
    ],
    badge: "Account monitor → webhook",
    h1: "Monitor a Twitter account and fire a webhook",
    subtitle:
      "The search intent is simple: watch an @account, get a webhook. XFlux is built for that — schedule, optional keywords, Dashboard history, live POST on Starter+.",
    registerSrc: "seo_monitor_webhook",
    cards: [
      {
        title: "One monitor per @handle",
        text: "Free: 1 monitor. Starter: 3. Higher tiers add more. Pause/resume anytime.",
      },
      {
        title: "Webhook when it matters",
        text: "Live delivery on paid plans. Test button works on Free so you can wire Discord/Slack/Make first.",
      },
      {
        title: "Keyword filters",
        text: "Ignore unrelated tweets — useful for trading, crypto KOLs, and brand mention watches.",
      },
    ],
    howTitle: "End-to-end path",
    steps: [
      {
        title: "Add the account in Monitors",
        text: "Enter @username and optional comma-separated keywords.",
      },
      {
        title: "Run Check now once",
        text: "First check baselines history so only newer tweets become hits.",
      },
      {
        title: "Attach webhook + upgrade if you need push",
        text: "Save URL → Test → Starter for live hits. Related deep-dives: Discord, Slack, Node.js, n8n pages.",
      },
    ],
    compareTitle: "DIY poller vs XFlux",
    compareCols: { left: "DIY cron + Twitter API", right: "XFlux" },
    compareRows: [
      {
        label: "Poller",
        left: "You write & host",
        right: "Managed schedule",
      },
      {
        label: "Deduping hits",
        left: "Your storage",
        right: "Dashboard hit history",
      },
      {
        label: "Webhook signing",
        left: "DIY",
        right: "HMAC included (Starter+)",
      },
      {
        label: "Quota",
        left: "Official X tiers",
        right: "Flat XFlux plans + free tier",
      },
    ],
    faqs: [
      {
        question: "How fast is detection?",
        answer:
          "Depends on plan interval (paid can be as frequent as 1s). Not marketed as sub-second streaming.",
      },
      {
        question: "Can Free users receive live webhooks?",
        answer:
          "No — Free is Test + Dashboard. That gating is intentional so Starter is the clear upgrade for push alerts.",
      },
      {
        question: "More narrative walkthrough?",
        answer:
          "See /blog/twitter-account-monitor-webhook and /docs/monitors for longer form content.",
      },
    ],
    related: [
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/twitter-slack-alerts", label: "Slack" },
      { href: "/twitter-discord-alerts", label: "Discord" },
      { href: "/blog/twitter-account-monitor-webhook", label: "Blog walkthrough" },
    ],
  },
];

export function getLongTailLanding(slug: string): LongTailLanding | undefined {
  return LONG_TAIL_LANDINGS.find((p) => p.slug === slug);
}

export const LONG_TAIL_SLUGS = LONG_TAIL_LANDINGS.map((p) => p.slug);
