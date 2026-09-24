export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // ISO date YYYY-MM-DD
  keywords: string[];
  /** Sections rendered as {h2, paragraphs[], optional code?} */
  sections: { heading: string; paragraphs: string[]; code?: string }[];
  faqs: { question: string; answer: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "x-api-cost-2026",
    title: "What Does the X/Twitter API Cost in 2026?",
    description:
      "Compare official X API pay-per-use and Pro streaming (~$5k/mo) with third-party proxies and XFlux flat plans from free/$19 — including account monitors and webhooks.",
    datePublished: "2026-09-20",
    keywords: [
      "x api pricing 2026",
      "twitter api cost",
      "x api alternative pricing",
      "cheap twitter api",
      "xflux pricing",
    ],
    sections: [
      {
        heading: "Official X API: pay-per-use and high tiers",
        paragraphs: [
          "X’s developer API is the source of truth when you need write access, OAuth on behalf of users, or enterprise-grade streaming. Pricing and packaging change; as of 2026 the practical story for many teams is still: Basic or pay-per-use for light reads, then a steep jump for realtime products.",
          "Filtered / Pro-style streaming is commonly cited around $5,000/month. That is the right product if you need firehose-scale rules across the whole network. It is the wrong product if you only care when a short list of @handles posts.",
          "Always verify current numbers on docs.x.com — treat any third-party comparison (including this one) as directional.",
        ],
      },
      {
        heading: "Third-party read APIs: volume vs workflow",
        paragraphs: [
          "Several third-party APIs sell cheaper public reads with pay-as-you-go metering. They win when your workload is pure lookup volume: millions of profile or search calls and nothing else.",
          "Where they usually stop is product surface area: you still build your own poller, signature scheme, dashboard, and agent tooling. If “watch these accounts and push signed JSON” is half the job, raw PPU endpoints alone are incomplete.",
        ],
      },
      {
        heading: "XFlux: flat plans, monitors, and webhooks",
        paragraphs: [
          "XFlux is a read-focused X/Twitter API with scheduled account monitors in the same account. Free tier: 1,000 API calls/month, 1 monitor, Dashboard hit history — no credit card. Starter starts at $19/mo with 150K calls, 3 monitors, signed HTTP webhooks, and 1-second minimum poll interval.",
          "Higher tiers (Growth $49, Pro $99, Scale $249) raise quotas and monitor counts. Polling for monitors does not consume your REST API quota. Live webhook delivery on new hits requires Starter+; Free can still configure URLs and send test pings.",
          "You also get MCP (@xflux/xflux-mcp-server) for Claude/Cursor, Smart Money predictors, and live signal digests — tooling that PPU proxies rarely bundle.",
        ],
        code: `# Quick cost intuition (directional)
# Official Pro filtered stream:  ~$5,000/mo for network-wide rules
# XFlux Starter monitors:        $19/mo for accounts you pick + webhooks
# XFlux Free:                    $0 — 1k calls + 1 monitor (Dashboard history)`,
      },
      {
        heading: "When to pick which",
        paragraphs: [
          "Pick official X when you must post, DM, or run enterprise streams with X’s own SLAs. Pick a high-volume PPU proxy when you only need bulk public lookups and already own the alert stack.",
          "Pick XFlux when you want flat monthly predictability, account-level monitors with HMAC-signed webhooks, Make.com routing, and an MCP server — without paying for a $5k stream you will not use.",
        ],
      },
      {
        heading: "Worked example: three accounts for trading alerts",
        paragraphs: [
          "Suppose you watch three macro/flow handles and only want webhook alerts when they post. DIY against official Basic means polling timelines yourself (quota + infra). Official streaming means Pro pricing for a use case that only needs three authors.",
          "On XFlux Starter you create three monitors, optional keyword filters, paste a Make.com or server URL, and verify HMAC. Same account also covers on-demand search and profile lookups for your bot or agent.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is XFlux cheaper than the official X API?",
        answer:
          "For read + account alerts, usually yes: Free or $19/mo Starter vs Basic/PPU friction or ~$5k streaming. For write/OAuth/enterprise firehose, use official X — XFlux does not replace those.",
      },
      {
        question: "Does XFlux charge per tweet?",
        answer:
          "No. Plans are flat monthly quotas for REST calls, plus a fixed number of account monitors. Monitor polling does not burn API call quota.",
      },
      {
        question: "Do I need the $5,000/mo stream for trading alerts?",
        answer:
          "Only if you need network-wide filtered streaming. Watching specific accounts is what XFlux monitors are for — from $19/mo with signed webhooks on Starter+.",
      },
      {
        question: "Where can I see current XFlux prices?",
        answer:
          "See /pricing and /docs/compare/pricing. Official X prices should be confirmed on docs.x.com.",
      },
    ],
  },
  {
    slug: "twitter-api-alternative",
    title: "Best Twitter API Alternatives in 2026 (Read + Account Alerts)",
    description:
      "Compare Twitter/X API alternatives for public reads and account alerts. When XFlux wins: monitors, signed webhooks, MCP, and flat plans in one account.",
    datePublished: "2026-09-21",
    keywords: [
      "twitter api alternative",
      "x api alternative",
      "twitter api proxy",
      "best twitter api 2026",
      "xflux vs twitter api",
    ],
    sections: [
      {
        heading: "What “alternative” usually means",
        paragraphs: [
          "Most teams searching for a Twitter API alternative need one of three things: cheaper public reads, faster signup than the official portal, or push alerts when accounts post — without building a poller.",
          "Write APIs, ads, and enterprise compliance still belong with official X. Honest alternatives compete on read access and developer workflow.",
        ],
      },
      {
        heading: "Categories of alternatives",
        paragraphs: [
          "Official X API — full platform surface, highest trust, highest cost and friction for many indie/trading workflows.",
          "Volume-oriented read APIs (e.g. Sorsa-style cheap lookups) — strong when you need raw volume at cents-per-request and already own alerting.",
          "Monitor-first tools — Discord bots or webhook services that watch handles; often weak on REST search/profile APIs or AI agent tooling.",
          "XFlux — flat-plan read API + scheduled monitors + signed webhooks + MCP + Smart Money / Signals in one product.",
        ],
      },
      {
        heading: "When XFlux is the better fit",
        paragraphs: [
          "You win with XFlux when the job is “lookup + watch + notify + optionally ask Claude/Cursor.” One API key covers profiles, timelines, search, tweet lookup, Dashboard monitors, HMAC webhooks (Starter+), and @xflux/xflux-mcp-server.",
          "You do not win with XFlux if you need to post tweets, manage DMs, or ingest the entire filtered firehose. Those stay on official X.",
        ],
      },
      {
        heading: "Feature checklist (practical)",
        paragraphs: [
          "Reads: profiles, user timelines, tweet-by-id, search — yes on XFlux REST.",
          "Always-on watches: account monitors with optional keyword filters; poll interval down to 1s on paid plans.",
          "Delivery: signed HTTP webhooks on Starter+; Make.com Custom Webhook documented; Discord via Make or your own bot.",
          "Agents: official MCP package for Claude Desktop and Cursor (not related to other “xflux” Figma MCP packages).",
        ],
      },
      {
        heading: "How to evaluate in an afternoon",
        paragraphs: [
          "Sign up, run a profile lookup, create one monitor on a busy account, send a test webhook, then optionally wire MCP. If that path is shorter than stitching a proxy + cron + Discord bot, the alternative is doing its job.",
        ],
        code: `curl -X GET "https://www.xfluxapi.com/api/v1/users/elonmusk" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`,
      },
    ],
    faqs: [
      {
        question: "Is XFlux an official Twitter/X product?",
        answer:
          "No. XFlux is an independent read API and monitoring product. Official write and enterprise products remain on X’s developer platform.",
      },
      {
        question: "Can I replace the official API entirely?",
        answer:
          "Only for public read + account-alert workloads. If you need posting, user OAuth, or network-wide streams, keep official X.",
      },
      {
        question: "How does XFlux compare to pure PAYG APIs?",
        answer:
          "PAYG often wins pure lookup volume. XFlux wins when you also need flat plans, monitors, signed webhooks, Make routing, MCP, and signal tooling.",
      },
      {
        question: "Where should I start?",
        answer:
          "Free tier at /register, then /docs/quickstart. Compare pages: /compare/x-api and /docs/compare/pricing.",
      },
    ],
  },
  {
    slug: "twitter-account-monitor-webhook",
    title: "How to Get Signed Webhooks When an X Account Posts",
    description:
      "Set up XFlux account monitors and HMAC-SHA256 signed webhooks for new tweets. Includes payload shape, Node verification, and Make.com link.",
    datePublished: "2026-09-18",
    keywords: [
      "twitter account monitor webhook",
      "twitter webhook hmac",
      "x account alert webhook",
      "monitor.hit webhook",
      "make.com twitter webhook",
    ],
    sections: [
      {
        heading: "Why monitors beat DIY polling",
        paragraphs: [
          "DIY means cron + timeline fetch + dedupe + retries + secrets. XFlux account monitors poll on a schedule (down to 1s on Starter+), store hits in the Dashboard, and — on paid plans — POST signed JSON to your HTTPS URL when something new matches.",
          "Free tier includes 1 monitor with hit history. Live delivery of new hits requires Starter ($19/mo) or higher. You can still save a webhook URL and send test pings on Free.",
        ],
      },
      {
        heading: "Setup (Dashboard)",
        paragraphs: [
          "1. Create an account and open Dashboard → Monitors. 2. Add a target @username and optional comma-separated keywords. 3. Expand Webhook, paste an HTTPS endpoint, save. 4. Copy the signing secret shown once. 5. Click Test webhook.",
          "Product overview: /twitter-webhook. Make.com step-by-step: /docs/integrations/make. Full field reference: /docs/webhooks.",
        ],
      },
      {
        heading: "Payload and headers",
        paragraphs: [
          "On a hit, XFlux sends Content-Type application/json with X-XFlux-Event, X-XFlux-Timestamp, and X-XFlux-Signature (sha256=…). Event name is monitor.hit. Test deliveries use monitor.test.",
        ],
        code: `POST https://your-server.com/webhooks/xflux
Content-Type: application/json
X-XFlux-Event: monitor.hit
X-XFlux-Timestamp: 1710000000
X-XFlux-Signature: sha256=<hex>

{
  "event": "monitor.hit",
  "monitor": {
    "id": "clx...",
    "targetUsername": "elonmusk",
    "keywords": null
  },
  "tweet": {
    "id": "1234567890",
    "text": "Hello world",
    "authorUsername": "elonmusk",
    "createdAt": "2026-06-14T12:00:00.000Z"
  },
  "detectedAt": "2026-06-14T12:00:05.000Z"
}`,
      },
      {
        heading: "Verify HMAC-SHA256",
        paragraphs: [
          "Compute HMAC-SHA256 over `{timestamp}.{raw_body}` with your webhook secret. Compare to X-XFlux-Signature with a timing-safe equal. Reject timestamps older than about five minutes. Always use the raw body bytes — parsed-then-restringified JSON will break verification.",
        ],
        code: `import crypto from "crypto";

function verify(secret, timestamp, rawBody, signatureHeader) {
  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(\`\${timestamp}.\${rawBody}\`)
      .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader)
  );
}`,
      },
      {
        heading: "Route with Make.com (or your bot)",
        paragraphs: [
          "Paste a Make.com Custom Webhook URL into the monitor. Make can fan out to Slack, Telegram, Discord, Sheets, or HTTP modules. For Discord specifically, see /twitter-discord-alerts.",
          "Failed deliveries are logged in the Dashboard; the current product does not auto-retry — fix the endpoint and use Test webhook.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which plan includes live webhooks?",
        answer:
          "Starter ($19/mo) and above. Free can configure a URL and send test pings; live monitor.hit delivery needs a paid plan.",
      },
      {
        question: "What algorithm is used for signatures?",
        answer:
          "HMAC-SHA256 over `{timestamp}.{raw_body}`, returned as sha256=<hex> in X-XFlux-Signature.",
      },
      {
        question: "Can I filter by keywords?",
        answer:
          "Yes — optional comma-separated keywords on each monitor so only matching tweets create hits.",
      },
      {
        question: "Does polling use my API quota?",
        answer:
          "No. Monitor polling is separate from REST /api/v1 call quotas.",
      },
    ],
  },
  {
    slug: "twitter-trading-alerts",
    title: "Trading & Macro Alerts from X Without a $5k Stream",
    description:
      "Build Twitter/X trading alerts with account monitors, keyword filters, and signed webhooks — from $19/mo instead of official Pro streaming.",
    datePublished: "2026-09-19",
    keywords: [
      "twitter trading alerts",
      "macro twitter webhook",
      "stock twitter monitor",
      "x trading bot alerts",
      "unusual whales webhook",
    ],
    sections: [
      {
        heading: "The real requirement for most desks",
        paragraphs: [
          "Most trading and macro workflows do not need the full filtered firehose. They need fast notice when a trusted list of accounts posts — sometimes only when the text mentions Fed, CPI, $SPY, or a ticker.",
          "Official Pro streaming (~$5k/mo class) solves network-wide rules. XFlux monitors solve account-level watches with Dashboard filters and webhook delivery from Starter at $19/mo.",
        ],
      },
      {
        heading: "Example monitor setups",
        paragraphs: [
          "@unusual_whales with keywords like flow, block, sweep — options flow without every unrelated post.",
          "@elerianm with fed, inflation, rate — macro commentary only when policy terms appear.",
          "@DeItaone with no keywords — every breaking headline from that handle.",
          "Copy more templates from /docs/guides/trading-keywords and browse live digests on /signals/trading.",
        ],
      },
      {
        heading: "Delivery into your stack",
        paragraphs: [
          "On hit, XFlux POSTs signed JSON. Verify HMAC, then route to Slack, Telegram, Discord (via Make or your bot), or a trading worker that sizes risk off the text.",
          "Pair monitors with Smart Money predictors (/predictors) when you want ranked accounts that make forward-looking calls, then add those @handles as monitors.",
        ],
        code: `{
  "event": "monitor.hit",
  "monitor": {
    "targetUsername": "unusual_whales",
    "keywords": "flow, block"
  },
  "tweet": {
    "id": "1234567890",
    "text": "Large $SPY call sweep detected...",
    "authorUsername": "unusual_whales"
  },
  "detectedAt": "2026-09-16T12:00:05.000Z"
}`,
      },
      {
        heading: "Cost comparison (directional)",
        paragraphs: [
          "Official filtered stream: high monthly tier, complex rules, enterprise-style setup.",
          "XFlux: pick accounts, set keywords, webhook URL — Free for Dashboard history, Starter for live 1s polling + signed delivery.",
          "You still own trade execution and compliance. XFlux delivers text alerts; it does not place orders.",
        ],
      },
      {
        heading: "Operational tips",
        paragraphs: [
          "Start with fewer monitors and tight keywords to reduce noise. Use Test webhook before going live. Log signature failures separately from business logic so a clock skew does not look like a market event.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can XFlux replace Bloomberg or a brokerage feed?",
        answer:
          "No. It watches public X accounts and pushes tweet payloads. Use it as an alert layer, not a market data vendor.",
      },
      {
        question: "How fast are monitors?",
        answer:
          "Paid plans support a 1-second minimum poll interval. Detection latency is poll interval plus delivery time — not a guaranteed sub-second exchange feed.",
      },
      {
        question: "Do I need Make.com?",
        answer:
          "No. Point webhooks at your own HTTPS endpoint, or use Make/n8n/Zapier for no-code routing.",
      },
      {
        question: "Where is the trading use-case landing page?",
        answer:
          "/use-cases/trading-alerts and keyword templates at /docs/guides/trading-keywords.",
      },
    ],
  },
  {
    slug: "twitter-mcp-claude-cursor",
    title: "Connect Claude or Cursor to X Data via XFlux MCP",
    description:
      "Install @xflux/xflux-mcp-server for Claude Desktop and Cursor. Read profiles, search, timelines, monitors, and Smart Money — unrelated to xflux.us Figma MCP.",
    datePublished: "2026-09-22",
    keywords: [
      "twitter mcp",
      "claude twitter api",
      "cursor mcp twitter",
      "xflux mcp server",
      "mcp x api",
    ],
    sections: [
      {
        heading: "What the XFlux MCP server does",
        paragraphs: [
          "Model Context Protocol (MCP) lets Claude Desktop and Cursor call tools against your XFlux API key. The package is @xflux/xflux-mcp-server (registry id io.github.yxs1640-png/xflux).",
          "Tools cover read API operations: user profiles, search, timelines, tweet lookup, read-only monitor list/hits, and Smart Money discovery. Creating monitors and webhook URLs still happens in the Dashboard — MCP stays read-oriented.",
        ],
      },
      {
        heading: "Not the other “xflux”",
        paragraphs: [
          "There are unrelated projects that also use the name “xflux” (for example Figma-oriented MCP tooling). This guide is only for XFlux the X/Twitter API at xfluxapi.com — package scope @xflux/xflux-mcp-server.",
        ],
      },
      {
        heading: "Install and run",
        paragraphs: [
          "You need Node 18+ and an API key from the Dashboard (prefix xflux_). MCP calls count against your plan’s REST quota like any other request.",
        ],
        code: `export XFLUX_API_KEY=xflux_your_key_here
npx @xflux/xflux-mcp-server`,
      },
      {
        heading: "Cursor and Claude Desktop config",
        paragraphs: [
          "Add the same JSON block to Cursor MCP settings or Claude’s claude_desktop_config.json, then restart the client.",
        ],
        code: `{
  "mcpServers": {
    "xflux": {
      "command": "npx",
      "args": ["-y", "@xflux/xflux-mcp-server"],
      "env": {
        "XFLUX_API_KEY": "xflux_your_key_here"
      }
    }
  }
}`,
      },
      {
        heading: "Useful agent patterns",
        paragraphs: [
          "Discover forward-looking accounts with xflux_smart_money_list (pass exclude for handles you already track), inspect timelines, then open Dashboard → Monitors to watch them with webhooks.",
          "Marketing overview: /mcp. Full tool list: /docs/integrations/mcp. Smart Money hub: /predictors.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this the Figma xflux MCP?",
        answer:
          "No. Use @xflux/xflux-mcp-server for X/Twitter data on xfluxapi.com. Other packages named xflux are unrelated.",
      },
      {
        question: "Can MCP create monitors or webhooks?",
        answer:
          "No. MCP can list monitors and hits (read-only). Create monitors and webhook URLs in the Dashboard.",
      },
      {
        question: "Does MCP work on the Free plan?",
        answer:
          "Yes, within Free API quota (1,000 calls/month). Heavy agent loops may need a paid plan.",
      },
      {
        question: "Where is the npm package?",
        answer:
          "https://www.npmjs.com/package/@xflux/xflux-mcp-server",
      },
    ],
  },
  {
    slug: "twitter-api-python-nodejs",
    title: "X/Twitter API Examples: Python and Node.js with XFlux",
    description:
      "Copy-paste Python and Node.js examples using a Bearer API key against https://www.xfluxapi.com/api/v1 — profiles, timelines, and search.",
    datePublished: "2026-09-23",
    keywords: [
      "twitter api python",
      "twitter api nodejs",
      "x api bearer token example",
      "xflux api example",
      "twitter search api python",
    ],
    sections: [
      {
        heading: "Base URL and auth",
        paragraphs: [
          "All examples hit https://www.xfluxapi.com/api/v1. Pass Authorization: Bearer xflux_YOUR_KEY (or X-API-Key). Keys are created on signup; copy once from the welcome screen or create new keys under Dashboard → API Keys.",
          "Successful responses wrap payloads in a data field. Errors return error with HTTP 4xx/5xx. Full reference: /docs/api.",
        ],
      },
      {
        heading: "curl (sanity check)",
        paragraphs: [
          "Before wiring SDKs, confirm the key works with curl.",
        ],
        code: `curl -X GET "https://www.xfluxapi.com/api/v1/users/elonmusk" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

curl -G "https://www.xfluxapi.com/api/v1/search" \\
  -H "Authorization: Bearer xflux_YOUR_KEY" \\
  --data-urlencode "q=fed rate" \\
  --data-urlencode "limit=10"`,
      },
      {
        heading: "Python (requests)",
        paragraphs: [
          "Install requests if needed. Store the key in an environment variable — never commit it.",
        ],
        code: `import os
import requests

BASE = "https://www.xfluxapi.com/api/v1"
headers = {"Authorization": f"Bearer {os.environ['XFLUX_API_KEY']}"}

# Profile
r = requests.get(f"{BASE}/users/OpenAI", headers=headers, timeout=30)
r.raise_for_status()
print(r.json()["data"]["username"])

# Timeline
r = requests.get(
    f"{BASE}/users/OpenAI/tweets",
    headers=headers,
    params={"limit": 5},
    timeout=30,
)
r.raise_for_status()
for tweet in r.json()["data"]:
    print(tweet["id"], tweet.get("text", "")[:80])

# Search
r = requests.get(
    f"{BASE}/search",
    headers=headers,
    params={"q": "from:OpenAI lang:en", "limit": 5},
    timeout=30,
)
r.raise_for_status()
print(len(r.json()["data"]), "results")`,
      },
      {
        heading: "Node.js (fetch)",
        paragraphs: [
          "Node 18+ has global fetch. Same Bearer header pattern.",
        ],
        code: `const BASE = "https://www.xfluxapi.com/api/v1";
const headers = {
  Authorization: \`Bearer \${process.env.XFLUX_API_KEY}\`,
};

const user = await fetch(\`\${BASE}/users/OpenAI\`, { headers });
if (!user.ok) throw new Error(await user.text());
console.log((await user.json()).data.username);

const q = new URLSearchParams({ q: "fed rate", limit: "5" });
const search = await fetch(\`\${BASE}/search?\${q}\`, { headers });
if (!search.ok) throw new Error(await search.text());
console.log((await search.json()).data.length, "results");`,
      },
      {
        heading: "Next steps",
        paragraphs: [
          "Longer guides: /docs/guides/python and /docs/guides/nodejs. For always-on account alerts, add monitors and webhooks (/docs/monitors, /docs/webhooks). For agents, install MCP (/mcp).",
        ],
      },
    ],
    faqs: [
      {
        question: "Is there an official Python/Node SDK?",
        answer:
          "You can call the REST API with any HTTP client. MCP covers agent tooling; thin REST examples are enough for most scripts.",
      },
      {
        question: "What is the rate limit / quota?",
        answer:
          "Monthly call quotas by plan (Free 1,000; Starter 150K; higher tiers more). See /docs/limits and /pricing.",
      },
      {
        question: "Can I post tweets with these examples?",
        answer:
          "Write/post endpoints are not the product focus (posting marked coming soon). Use XFlux for reads, search, monitors, and webhooks.",
      },
      {
        question: "Where do I get a key?",
        answer:
          "Register at /register — a Default key is created automatically. No credit card on Free.",
      },
    ],
  },
];

import { BLOG_POSTS_ZH } from "./posts-zh";

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getBlogPosts(locale: string): BlogPost[] {
  return locale === "zh" ? BLOG_POSTS_ZH : BLOG_POSTS;
}

export function getBlogPost(slug: string, locale: string): BlogPost | undefined {
  return getBlogPosts(locale).find((p) => p.slug === slug) ?? getPost(slug);
}
