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
    title: "Twitter Account Activity API Alternative — Free Monitor",
    description:
      "Twitter Account Activity API alternative without enterprise AAA. Free: 1 monitor + Dashboard hits. Live signed webhooks on Starter for Discord, Slack, or HTTPS.",
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
    title: "Connect Slack to Twitter — Alerts via Webhook",
    description:
      "Connect Slack to Twitter for account alerts: paste a Slack Incoming Webhook, test on Free, live hits on Starter. Twitter Slack integration without a custom bot.",
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
    subtitle:
      "Need a Twitter search API for research or agents? XFlux /api/v1/search accepts advanced operators. Pair search for discovery with monitors + webhooks for always-on alerts.",
    registerSrc: "seo_search_api",
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
    faqs: [
      {
        question: "Is this official X API search?",
        answer:
          "No. XFlux is an independent read API. Official access and packaging differ — see /docs/compare/pricing.",
      },
      {
        question: "MCP for agents?",
        answer: "Yes — xflux_search_tweets via /mcp and /docs/integrations/mcp.",
      },
      {
        question: "Private accounts?",
        answer: "Public data only.",
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
    title: "Monitor Twitter — Free Account Watch & Alerts",
    description:
      "Monitor Twitter/X accounts free: 1 monitor, keyword filters, Dashboard history. Add Discord, Slack, or HTTPS webhooks when you need push alerts.",
    keywords: [
      "monitor twitter",
      "monitor twitter account",
      "watch twitter account",
      "twitter account monitor",
      "track twitter account",
      "twitter monitor",
    ],
    badge: "Account monitor",
    h1: "Monitor Twitter accounts without building a poller",
    subtitle:
      "Add a public @handle, optional keywords, and see new posts in the Dashboard. Free includes 1 monitor. Webhooks for Discord/Slack/HTTPS when you upgrade — details at /monitor-twitter-account-webhook.",
    registerSrc: "seo_monitor_account",
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
    faqs: [
      {
        question: "How is this different from search?",
        answer:
          "Search is on-demand. Monitors are always-on watches for specific accounts. See /twitter-search-api.",
      },
      {
        question: "How many monitors on Free?",
        answer: "One active monitor. Paid plans add more slots and faster intervals.",
      },
      {
        question: "Webhook deep-dive?",
        answer: "Use /monitor-twitter-account-webhook and /docs/monitors.",
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
    title: "Connect Slack to Twitter — How-To for Alerts",
    description:
      "How to connect Slack to Twitter for new-tweet alerts: create a Slack Incoming Webhook, attach it to an XFlux monitor, test free, go live on Starter.",
    keywords: [
      "connect slack to twitter",
      "slack to twitter",
      "slack twitter integration",
      "how to connect slack to twitter",
      "twitter to slack",
    ],
    badge: "Slack ← Twitter",
    h1: "How to connect Slack to Twitter account alerts",
    subtitle:
      "Official X does not give you a simple “Slack when @handle tweets” switch. XFlux watches public accounts and POSTs into Slack Incoming Webhooks — free to test, live on Starter. Product overview: /twitter-slack-alerts.",
    registerSrc: "seo_connect_slack_twitter",
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
    faqs: [
      {
        question: "Does this post to Twitter from Slack?",
        answer:
          "No — this path is Twitter/X → Slack alerts (read + notify). XFlux is a read API + monitors, not a posting bot.",
      },
      {
        question: "Slack vs Make.com?",
        answer:
          "Direct Slack webhook is simplest. Make.com if you need Sheets/filters — see /docs/integrations/make.",
      },
      {
        question: "Related Twitter webhook hub?",
        answer: "See /twitter-webhook and /twitter-slack-alerts.",
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
    title: "Twitter Search Operators — Cheat Sheet + API",
    description:
      "Twitter search operators (from:, lang:, quotes, OR) with copy-paste examples. Run the same queries via XFlux search API — 1,000 free calls/month.",
    keywords: [
      "twitter search operators",
      "twitter search operator",
      "x search operators",
      "twitter advanced search operators",
      "how to use twitter search api",
    ],
    badge: "Search operators",
    h1: "Twitter search operators you can use in the XFlux API",
    subtitle:
      "Advanced search operators still work for public tweet research. Use them in the XFlux /search endpoint (and MCP xflux_search_tweets). Free tier: 1,000 API calls/month. Full operator notes also in /docs/guides/search and /blog/twitter-api-search-operators.",
    registerSrc: "seo_search_operators",
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
    faqs: [
      {
        question: "Is this official X advanced search?",
        answer:
          "Operators match common public search grammar. XFlux is an independent read API — not the official X developer portal.",
      },
      {
        question: "Where is the long operator list?",
        answer: "Docs: /docs/guides/search. Blog: /blog/twitter-api-search-operators.",
      },
      {
        question: "Search vs monitors?",
        answer: "Search is on-demand. Monitors watch specific accounts continuously.",
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
    title: "Free X API — 1,000 Calls/Month, No Card",
    description:
      "Free X/Twitter API alternative: 1,000 calls/month, 1 account monitor, instant key — no credit card. Profiles, search, timelines. Upgrade only when you need live webhooks.",
    keywords: [
      "free x api",
      "x api free",
      "twitter api free",
      "free twitter api",
      "x api key free",
      "free x api key",
    ],
    badge: "Free tier",
    h1: "Free X API for developers — start without a card",
    subtitle:
      "Looking for a free X API or free Twitter API tier? XFlux Free includes 1,000 REST/MCP calls per month and 1 account monitor with Dashboard hits. Live signed webhooks start on Starter ($19/mo). Compare official pricing at /docs/compare/pricing.",
    registerSrc: "seo_free_x_api",
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
        title: "Honest limits",
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
    compareTitle: "Free X API options (honest)",
    compareBlurb: "Official X free/basic tiers change often and are write/limited. XFlux Free is for read + one monitor.",
    compareCols: { left: "Official X (typical free/basic)", right: "XFlux Free" },
    compareRows: [
      { label: "Card required", left: "Often yes for useful tiers", right: "No" },
      { label: "Read profiles/search", left: "Varies / restricted", right: "Yes — 1,000 calls/mo" },
      { label: "Account monitor", left: "Not on free DIY", right: "1 monitor + Dashboard hits" },
      { label: "Live webhooks", left: "Enterprise AAA / streams", right: "Starter+" },
    ],
    codeTitle: "Smoke test",
    code: `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  https://www.xfluxapi.com/api/v1/users/elonmusk`,
    faqs: [
      {
        question: "Is this the official free X API?",
        answer:
          "No. XFlux is an independent read API + monitors. Official plans are at developer.x.com; we publish a comparison at /docs/compare/pricing.",
      },
      {
        question: "MCP on free tier?",
        answer: "Yes — tool calls count against the same 1,000 calls. See /mcp.",
      },
      {
        question: "More free-tier detail?",
        answer: "Blog: /blog/twitter-api-free-tier.",
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
];

export function getLongTailLanding(slug: string): LongTailLanding | undefined {
  return LONG_TAIL_LANDINGS.find((p) => p.slug === slug);
}

export const LONG_TAIL_SLUGS = LONG_TAIL_LANDINGS.map((p) => p.slug);
