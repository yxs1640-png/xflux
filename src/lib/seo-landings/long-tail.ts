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
  /**
   * Dual-track (SEO+GEO): one complete conclusion first.
   * Keep ≤ ~100 Latin characters (≈50 CJK chars) so AI Overviews can lift it.
   */
  verdict?: string;
  subtitle: string;
  registerSrc: string;
  /** H2 sections with a verifiable product fact (prefer over vague adjectives). */
  facts?: { heading: string; data: string }[];
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
    title: "Twitter Account Activity API — Free Monitor Alternative",
    description:
      "Account Activity API Twitter alternative without enterprise AAA. Free: 1 monitor + Dashboard hits. Live signed webhooks on Starter for Discord, Slack, or HTTPS.",
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
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/account-activity-api-alternative", label: "Account Activity API alternative" },
      { href: "/twitter-slack-alerts", label: "Twitter → Slack alerts" },
      { href: "/twitter-discord-alerts", label: "Twitter → Discord alerts" },
      { href: "/blog/twitter-to-discord-alerts", label: "Discord Twitter guide (blog)" },
      { href: "/monitor-twitter-account-webhook", label: "Monitor → webhook" },
      { href: "/blog/twitter-webhooks-account-alerts", label: "Webhook setup guide (blog)" },
      { href: "/docs/webhooks", label: "Webhook docs" },
    ],
  },
  {
    slug: "account-activity-api-alternative",
    path: "/account-activity-api-alternative",
    primaryKeyword: "account activity api alternative",
    title: "Account Activity API Alternative — XFlux Monitors",
    description:
      "Looking for an Account Activity API alternative? Watch public X accounts on the free plan — Dashboard hits included, test webhooks, live delivery when you need it.",
    keywords: [
      "account activity api alternative",
      "twitter aaa alternative",
      "x account activity alternative",
      "account activity webhook alternative",
    ],
    badge: "AAA alternative",
    h1: "Account Activity API alternative for public account alerts",
    verdict:
      "XFlux monitors: public @accounts → Dashboard or signed webhooks. Free to start; live POSTs from $19/mo Starter.",
    subtitle:
      "Most teams searching for an Account Activity API alternative only need: specific @accounts → webhook when they tweet. That is XFlux monitors — not a full enterprise AAA clone.",
    registerSrc: "seo_aaa_alt",
    facts: [
      {
        heading: "What events you get",
        data: "New public tweets from watched @handles. Optional keyword filters. Not the full official AAA event catalog (follows, DMs, etc.).",
      },
      {
        heading: "Pricing to go live",
        data: "Free: 1 monitor + Dashboard hits + Test webhook. Starter $19/mo: live monitor.hit POSTs. Limits: /docs/limits.",
      },
      {
        heading: "Delivery targets",
        data: "Discord, Slack Incoming Webhook, Make.com, n8n, or custom HTTPS with HMAC-SHA256 verify — /docs/webhooks.",
      },
    ],
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
        question: "Is XFlux a drop-in Account Activity API replacement?",
        answer:
          "No. Payloads and event types differ. Use an adapter if you verified official AAA signatures before.",
      },
      {
        question: "What is the cheapest Account Activity API alternative for Slack alerts?",
        answer:
          "Free tests Slack with Test webhook. Live posts need Starter at $19/mo. Steps: /connect-slack-to-twitter.",
      },
      {
        question: "Can an AAA alternative watch private X accounts?",
        answer:
          "No. XFlux monitors public posts only. Protected accounts are out of scope.",
      },
      {
        question: "Where are monitor and webhook docs for this alternative?",
        answer: "Monitors: /docs/monitors. Webhooks: /docs/webhooks. Example walkthrough: /twitter-account-activity-api-example.",
      },
    ],
    related: [
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/twitter-account-activity-api", label: "Twitter Account Activity API guide" },
      { href: "/twitter-activity-api", label: "Twitter Activity API" },
      { href: "/twitter-slack-alerts", label: "Slack alerts" },
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
      "Twitter Activity API usually means Account Activity (AAA). Start free: monitor public accounts and read hits in the Dashboard — no enterprise contract.",
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
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/twitter-account-activity-api", label: "Account Activity API page" },
      { href: "/account-activity-api-alternative", label: "AAA alternative" },
      { href: "/twitter-slack-alerts", label: "Slack alerts" },
      { href: "/blog/webhook-vs-polling-twitter", label: "Webhook vs polling" },
    ],
  },
  {
    slug: "filtered-stream-alternative",
    path: "/filtered-stream-alternative",
    primaryKeyword: "twitter filtered stream alternative",
    title: "Twitter Filtered Stream Alternative — Account Monitors",
    description:
      "Need a Twitter filtered stream alternative for watching accounts? Free: 1 monitor and hit history. No official Pro stream required.",
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
    primaryKeyword: "twitter slack integration",
    title: "Twitter Slack Integration — Alerts via Incoming Webhook",
    description:
      "Twitter Slack integration / Slack Twitter integration: paste a Slack Incoming Webhook, test on Free, live hits on Starter. No custom Slack bot required.",
    keywords: [
      "connect slack to twitter",
      "twitter slack integration",
      "slack twitter integration",
      "twitter slack alerts",
      "slack to twitter",
      "twitter to slack webhook",
      "x slack webhook",
    ],
    badge: "Slack alerts",
    h1: "Connect Slack to Twitter: monitors → channel alerts",
    subtitle:
      "Want Slack Twitter integration without enterprise X APIs? Watch public @handles and post into a Slack channel. XFlux formats Slack Incoming Webhook payloads — or send signed JSON to your own bot. Also see /connect-slack-to-twitter.",
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
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/twitter-discord-alerts", label: "Discord alerts" },
      { href: "/blog/twitter-to-discord-alerts", label: "Discord Twitter guide (blog)" },
      { href: "/twitter-account-activity-api", label: "Account Activity API alternative" },
      { href: "/monitor-twitter-account-webhook", label: "Monitor → webhook" },
      { href: "/twitter-n8n-webhook", label: "n8n twitter webhook" },
      { href: "/blog/twitter-webhooks-account-alerts", label: "Webhook setup guide (blog)" },
      { href: "/docs/integrations/make", label: "Make.com guide" },
    ],
  },
  {
    slug: "twitter-n8n-webhook",
    path: "/twitter-n8n-webhook",
    primaryKeyword: "n8n twitter webhook",
    title: "n8n Twitter Webhook — XFlux Monitor Hits",
    description:
      "Connect X/Twitter account monitors to n8n. Test the Webhook node on the free plan; live monitor.hit events when you upgrade.",
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
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/docs/integrations/make", label: "Make.com (similar flow)" },
      { href: "/docs/webhooks", label: "Webhook signature docs" },
      { href: "/twitter-slack-alerts", label: "Slack alerts" },
      { href: "/twitter-webhook-nodejs", label: "Node.js webhook handler" },
      { href: "/blog/twitter-webhooks-account-alerts", label: "Webhook setup guide (blog)" },
    ],
  },
  {
    slug: "twitter-webhook-nodejs",
    path: "/twitter-webhook-nodejs",
    primaryKeyword: "twitter webhook nodejs",
    title: "Twitter Webhook in Node.js — Verify XFlux Signatures",
    description:
      "Handle Twitter/X account monitor webhooks in Node.js. Test HMAC verification on the free plan — Express example included.",
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
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/docs/webhooks", label: "Full webhook docs" },
      { href: "/docs/guides/nodejs", label: "Node.js API guide" },
      { href: "/twitter-n8n-webhook", label: "n8n path" },
      { href: "/monitor-twitter-account-webhook", label: "Monitor + webhook guide" },
      { href: "/blog/twitter-webhooks-account-alerts", label: "Webhook setup guide (blog)" },
    ],
  },
  {
    slug: "monitor-twitter-account-webhook",
    path: "/monitor-twitter-account-webhook",
    primaryKeyword: "monitor twitter account webhook",
    title: "Monitor Twitter Account → Webhook Alerts",
    description:
      "Monitor a Twitter/X account for free: 1 monitor and Dashboard hits. Save a webhook and test — live POSTs when you upgrade.",
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
      { href: "/twitter-account-activity-api", label: "Account Activity API alternative" },
      { href: "/twitter-slack-alerts", label: "Slack" },
      { href: "/twitter-discord-alerts", label: "Discord" },
      { href: "/blog/twitter-to-discord-alerts", label: "Discord Twitter guide (blog)" },
      { href: "/blog/twitter-webhooks-account-alerts", label: "Webhook setup guide (blog)" },
      { href: "/blog/twitter-account-monitor-webhook", label: "HMAC walkthrough" },
    ],
  },
  {
    slug: "twitter-crypto-signals",
    path: "/twitter-crypto-signals",
    primaryKeyword: "twitter crypto trading signals",
    title: "Twitter Crypto Trading Signals — Monitors & Alerts",
    description:
      "Twitter crypto trading signals without spreadsheet stalking: monitor KOLs and project accounts free, push Discord/Slack webhooks when you need live alerts.",
    keywords: [
      "twitter crypto trading signals",
      "free crypto signals twitter",
      "twitter crypto signals",
      "crypto trading signals twitter",
      "crypto kol twitter alerts",
    ],
    badge: "Crypto signals on X",
    h1: "Twitter crypto trading signals from account monitors",
    subtitle:
      "Most “free crypto signals Twitter” searches want timely posts from KOLs and projects — not a paid signal group. Watch public @handles, filter cashtags, alert Discord/Slack via Twitter webhooks.",
    registerSrc: "seo_crypto_signals",
    cards: [
      {
        title: "Watch named KOLs and projects",
        text: "Add monitors for influencers, deployers, and official project accounts — optional keyword filters for tickers.",
      },
      {
        title: "Free to validate",
        text: "1 monitor + Dashboard hit history on Free. Test webhooks before you pay for live delivery.",
      },
      {
        title: "Same key for search",
        text: "Discover candidates with search operators, then promote keepers to monitors — see /blog/track-crypto-kols-twitter-api.",
      },
    ],
    howTitle: "From signal hunt to alerts",
    steps: [
      {
        title: "Build a candidate list",
        text: "Search cashtags and narratives; shortlist accounts with falsifiable calls — not only engagement bait.",
      },
      {
        title: "Promote keepers to monitors",
        text: "One monitor per @handle. Cap how many you enable on day one.",
      },
      {
        title: "Route hits to Discord or Slack",
        text: "Paste a channel webhook or use Make/n8n. Hub: /twitter-webhook. Crypto use case: /use-cases/crypto-alerts.",
      },
    ],
    faqs: [
      {
        question: "Is this a free crypto signals Telegram group?",
        answer:
          "No. XFlux is a developer API and account monitor product. You choose which public X accounts to watch and where alerts go.",
      },
      {
        question: "Do monitors use API quota?",
        answer:
          "Background polling does not consume monthly API call quota. Search/timeline calls during discovery do.",
      },
      {
        question: "Where is the longer crypto KOL guide?",
        answer: "See /blog/track-crypto-kols-twitter-api and /signals/crypto.",
      },
    ],
    related: [
      { href: "/use-cases/crypto-alerts", label: "Crypto alerts use case" },
      { href: "/blog/track-crypto-kols-twitter-api", label: "Track crypto KOLs (blog)" },
      { href: "/twitter-discord-alerts", label: "Discord alerts" },
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/signals/crypto", label: "Live crypto signals digest" },
    ],
  },
  {
    slug: "twitter-webhook-python",
    path: "/twitter-webhook-python",
    primaryKeyword: "twitter webhook python",
    title: "Twitter Webhook in Python — Verify XFlux Signatures",
    description:
      "Handle Twitter/X account monitor webhooks in Python. Test HMAC verification on the free plan — Flask/FastAPI-friendly examples.",
    keywords: [
      "twitter webhook python",
      "python twitter webhook",
      "python twitter api v2",
      "verify twitter webhook hmac python",
      "x webhook flask",
    ],
    badge: "Python tutorial",
    h1: "Twitter webhook Python handler (signed monitor.hit POSTs)",
    subtitle:
      "Receive account-monitor alerts in Flask, FastAPI, or any WSGI/ASGI app. Verify X-XFlux-Signature over the raw body, then route to Discord, Slack, or your trading logic.",
    registerSrc: "seo_webhook_python",
    cards: [
      {
        title: "Raw body for HMAC",
        text: "Sign over `{timestamp}.{raw_body}`. Read request bytes before JSON parse — re-serializing breaks verification.",
      },
      {
        title: "compare_digest",
        text: "Use hmac.compare_digest for timing-safe signature checks.",
      },
      {
        title: "Pair with the read API",
        text: "Same key for /api/v1/search and timelines — Python guide: /docs/guides/python.",
      },
    ],
    howTitle: "Python setup",
    steps: [
      {
        title: "Expose HTTPS and create a monitor webhook",
        text: "ngrok for local tests. Copy the signing secret from Dashboard → Monitors.",
      },
      {
        title: "Verify headers then parse JSON",
        text: "Check X-XFlux-Timestamp skew (~5 minutes) and X-XFlux-Signature before trusting the body.",
      },
      {
        title: "Handle monitor.test and monitor.hit",
        text: "Test events validate wiring on Free; live hits need Starter+. Node users: /twitter-webhook-nodejs.",
      },
    ],
    codeTitle: "Flask verification sketch",
    codeBlurb: "Load the secret from env. Prefer a production ASGI stack when you scale.",
    code: `import hmac, hashlib, os, time
from flask import Flask, request, abort

app = Flask(__name__)
SECRET = os.environ["XFLUX_WEBHOOK_SECRET"].encode()

@app.post("/webhooks/xflux")
def xflux_webhook():
    ts = request.headers.get("X-XFlux-Timestamp", "")
    sig = request.headers.get("X-XFlux-Signature", "")
    raw = request.get_data()  # bytes
    if abs(time.time() - int(ts or "0")) > 300:
        abort(401)
    expected = "sha256=" + hmac.new(
        SECRET, f"{ts}.".encode() + raw, hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(expected, sig):
        abort(401)
    event = request.get_json(force=True)
    if event.get("event") == "monitor.hit":
        print(event["tweet"]["authorUsername"], event["tweet"]["text"])
    return "ok", 200`,
    faqs: [
      {
        question: "Is this official Twitter API v2?",
        answer:
          "No. XFlux is an independent read API + monitors. Python examples for REST reads are at /docs/guides/python; this page is webhook verification.",
      },
      {
        question: "Discord without Python?",
        answer:
          "Paste a Discord Incoming Webhook into the monitor — see /twitter-discord-alerts.",
      },
      {
        question: "Full header reference?",
        answer: "See /docs/webhooks and the hub at /twitter-webhook.",
      },
    ],
    related: [
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/twitter-webhook-nodejs", label: "Node.js handler" },
      { href: "/docs/guides/python", label: "Python API guide" },
      { href: "/docs/webhooks", label: "Webhook docs" },
      { href: "/blog/twitter-webhooks-account-alerts", label: "Webhooks playbook" },
    ],
  },
  {
    slug: "discord-twitter-bot",
    path: "/discord-twitter-bot",
    primaryKeyword: "discord twitter bot",
    title: "Discord Twitter Bot — Account Alerts Without DIY Polling",
    description:
      "Build a Discord Twitter bot workflow: monitor public @handles, push hits to Discord. Free test pings; live delivery on Starter — no timeline poller to host.",
    keywords: [
      "discord twitter bot",
      "twitter tracker discord bot",
      "discord twitter tracker bot",
      "twitter to discord bot",
      "discord twitter integration",
    ],
    badge: "Discord Twitter bot path",
    h1: "Discord Twitter bot alerts via account monitors",
    subtitle:
      "“Discord Twitter bot” usually means: track accounts → post into a channel. You can paste a Discord webhook into XFlux, or run a thin bot that verifies signed monitor.hit events — no DIY timeline cron.",
    registerSrc: "seo_discord_bot",
    cards: [
      {
        title: "Webhook-first (simplest)",
        text: "Discord Incoming Webhooks cover most “post appeared” alerts without a bot token.",
      },
      {
        title: "Bot when you need UX",
        text: "Use a bot token for slash commands, roles, or threads — still feed it from XFlux webhooks.",
      },
      {
        title: "Same monitors as Slack",
        text: "One monitor event can fan out to Discord and Slack. Hub: /twitter-webhook.",
      },
    ],
    howTitle: "Bot-style setup",
    steps: [
      {
        title: "Pick accounts to track",
        text: "Founders, exchanges, macro voices — promote from search if needed.",
      },
      {
        title: "Choose Incoming Webhook or custom bot",
        text: "Webhook URL on the monitor is enough for channel posts. Custom bot: verify HMAC then call Discord API.",
      },
      {
        title: "Test on Free, go live on Starter",
        text: "Walkthrough: /blog/twitter-to-discord-alerts. Product page: /twitter-discord-alerts.",
      },
    ],
    faqs: [
      {
        question: "Do I need to scrape Twitter for a Discord bot?",
        answer:
          "Not with XFlux monitors. We detect new public tweets on a schedule and POST to your webhook or server.",
      },
      {
        question: "Is this an official Discord Twitter integration?",
        answer:
          "No — it is your Discord server plus XFlux monitors. Discord and X remain separate products.",
      },
      {
        question: "Tracker bot vs channel webhook?",
        answer:
          "Channel webhooks are enough for alerts. Full “tracker bots” add UX; the data path is still monitor → HTTP.",
      },
    ],
    related: [
      { href: "/twitter-discord-alerts", label: "Discord alerts landing" },
      { href: "/blog/twitter-to-discord-alerts", label: "Discord Twitter guide (blog)" },
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/monitor-twitter-account", label: "Monitor a Twitter account" },
      { href: "/twitter-crypto-signals", label: "Crypto signals path" },
    ],
  },
  {
    slug: "twitter-search-api",
    path: "/twitter-search-api",
    primaryKeyword: "twitter search api",
    title: "Twitter Search API — Operators, Quotas & Monitors",
    description:
      "How to use a Twitter search API without enterprise approval: from:/since:/lang: operators, monthly quotas, and when to promote results to account monitors.",
    keywords: [
      "twitter search api",
      "how to use twitter search api",
      "twitter api search",
      "x api search",
      "twitter search operators",
    ],
    badge: "Search API",
    h1: "Twitter Search API for public posts (self-serve)",
    verdict:
      "XFlux GET /api/v1/search with from:/lang: operators. Free: 1,000 calls/mo. Always-on alerts → monitors.",
    subtitle:
      "Need a Twitter search API for research or agents? XFlux /api/v1/search accepts advanced operators. Pair search for discovery with monitors + webhooks for always-on alerts.",
    registerSrc: "seo_search_api",
    facts: [
      {
        heading: "Endpoint + operators",
        data: "GET /api/v1/search with q= (from:, lang:, quotes, OR). Operator sheet: /twitter-search-operators.",
      },
      {
        heading: "Quota",
        data: "Each successful search counts toward Free 1,000 calls/month — /docs/limits.",
      },
      {
        heading: "Search vs monitors",
        data: "Search = on-demand discovery. Promote recurring handles to /monitor-twitter-account + webhooks.",
      },
    ],
    cards: [
      {
        title: "Operators that matter",
        text: "from:user, since:/until:, lang:, filter:replies — same ideas as advanced search. Guide: /blog/twitter-api-search-operators.",
      },
      {
        title: "Quota-aware",
        text: "Each search counts against monthly API calls. Free includes 1,000/mo — see /docs/limits.",
      },
      {
        title: "Promote to monitors",
        text: "When a handle keeps producing signal, stop polling search — add a monitor and webhook.",
      },
    ],
    howTitle: "How to use Twitter search with XFlux",
    steps: [
      {
        title: "Create a key and call /api/v1/search",
        text: "Bearer auth. URL-encode q. Docs: /docs/guides/search and /docs/guides/python.",
      },
      {
        title: "Tighten the query",
        text: "Prefer from: + lang: + short windows over keyword soup.",
      },
      {
        title: "Graduate alerts off search",
        text: "Always-on account watches belong on monitors — /monitor-twitter-account and /twitter-webhook.",
      },
    ],
    codeTitle: "Minimal search call",
    code: `curl -G "https://www.xfluxapi.com/api/v1/search" \\
  -H "Authorization: Bearer xflux_YOUR_KEY" \\
  --data-urlencode "q=from:FederalReserve lang:en" \\
  --data-urlencode "limit=10"`,
    compareTitle: "Twitter Search API options",
    compareCols: { left: "Official X search products", right: "XFlux search" },
    compareRows: [
      { label: "Access", left: "App + tier limits", right: "Self-serve key, Free 1,000/mo" },
      { label: "Operators", left: "Product-dependent", right: "from:, lang:, quotes in q=" },
      { label: "Agents", left: "Official SDKs", right: "MCP xflux_search_tweets" },
      { label: "Always-on", left: "Streams / AAA", right: "Promote to monitors" },
    ],
    faqs: [
      {
        question: "How do I use a Twitter search API without enterprise approval?",
        answer:
          "Create a free XFlux key and call GET /api/v1/search with q=. Docs: /docs/guides/search.",
      },
      {
        question: "Is XFlux the official X API search?",
        answer:
          "No. Independent read API. Official packaging: /docs/compare/pricing.",
      },
      {
        question: "Can Claude or Cursor call the Twitter search API?",
        answer: "Yes — xflux_search_tweets via /mcp and /docs/integrations/mcp.",
      },
      {
        question: "Does Twitter search API cover private accounts?",
        answer: "No. Public data only.",
      },
    ],
    related: [
      { href: "/blog/twitter-api-search-operators", label: "Search operators (blog)" },
      { href: "/docs/guides/search", label: "Search docs" },
      { href: "/monitor-twitter-account", label: "Monitor accounts" },
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/docs/guides/python", label: "Python guide" },
    ],
  },
  {
    slug: "monitor-twitter-account",
    path: "/monitor-twitter-account",
    primaryKeyword: "monitor twitter account",
    title: "Monitor Twitter Account — Free Watch & Alerts",
    description:
      "Monitor Twitter account free: 1 @handle, keyword filters, Dashboard history. Add Discord, Slack, or HTTPS webhooks when you need push. Also covers twitter monitor crypto workflows.",
    keywords: [
      "monitor twitter",
      "monitor twitter account",
      "watch twitter account",
      "twitter account monitor",
      "track twitter account",
      "twitter monitor",
      "twitter monitor crypto",
    ],
    badge: "Account monitor",
    h1: "Monitor a Twitter account without building a poller",
    verdict:
      "Watch 1 public @handle free: keyword filters, Dashboard history. Live Discord/Slack/HTTPS webhooks from Starter ($19/mo).",
    subtitle:
      "Add a public @handle, optional keywords, and see new posts in the Dashboard. Free includes 1 monitor. Webhooks for Discord/Slack/HTTPS when you upgrade — details at /monitor-twitter-account-webhook.",
    registerSrc: "seo_monitor_account",
    facts: [
      {
        heading: "Free monitor quota",
        data: "1 active monitor on Free. Paid plans add slots and shorter poll intervals — /docs/limits.",
      },
      {
        heading: "Keyword filter behavior",
        data: "Hits only when the new public tweet text matches your keywords. Empty keywords = every new public tweet.",
      },
      {
        heading: "Push delivery",
        data: "Free: Test webhook + Dashboard. Starter+: live monitor.hit to Discord, Slack, or HTTPS. Hub: /twitter-webhook.",
      },
    ],
    cards: [
      {
        title: "Self-serve in minutes",
        text: "No enterprise AAA or filtered stream for a short account list.",
      },
      {
        title: "Keywords cut noise",
        text: "Only create hits when posts match tickers or phrases you care about.",
      },
      {
        title: "Push when ready",
        text: "Test webhooks on Free; live POSTs on Starter+. Hub: /twitter-webhook.",
      },
    ],
    howTitle: "Monitor setup",
    steps: [
      {
        title: "Create a free account",
        text: "Open Dashboard → Monitors and add @username.",
      },
      {
        title: "Run Check now once",
        text: "Baselines history so only newer tweets become hits.",
      },
      {
        title: "Attach a webhook if you need push",
        text: "Discord, Slack, Make, n8n, or Python/Node — see related guides below.",
      },
    ],
    compareTitle: "Monitor Twitter account options",
    compareCols: { left: "DIY poll + official API", right: "XFlux monitor" },
    compareRows: [
      { label: "Setup time", left: "App + cron + storage", right: "Dashboard → add @handle" },
      { label: "Free start", left: "Often card + limited free", right: "1 monitor, no card" },
      { label: "Slack/Discord push", left: "You wire it", right: "Paste webhook URL" },
      { label: "Read API included", left: "Separate product", right: "Same account, 1,000 calls/mo Free" },
    ],
    faqs: [
      {
        question: "How do I monitor a Twitter account for free?",
        answer:
          "Register → Dashboard → Monitors → add one @handle. Free includes 1 monitor and Dashboard hits.",
      },
      {
        question: "Is monitor Twitter different from Twitter search API?",
        answer:
          "Search is on-demand. Monitors are always-on for specific accounts. Search: /twitter-search-api.",
      },
      {
        question: "How many Twitter accounts can I monitor on Free?",
        answer: "One active monitor. Paid plans add more slots and faster intervals.",
      },
      {
        question: "Where is the monitor-to-webhook setup?",
        answer: "/monitor-twitter-account-webhook and /docs/monitors.",
      },
    ],
    related: [
      { href: "/monitor-twitter-account-webhook", label: "Monitor → webhook" },
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/twitter-crypto-signals", label: "Crypto signals path" },
      { href: "/discord-twitter-bot", label: "Discord Twitter bot" },
      { href: "/docs/monitors", label: "Monitor docs" },
      { href: "/free-x-api", label: "Free X API tier" },
    ],
  },
  {
    slug: "connect-slack-to-twitter",
    path: "/connect-slack-to-twitter",
    primaryKeyword: "connect slack to twitter",
    title: "Connect Slack to Twitter — How-To (Incoming Webhook)",
    description:
      "How to connect Slack to Twitter / Slack to Twitter alerts: create a Slack Incoming Webhook, attach it to an XFlux monitor, test free, go live on Starter.",
    keywords: [
      "connect slack to twitter",
      "slack to twitter",
      "slack twitter integration",
      "how to connect slack to twitter",
      "twitter to slack",
    ],
    badge: "Slack ← Twitter",
    h1: "How to connect Slack to Twitter account alerts",
    verdict:
      "X → Slack: Slack Incoming Webhook + XFlux monitor. Test free; live alerts on Starter ($19/mo).",
    subtitle:
      "Official X does not give you a simple “Slack when @handle tweets” switch. XFlux watches public accounts and POSTs into Slack Incoming Webhooks — free to test, live on Starter. Product overview: /twitter-slack-alerts.",
    registerSrc: "seo_connect_slack_twitter",
    facts: [
      {
        heading: "Slack side",
        data: "Use a Slack Incoming Webhook URL (channel-scoped). No custom Slack bot required for plain text alerts.",
      },
      {
        heading: "XFlux side",
        data: "One public @handle monitor + optional keywords. Free can send Test pings; live delivery needs Starter.",
      },
      {
        heading: "Direction of data",
        data: "Twitter/X → Slack only. This path does not post from Slack to X.",
      },
    ],
    cards: [
      {
        title: "No custom Slack bot required",
        text: "Incoming Webhooks are enough for channel text alerts. Use a bot only if you need Block Kit or threads.",
      },
      {
        title: "Keyword filters",
        text: "Alert only when posts mention tickers, product names, or macro phrases.",
      },
      {
        title: "Same stack as Discord / HTTPS",
        text: "One monitor model — swap the webhook URL for Discord or your server.",
      },
    ],
    howTitle: "Connect Slack in three steps",
    steps: [
      {
        title: "Create a Slack Incoming Webhook",
        text: "Slack → Apps → Incoming Webhooks → add to channel → copy URL.",
      },
      {
        title: "Create an XFlux monitor",
        text: "Register free → Dashboard → Monitors → add @username + optional keywords.",
      },
      {
        title: "Paste URL → Test → upgrade for live",
        text: "Free can send test pings. Starter ($19/mo) delivers when new matching tweets appear.",
      },
    ],
    compareTitle: "Connect Slack to Twitter paths",
    compareCols: { left: "Make.com / n8n only", right: "XFlux + Slack webhook" },
    compareRows: [
      { label: "Data source", left: "You still need X data", right: "Built-in account monitors" },
      { label: "Free test", left: "Depends on X connector", right: "Test ping on Free" },
      { label: "Live alert plan", left: "Platform + X costs", right: "Starter $19/mo" },
      { label: "Sheets / multi-step", left: "Strong", right: "Use Make on top — /docs/integrations/make" },
    ],
    faqs: [
      {
        question: "How do I connect Slack to Twitter for new-tweet alerts?",
        answer:
          "Create a Slack Incoming Webhook, add an XFlux monitor, paste the URL, click Test. Live alerts need Starter.",
      },
      {
        question: "Does connect Slack to Twitter post from Slack to X?",
        answer:
          "No. This path is X → Slack alerts only. XFlux does not post tweets.",
      },
      {
        question: "Should I use Make.com instead of a direct Slack webhook?",
        answer:
          "Direct Slack is simplest. Use Make when you need Sheets or filters — /docs/integrations/make.",
      },
      {
        question: "Where is the Twitter Slack product overview?",
        answer: "/twitter-slack-alerts and hub /twitter-webhook.",
      },
    ],
    related: [
      { href: "/twitter-slack-alerts", label: "Twitter Slack integration" },
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/twitter-discord-alerts", label: "Discord alerts" },
      { href: "/monitor-twitter-account", label: "Monitor Twitter" },
      { href: "/docs/webhooks", label: "Webhook docs" },
    ],
  },
  {
    slug: "twitter-search-operators",
    path: "/twitter-search-operators",
    primaryKeyword: "twitter search operators",
    title: "Twitter Search Operators — from:, lang: + API Examples",
    description:
      "Twitter search operators / twitter search operator cheat sheet: from:, lang:, quotes, OR. Run the same queries via XFlux search API — 1,000 free calls/month.",
    keywords: [
      "twitter search operators",
      "twitter search operator",
      "x search operators",
      "twitter advanced search operators",
      "how to use twitter search api",
    ],
    badge: "Search operators",
    h1: "Twitter search operators you can use in the XFlux API",
    verdict:
      "Use from:, lang:, quotes, OR in XFlux GET /api/v1/search. Free: 1,000 calls/month. MCP: xflux_search_tweets.",
    subtitle:
      "Advanced search operators still work for public tweet research. Use them in the XFlux /search endpoint (and MCP xflux_search_tweets). Free tier: 1,000 API calls/month. Full operator notes also in /docs/guides/search and /blog/twitter-api-search-operators.",
    registerSrc: "seo_search_operators",
    facts: [
      {
        heading: "Supported operator examples",
        data: 'from:handle, lang:en, "exact phrase", OR, -exclude — passed as q= on GET /api/v1/search.',
      },
      {
        heading: "Quota",
        data: "Each successful search counts toward Free 1,000 calls/month (same pool as profiles and timelines).",
      },
      {
        heading: "When to use monitors instead",
        data: "Always-on @account watches belong on /monitor-twitter-account, not a cron that polls search.",
      },
    ],
    cards: [
      {
        title: "Same operator grammar",
        text: "from:handle, lang:en, quoted phrases, OR, -exclude — pass as q= on GET /api/v1/search.",
      },
      {
        title: "Agent-friendly",
        text: "Claude/Cursor can call search via @xflux/xflux-mcp-server — see /mcp.",
      },
      {
        title: "When operators are not enough",
        text: "For always-on @account watches, use monitors instead of polling search — /monitor-twitter-account.",
      },
    ],
    howTitle: "Try operators in three steps",
    steps: [
      {
        title: "Get a free API key",
        text: "Register → Dashboard → API Keys. No credit card on Free.",
      },
      {
        title: "Call search with operators",
        text: 'Example: q=from:elonmusk lang:en or q="fed rate" lang:en',
      },
      {
        title: "Automate or monitor",
        text: "Scripts/MCP for on-demand research; monitors for push alerts.",
      },
    ],
    codeTitle: "curl example",
    codeBlurb: "Replace the key. Operators go in the q parameter.",
    code: `curl -G "https://www.xfluxapi.com/api/v1/search" \\
  --data-urlencode 'q=from:elonmusk lang:en' \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`,
    compareTitle: "Twitter search operators — UI vs API",
    compareCols: { left: "X.com advanced search UI", right: "XFlux /search + operators" },
    compareRows: [
      { label: "Operators", left: "from:, lang:, quotes", right: "Same grammar in q=" },
      { label: "Automation", left: "Manual", right: "curl, Node, MCP" },
      { label: "Free quota", left: "N/A (UI)", right: "1,000 API calls/mo" },
      { label: "Always-on alerts", left: "No", right: "Use monitors, not search" },
    ],
    faqs: [
      {
        question: "Which Twitter search operators work in the XFlux API?",
        answer:
          'Common ones: from:, lang:, quotes, OR, -exclude. Pass them in q= on GET /api/v1/search.',
      },
      {
        question: "Is this the official X advanced search API?",
        answer:
          "No. Operators match public search grammar. XFlux is an independent read API.",
      },
      {
        question: "Where is the full Twitter search operator list?",
        answer: "Docs: /docs/guides/search. Blog: /blog/twitter-api-search-operators.",
      },
      {
        question: "Should I use search operators or monitors for one @handle?",
        answer:
          "On-demand research → search. Continuous alerts → /monitor-twitter-account.",
      },
    ],
    related: [
      { href: "/twitter-search-api", label: "Twitter Search API" },
      { href: "/docs/guides/search", label: "Search docs" },
      { href: "/blog/twitter-api-search-operators", label: "Operators blog" },
      { href: "/free-x-api", label: "Free X API" },
      { href: "/mcp", label: "MCP for agents" },
    ],
  },
  {
    slug: "free-x-api",
    path: "/free-x-api",
    primaryKeyword: "free x api",
    title: "X API Free — Free X API Key, 1,000 Calls, No Card",
    description:
      "X API free / free X API / Twitter API free: 1,000 calls/month, free X API key, 1 monitor — no credit card. Profiles, search, timelines. Live webhooks on Starter.",
    keywords: [
      "free x api",
      "x api free",
      "twitter api free",
      "free twitter api",
      "x api key free",
      "free x api key",
      "x api free tier",
      "x free api",
      "api twitter free",
    ],
    badge: "Free tier",
    h1: "X API free — key with no credit card",
    verdict:
      "XFlux Free: 1,000 API calls/month, 1 monitor, no card. Read-only public X/Twitter data.",
    subtitle:
      "For x api free / free x api / twitter api free searches. Same key works for REST and MCP (`@xflux/xflux-mcp-server`). Live signed webhooks start on Starter ($19/mo). Pricing detail: /docs/compare/pricing.",
    registerSrc: "seo_free_x_api",
    facts: [
      {
        heading: "Quota on Free",
        data: "1,000 successful REST or MCP calls per month; quota resets on your account cycle. Plan table: /docs/limits.",
      },
      {
        heading: "What the key can call",
        data: "GET profiles, timelines, tweet-by-id, and search on https://www.xfluxapi.com/api/v1 — public accounts only.",
      },
      {
        heading: "Monitor included",
        data: "1 active account monitor with hits in the Dashboard. Free can send Test webhook pings; live monitor.hit POSTs need Starter+.",
      },
    ],
    cards: [
      {
        title: "Instant API key",
        text: "Register → copy key → call /users, /search, /tweets. Same key for MCP.",
      },
      {
        title: "1 free monitor",
        text: "Watch one public @handle; see hits in Dashboard. Test webhooks before upgrading.",
      },
      {
        title: "Limits",
        text: "Not an official X firehose. Read-only public data. Flat plans — not pay-per-tweet.",
      },
    ],
    howTitle: "Start free in minutes",
    steps: [
      {
        title: "Create an account",
        text: "No credit card on Free. Get the key from Dashboard → API Keys.",
      },
      {
        title: "Hit the read API or MCP",
        text: "REST at /api/v1 or npx @xflux/xflux-mcp-server for Claude/Cursor.",
      },
      {
        title: "Add a monitor when ready",
        text: "Upgrade only if you need live webhook delivery or more quota/monitors.",
      },
    ],
    compareTitle: "Free X API options",
    compareBlurb:
      "Official X free/basic tiers change often. XFlux Free is for read + one monitor.",
    compareCols: { left: "Official X (typical free/basic)", right: "XFlux Free" },
    compareRows: [
      { label: "Card required", left: "Often yes for useful tiers", right: "No" },
      { label: "Read profiles/search", left: "Varies / restricted", right: "Yes — 1,000 calls/mo" },
      { label: "Account monitor", left: "Not on free DIY", right: "1 monitor + Dashboard hits" },
      { label: "Live webhooks", left: "Enterprise AAA / streams", right: "Starter+ ($19/mo)" },
      { label: "MCP package", left: "Community wrappers", right: "@xflux/xflux-mcp-server" },
    ],
    codeTitle: "Smoke test",
    code: `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  https://www.xfluxapi.com/api/v1/users/elonmusk`,
    faqs: [
      {
        question: "Is XFlux the official free X API?",
        answer:
          "No. It is an independent read API. Official tiers: developer.x.com. Comparison: /docs/compare/pricing.",
      },
      {
        question: "How many free X API calls do I get with no card?",
        answer: "1,000 calls per month on Free, plus 1 monitor. MCP uses the same quota.",
      },
      {
        question: "Can I get a free X API key for Claude or Cursor?",
        answer:
          "Yes. Create a key, then install `@xflux/xflux-mcp-server`. Steps: /mcp.",
      },
      {
        question: "Does Free include live Slack or Discord webhooks?",
        answer:
          "Free supports Test pings and Dashboard hits. Live monitor.hit delivery starts on Starter.",
      },
    ],
    related: [
      { href: "/blog/twitter-api-free-tier", label: "Free tier blog" },
      { href: "/pricing", label: "Pricing" },
      { href: "/docs/compare/pricing", label: "vs official pricing" },
      { href: "/twitter-search-api", label: "Search API" },
      { href: "/monitor-twitter-account", label: "Monitor Twitter" },
      { href: "/mcp", label: "MCP" },
    ],
  },
  {
    slug: "twitter-timeline-api",
    path: "/twitter-timeline-api",
    primaryKeyword: "twitter timeline api",
    title: "Twitter Timeline API — User Tweets by @handle",
    description:
      "Twitter timeline API for a public @handle: GET /users/:username/tweets. Free XFlux key, 1,000 calls/month, no card. Same read in MCP as xflux_get_user_tweets.",
    keywords: [
      "twitter timeline api",
      "x timeline api",
      "get user tweets api",
      "twitter user timeline api",
      "fetch twitter timeline",
    ],
    badge: "User timeline",
    h1: "Twitter timeline API for one public account",
    verdict:
      "GET /api/v1/users/:username/tweets for public timelines. Free: 1,000 calls/mo. MCP: xflux_get_user_tweets.",
    subtitle:
      "Pull recent public tweets for an @handle without the official X user-timeline product. One GET on XFlux, or the MCP tool xflux_get_user_tweets. Free tier: 1,000 calls/month. Always-on watches belong on monitors, not a polling loop.",
    registerSrc: "seo_timeline_api",
    facts: [
      {
        heading: "Endpoint",
        data: "GET https://www.xfluxapi.com/api/v1/users/:username/tweets?limit=10 — public accounts only.",
      },
      {
        heading: "Quota",
        data: "Shares Free 1,000 calls/month with profiles and search. Monitor polling is separate.",
      },
      {
        heading: "Push vs pull",
        data: "For every new tweet to Slack/HTTPS, use /monitor-twitter-account instead of cron + timeline.",
      },
    ],
    cards: [
      {
        title: "One handle, one call",
        text: "GET /api/v1/users/:username/tweets?limit=10 returns compact public tweets for that account.",
      },
      {
        title: "Same key as search and profiles",
        text: "Timelines, lookup, and search share the monthly quota. Monitor polling does not.",
      },
      {
        title: "Agents use the MCP tool",
        text: "Claude and Cursor call xflux_get_user_tweets. Install: /mcp.",
      },
    ],
    howTitle: "Fetch a timeline",
    steps: [
      {
        title: "Create a free key",
        text: "Register → Dashboard → API Keys. No credit card on Free.",
      },
      {
        title: "GET the username path",
        text: "Example: /api/v1/users/FederalReserve/tweets?limit=10",
      },
      {
        title: "Switch to a monitor for alerts",
        text: "If you need every new post pushed to Slack or HTTPS, use /monitor-twitter-account instead of cron + timeline.",
      },
    ],
    codeTitle: "curl",
    codeBlurb: "Public accounts only. limit caps how many tweets come back.",
    code: `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  "https://www.xfluxapi.com/api/v1/users/FederalReserve/tweets?limit=10"`,
    faqs: [
      {
        question: "Is this the official X user timeline endpoint?",
        answer:
          "No. XFlux is an independent read API. The path is /api/v1/users/:username/tweets on www.xfluxapi.com.",
      },
      {
        question: "Private or protected accounts?",
        answer: "Public posts only. Protected accounts are not available.",
      },
      {
        question: "Timeline vs search?",
        answer:
          "Timeline is one account’s recent posts. Search is a query (from:, lang:, phrases) across public tweets — see /twitter-search-api.",
      },
    ],
    related: [
      { href: "/twitter-user-lookup", label: "User lookup API" },
      { href: "/twitter-search-api", label: "Search API" },
      { href: "/docs/api", label: "API reference" },
      { href: "/free-x-api", label: "Free X API" },
      { href: "/mcp", label: "MCP" },
    ],
  },
  {
    slug: "twitter-user-lookup",
    path: "/twitter-user-lookup",
    primaryKeyword: "twitter user lookup api",
    title: "Twitter User Lookup API — Profile by @username",
    description:
      "Look up a public X/Twitter profile by username. GET /users/:username with a free XFlux key — name, bio, counts. No posting, no card on Free.",
    keywords: [
      "twitter user lookup api",
      "get twitter user by username",
      "x user lookup api",
      "twitter profile api",
      "twitter user api",
    ],
    badge: "User lookup",
    h1: "Twitter user lookup API by @username",
    verdict:
      "GET /api/v1/users/:username for public profiles. Free: 1,000 calls/mo, no card. MCP: xflux_get_user.",
    subtitle:
      "Resolve a public profile before you pull a timeline or add a monitor. XFlux GET /api/v1/users/:username returns a compact profile. Free: 1,000 calls/month, no credit card. MCP tool: xflux_get_user.",
    registerSrc: "seo_user_lookup",
    facts: [
      {
        heading: "Endpoint",
        data: "GET https://www.xfluxapi.com/api/v1/users/:username — name, bio, public counts.",
      },
      {
        heading: "Quota",
        data: "Counts toward Free 1,000 calls/month with timelines and search.",
      },
      {
        heading: "Next step",
        data: "Same key → /users/:username/tweets or Dashboard monitor for that handle.",
      },
    ],
    cards: [
      {
        title: "Username, not a numeric id dance",
        text: "Pass the @handle. You do not need a separate id lookup to read the public profile.",
      },
      {
        title: "Then timeline or monitor",
        text: "Same key calls /users/:username/tweets or creates a Dashboard monitor for that handle.",
      },
      {
        title: "Read-only",
        text: "Lookup does not follow, post, or DM. Public data only.",
      },
    ],
    howTitle: "Look up a profile",
    steps: [
      {
        title: "Get a free API key",
        text: "Dashboard → API Keys. Details: /free-x-api.",
      },
      {
        title: "GET /api/v1/users/:username",
        text: "Example: /api/v1/users/x",
      },
      {
        title: "Use the handle downstream",
        text: "Timeline: /twitter-timeline-api. Alerts: /monitor-twitter-account.",
      },
    ],
    codeTitle: "curl",
    code: `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  https://www.xfluxapi.com/api/v1/users/x`,
    faqs: [
      {
        question: "Does this return followers or following lists?",
        answer:
          "No. This call is the public profile summary. It is not a followers, following, or list endpoint.",
      },
      {
        question: "Official X user lookup?",
        answer:
          "No. XFlux is independent. Compare pricing at /docs/compare/pricing.",
      },
      {
        question: "Can an agent call this?",
        answer: "Yes. Tool name xflux_get_user. Setup: /mcp.",
      },
    ],
    related: [
      { href: "/twitter-timeline-api", label: "Timeline API" },
      { href: "/docs/api", label: "API reference" },
      { href: "/free-x-api", label: "Free X API" },
      { href: "/monitor-twitter-account", label: "Monitor Twitter" },
      { href: "/mcp", label: "MCP" },
    ],
  },
  {
    slug: "verify-twitter-webhook",
    path: "/verify-twitter-webhook",
    primaryKeyword: "verify twitter webhook signature",
    title: "Verify Twitter Webhook Signatures — HMAC-SHA256",
    description:
      "Verify XFlux monitor webhooks: HMAC-SHA256 over timestamp.rawBody, header x-xflux-signature, reject payloads older than 5 minutes. Not official X CRC.",
    keywords: [
      "verify twitter webhook signature",
      "twitter webhook hmac",
      "xflux webhook signature",
      "verify twitter webhook",
      "hmac sha256 twitter webhook",
    ],
    badge: "Webhook signatures",
    h1: "Verify a Twitter account-alert webhook signature",
    subtitle:
      "XFlux signs live monitor webhooks so your server can reject forgeries. Compute HMAC-SHA256 over {timestamp}.{raw body} and compare to x-xflux-signature. This is not official X Account Activity CRC. Discord and Slack Incoming Webhooks do not use this header.",
    registerSrc: "seo_verify_webhook",
    cards: [
      {
        title: "Raw body, then JSON",
        text: "Hash the exact bytes you received. Parsing JSON first changes the string and breaks the signature.",
      },
      {
        title: "Five-minute window",
        text: "Header x-xflux-timestamp is unix seconds. Reject if it is more than 300 seconds from now.",
      },
      {
        title: "HTTPS endpoints only",
        text: "Slack and Discord URLs are formatted for those apps. Custom servers use the signed JSON and this check.",
      },
    ],
    howTitle: "Check a delivery",
    steps: [
      {
        title: "Copy the webhook secret",
        text: "Dashboard → the monitor’s webhook secret. Starter+ sends live hits; Free can send a test ping.",
      },
      {
        title: "Read the two headers",
        text: "x-xflux-timestamp and x-xflux-signature (value starts with sha256=).",
      },
      {
        title: "Compare in constant time",
        text: "Expected digest is HMAC-SHA256 of timestamp + \".\" + raw body. Deduplicate on tweet id + monitor id.",
      },
    ],
    codeTitle: "Node check",
    codeBlurb: "Full Express example: /docs/webhooks. Python: /twitter-webhook-python.",
    code: `import crypto from "crypto";

const expected = "sha256=" + crypto
  .createHmac("sha256", secret)
  .update(\`\${timestamp}.\${rawBody}\`)
  .digest("hex");

const ok = crypto.timingSafeEqual(
  Buffer.from(expected),
  Buffer.from(signatureHeader)
);`,
    faqs: [
      {
        question: "Is this the official X CRC challenge?",
        answer:
          "No. Official Account Activity API uses a CRC handshake. XFlux uses HMAC-SHA256 on monitor.hit POSTs. See /twitter-account-activity-api.",
      },
      {
        question: "Do Slack and Discord need this?",
        answer:
          "No. Those URLs get an app-specific body. Verify HMAC on your own HTTPS endpoint.",
      },
      {
        question: "Where is the secret?",
        answer: "On the monitor in the Dashboard. Reference: /docs/webhooks.",
      },
    ],
    related: [
      { href: "/docs/webhooks", label: "Webhook docs" },
      { href: "/twitter-webhook-nodejs", label: "Node.js webhook" },
      { href: "/twitter-webhook-python", label: "Python webhook" },
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/monitor-twitter-account", label: "Monitor Twitter" },
    ],
  },
  {
    slug: "webhooks-twitter-integration",
    path: "/webhooks-twitter-integration",
    primaryKeyword: "webhooks twitter integration",
    title: "Webhooks Twitter Integration — Account Alerts",
    description:
      "Webhooks Twitter integration for public @accounts: signed HTTP POSTs to Discord, Slack, or your server. Free to test; live monitor.hit on Starter. Not official AAA.",
    keywords: [
      "webhooks twitter integration",
      "twitter webhook integration",
      "twitter webhook",
      "twitter webhooks",
      "x webhook integration",
    ],
    badge: "Webhooks Twitter",
    h1: "Webhooks Twitter integration for new-tweet alerts",
    verdict:
      "Public @accounts → signed HTTP POSTs (Discord, Slack, HTTPS). Test free; live monitor.hit on Starter.",
    subtitle:
      "People searching “webhooks twitter integration” usually want: when these public accounts post, POST to my URL. That is XFlux monitors — not enterprise Account Activity API. Hub overview: /twitter-webhook.",
    registerSrc: "seo_webhooks_twitter_integration",
    facts: [
      {
        heading: "Event type",
        data: "monitor.hit when a watched public account posts (optional keyword match). Not official AAA CRC.",
      },
      {
        heading: "Signature",
        data: "HMAC-SHA256 over timestamp.rawBody for custom HTTPS — /verify-twitter-webhook.",
      },
      {
        heading: "Plans",
        data: "Free: Test ping + Dashboard. Starter $19/mo+: live signed delivery.",
      },
    ],
    cards: [
      {
        title: "Same job as “Twitter webhook”",
        text: "Watch @handles, optional keywords, deliver monitor.hit to Discord, Slack, Make, n8n, or HTTPS.",
      },
      {
        title: "Verify on your server",
        text: "HMAC-SHA256 over timestamp.rawBody — see /verify-twitter-webhook.",
      },
      {
        title: "Free wiring, paid live push",
        text: "Free: Test ping + Dashboard hits. Starter+: live signed delivery.",
      },
    ],
    howTitle: "Wire webhooks Twitter integration",
    steps: [
      {
        title: "Create a free account",
        text: "Dashboard → Monitors → add a public @username.",
      },
      {
        title: "Paste a webhook URL",
        text: "Discord, Slack Incoming Webhook, or your HTTPS endpoint.",
      },
      {
        title: "Test, then go live",
        text: "Click Test webhook. Upgrade to Starter when you need live hits.",
      },
    ],
    compareTitle: "Webhooks Twitter integration options",
    compareCols: { left: "Official AAA / streams", right: "XFlux monitors" },
    compareRows: [
      { label: "Access", left: "Enterprise", right: "Self-serve Free → Starter" },
      { label: "Scope", left: "Full activity catalog", right: "New public tweets" },
      { label: "Verify", left: "CRC + X signatures", right: "HMAC on custom HTTPS" },
      { label: "Slack/Discord", left: "You build", right: "Paste webhook URL" },
    ],
    faqs: [
      {
        question: "How do I set up webhooks Twitter integration for account alerts?",
        answer:
          "Add a monitor, paste Discord/Slack/HTTPS URL, click Test. Live hits need Starter. Hub: /twitter-webhook.",
      },
      {
        question: "Is this the official X webhooks Twitter product?",
        answer:
          "No. Official AAA/streams are enterprise. This is an independent monitor + webhook path.",
      },
      {
        question: "How do I verify Twitter webhook signatures on my server?",
        answer: "HMAC-SHA256 over timestamp.rawBody — /verify-twitter-webhook.",
      },
      {
        question: "Where are Node and Python webhook samples?",
        answer: "Node: /twitter-webhook-nodejs. Python: /twitter-webhook-python. Docs: /docs/webhooks.",
      },
    ],
    related: [
      { href: "/twitter-webhook", label: "Twitter webhook hub" },
      { href: "/blog/twitter-webhooks-account-alerts", label: "Webhook blog guide" },
      { href: "/twitter-slack-alerts", label: "Slack alerts" },
      { href: "/verify-twitter-webhook", label: "Verify signatures" },
      { href: "/docs/webhooks", label: "Webhook docs" },
    ],
  },
  {
    slug: "twitter-account-activity-api-example",
    path: "/twitter-account-activity-api-example",
    primaryKeyword: "twitter account activity api example",
    title: "Twitter Account Activity API Example — Monitor Setup",
    description:
      "Twitter Account Activity API example without enterprise AAA: add a public @handle, optional keywords, Test webhook, then live Slack/Discord/HTTPS on Starter.",
    keywords: [
      "twitter account activity api example",
      "account activity api example",
      "twitter aaa example",
      "account activity api twitter example",
      "x account activity webhook example",
    ],
    badge: "AAA-style example",
    h1: "Twitter Account Activity API example (practical path)",
    verdict:
      "Example: Free monitor on a public @handle → Slack/Discord Test webhook → Starter for live POSTs. No AAA CRC.",
    subtitle:
      "Official AAA examples assume enterprise access and CRC. If you only need “when @handle tweets, call my webhook,” this walkthrough uses XFlux monitors — product overview at /twitter-account-activity-api.",
    registerSrc: "seo_aaa_example",
    facts: [
      {
        heading: "Example stack",
        data: "Free account → 1 monitor (e.g. @FederalReserve) → Slack Incoming Webhook → Test → Starter for live.",
      },
      {
        heading: "No CRC",
        data: "You do not implement X Account Activity CRC. Custom HTTPS uses HMAC — /verify-twitter-webhook.",
      },
      {
        heading: "Backfill",
        data: "Same API key pulls timelines/search while monitors cover always-on alerts.",
      },
    ],
    cards: [
      {
        title: "Example stack",
        text: "Free account → 1 monitor on @FederalReserve (or your KOL) → Slack Incoming Webhook URL → Test → upgrade for live.",
      },
      {
        title: "No CRC handshake",
        text: "You do not implement X’s Account Activity CRC. Custom servers verify HMAC instead — /verify-twitter-webhook.",
      },
      {
        title: "Same key for backfill",
        text: "Pull timeline/search with the REST API while monitors cover always-on alerts.",
      },
    ],
    howTitle: "Copy this example",
    steps: [
      {
        title: "Register and open Monitors",
        text: "No card on Free. Create an API key if you also want REST/MCP.",
      },
      {
        title: "Add @username + keywords (optional)",
        text: 'Example keywords: "rate", "FOMC", "CPI". Leave empty to alert on every new public tweet.',
      },
      {
        title: "Attach webhook and click Test",
        text: "Paste Discord/Slack/HTTPS. Confirm the test payload. Starter unlocks live monitor.hit.",
      },
    ],
    codeTitle: "Optional: backfill with timeline after a hit",
    code: `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  "https://www.xfluxapi.com/api/v1/users/FederalReserve/tweets?limit=5"`,
    faqs: [
      {
        question: "What is a practical Twitter Account Activity API example without enterprise access?",
        answer:
          "Add a public @handle monitor, paste Slack/Discord URL, click Test. Live POSTs need Starter. No AAA CRC.",
      },
      {
        question: "Does this replace official AAA code samples?",
        answer:
          "No. It covers the alert job when you cannot get AAA. Official CRC docs stay on X enterprise.",
      },
      {
        question: "Where is the longer AAA comparison?",
        answer: "/twitter-account-activity-api and /account-activity-api-alternative.",
      },
      {
        question: "Where are Slack-specific Account Activity-style steps?",
        answer: "/connect-slack-to-twitter.",
      },
    ],
    related: [
      { href: "/twitter-account-activity-api", label: "Account Activity API page" },
      { href: "/account-activity-api-alternative", label: "AAA alternative" },
      { href: "/connect-slack-to-twitter", label: "Slack how-to" },
      { href: "/verify-twitter-webhook", label: "Verify signatures" },
      { href: "/docs/webhooks", label: "Webhook docs" },
    ],
  },
  {
    slug: "twitter-api-nodejs",
    path: "/twitter-api-nodejs",
    primaryKeyword: "node twitter api",
    title: "Node Twitter API — Profiles, Search & Timelines",
    description:
      "Node Twitter API / Twitter API Node.js: fetch profiles, timelines, and search with fetch + Bearer key. Free 1,000 calls/month. Webhook verify guide separate.",
    keywords: [
      "node twitter api",
      "twitter api nodejs",
      "twitter api node.js",
      "nodejs twitter api",
      "x api nodejs",
    ],
    badge: "Node.js",
    h1: "Node Twitter API for public read data",
    verdict:
      "Node fetch + Bearer key → profiles, timelines, search on XFlux. Free: 1,000 calls/mo. Webhooks: /twitter-webhook-nodejs.",
    subtitle:
      "Call XFlux from Node with fetch: profiles, timelines, search. Same free tier as curl. For monitor webhooks in Express, see /twitter-webhook-nodejs. Longer guide: /docs/guides/nodejs.",
    registerSrc: "seo_twitter_api_nodejs",
    facts: [
      {
        heading: "Base URL",
        data: "https://www.xfluxapi.com/api/v1 with Authorization: Bearer xflux_…",
      },
      {
        heading: "Free quota",
        data: "1,000 successful calls/month. Not for posting or DMs.",
      },
      {
        heading: "Webhook path",
        data: "Express HMAC verify for monitors: /twitter-webhook-nodejs. Full guide: /docs/guides/nodejs.",
      },
    ],
    cards: [
      {
        title: "Bearer key, JSON responses",
        text: "Authorization: Bearer xflux_… against https://www.xfluxapi.com/api/v1.",
      },
      {
        title: "No official X app approval",
        text: "Self-serve key for public reads. Not for posting or DMs.",
      },
      {
        title: "Agents can use MCP instead",
        text: "npx @xflux/xflux-mcp-server — /mcp.",
      },
    ],
    howTitle: "Minimal Node example",
    steps: [
      {
        title: "Get a free key",
        text: "Register → Dashboard → API Keys. Details: /free-x-api.",
      },
      {
        title: "fetch a profile or search",
        text: "Use the snippet below. Count each successful call against the monthly quota.",
      },
      {
        title: "Add webhooks when you need push",
        text: "Monitors + Express verify: /twitter-webhook-nodejs.",
      },
    ],
    codeTitle: "fetch profile",
    code: `const key = process.env.XFLUX_API_KEY;
const res = await fetch("https://www.xfluxapi.com/api/v1/users/x", {
  headers: { Authorization: \`Bearer \${key}\` },
});
const user = await res.json();
console.log(user);`,
    faqs: [
      {
        question: "Is this the official twitter-api-v2 Node SDK?",
        answer:
          "No. This is the XFlux HTTP API from Node. Official X SDKs talk to developer.x.com products.",
      },
      {
        question: "Python too?",
        answer: "Yes — /docs/guides/python and /twitter-webhook-python.",
      },
      {
        question: "Rate limits?",
        answer: "/docs/limits — Free is 1,000 calls/month.",
      },
    ],
    related: [
      { href: "/docs/guides/nodejs", label: "Node.js guide" },
      { href: "/twitter-webhook-nodejs", label: "Node webhook verify" },
      { href: "/free-x-api", label: "Free X API" },
      { href: "/twitter-timeline-api", label: "Timeline API" },
      { href: "/twitter-search-api", label: "Search API" },
    ],
  },
];

export function getLongTailLanding(slug: string): LongTailLanding | undefined {
  return LONG_TAIL_LANDINGS.find((p) => p.slug === slug);
}

export const LONG_TAIL_SLUGS = LONG_TAIL_LANDINGS.map((p) => p.slug);
