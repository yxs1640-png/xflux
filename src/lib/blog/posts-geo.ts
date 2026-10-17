import type { BlogPost } from "./posts";

/** GEO recipes — quotable how-tos that match live search questions (2026-10-17). */
export const BLOG_POSTS_GEO: BlogPost[] = [
  {
    slug: "connect-slack-to-twitter-alerts",
    title: "Connect Slack to Twitter Alerts with an Incoming Webhook",
    description:
      "Step-by-step: watch a public X/Twitter account and post new tweets into a Slack channel. Free test ping, live delivery on Starter. Read-only — this does not post to Twitter.",
    datePublished: "2026-10-17",
    keywords: [
      "connect slack to twitter",
      "slack twitter webhook",
      "twitter to slack alerts",
      "slack incoming webhook twitter",
    ],
    sections: [
      {
        heading: "What you are connecting",
        paragraphs: [
          "This recipe sends public X/Twitter posts into Slack. It does not post from Slack to Twitter, and it is not the official X Account Activity API.",
          "XFlux watches a public @handle. When a new matching post appears, it POSTs a Slack Incoming Webhook body: { \"text\": \"*@author* posted:\\n…\\nhttps://x.com/…\" }. Free can send a test ping. Live hits start on Starter ($19/mo).",
          "Shorter product page: /connect-slack-to-twitter. Webhook reference: /docs/webhooks.",
        ],
      },
      {
        heading: "1. Create a Slack Incoming Webhook",
        paragraphs: [
          "In Slack: Apps → Incoming Webhooks → Add to Slack → pick the channel → copy the URL. It looks like https://hooks.slack.com/services/T…/B…/…",
          "Keep that URL secret. Anyone with it can post into the channel.",
        ],
      },
      {
        heading: "2. Create a free XFlux monitor",
        paragraphs: [
          "Register at /register?src=blog_slack_recipe (no card on Free). Open Dashboard → Monitors. Add one public @username. Optional keywords limit alerts to posts that mention a ticker or phrase.",
          "Paste the Slack URL as the webhook. Click Test. Slack should show: XFlux test OK — monitor @handle is connected.",
        ],
      },
      {
        heading: "3. Turn on live delivery",
        paragraphs: [
          "Free stores hits in the Dashboard and can send the test ping. Starter and above deliver a Slack message when a new matching tweet is detected.",
          "The same monitor accepts a Discord webhook or your own HTTPS URL. Swap the URL; do not build a second poller.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does this post tweets from Slack?",
        answer: "No. The direction is Twitter/X → Slack. XFlux is a read API plus monitors.",
      },
      {
        question: "Do I need a custom Slack bot?",
        answer: "No. An Incoming Webhook is enough for channel text. Use a bot only if you need Block Kit or threads.",
      },
      {
        question: "Is the free test the same as live alerts?",
        answer:
          "The test proves the URL. Live messages when new tweets appear require Starter or higher.",
      },
    ],
  },
  {
    slug: "free-x-api-1000-calls",
    title: "Free X API: 1,000 Calls a Month, No Credit Card",
    description:
      "How to get a free X/Twitter read API key: profiles, search, and timelines. 1,000 calls/month and 1 account monitor. Independent of the official X developer portal.",
    datePublished: "2026-10-17",
    keywords: [
      "free x api",
      "free twitter api",
      "x api free",
      "twitter api free tier",
    ],
    sections: [
      {
        heading: "What the free tier includes",
        paragraphs: [
          "XFlux Free is an independent read API for public X/Twitter data. It is not the official X API at developer.x.com.",
          "Free includes 1,000 API calls per month, 1 account monitor with hits in the Dashboard, and an instant key. No credit card. Live signed webhooks (Slack, Discord, HTTPS) start on Starter at $19/mo. Product page: /free-x-api.",
        ],
      },
      {
        heading: "Get a key and smoke-test a profile",
        paragraphs: [
          "Register at /register?src=blog_free_x_api. Dashboard → API Keys copies a key that starts with xflux_. The same key works for REST and for the MCP server.",
        ],
        code: `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  https://www.xfluxapi.com/api/v1/users/elonmusk`,
      },
      {
        heading: "Search and a timeline",
        paragraphs: [
          "Search accepts the same operator grammar as public X search (from:, lang:, quotes). Timelines are GET /api/v1/users/{handle}/tweets. Each successful call counts toward the 1,000.",
        ],
        code: `curl -G "https://www.xfluxapi.com/api/v1/search" \\
  --data-urlencode 'q=from:elonmusk lang:en' \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

curl -G "https://www.xfluxapi.com/api/v1/users/elonmusk/tweets" \\
  --data-urlencode "limit=10" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`,
      },
      {
        heading: "Use the same key from Claude or Cursor",
        paragraphs: [
          "Install @xflux/xflux-mcp-server and set XFLUX_API_KEY. Tool calls count against the same 1,000. The server is read-only: search, profiles, timelines, and Smart Money. It does not post tweets. Install page: /mcp.",
        ],
        code: `{
  "mcpServers": {
    "xflux": {
      "command": "npx",
      "args": ["-y", "@xflux/xflux-mcp-server"],
      "env": { "XFLUX_API_KEY": "xflux_YOUR_KEY" }
    }
  }
}`,
      },
    ],
    faqs: [
      {
        question: "Is this the official free X API?",
        answer:
          "No. Official plans are at developer.x.com. A comparison is at /docs/compare/pricing.",
      },
      {
        question: "Can I post tweets on the free tier?",
        answer: "No. XFlux is read-only public data plus monitors.",
      },
      {
        question: "When do I need to pay?",
        answer:
          "When you pass 1,000 calls, need more than one monitor, or want live webhook delivery.",
      },
    ],
  },
  {
    slug: "twitter-search-operators-for-agents",
    title: "Twitter Search Operators for Agents (from:, lang:, quotes)",
    description:
      "Copy-paste Twitter search operators for an API or MCP tool: from:handle, lang:en, quoted phrases, OR, and minus. Free tier: 1,000 calls/month.",
    datePublished: "2026-10-17",
    keywords: [
      "twitter search operators",
      "twitter search operator",
      "x search operators",
      "twitter search api agents",
    ],
    sections: [
      {
        heading: "Pass operators in q",
        paragraphs: [
          "XFlux GET /api/v1/search takes the query in q. Agents should use the same string with the MCP tool xflux_search_tweets. Operators match common public search grammar. This is not the official X recent-search product.",
          "Cheat sheet page: /twitter-search-operators. Longer operator notes: /docs/guides/search and /blog/twitter-api-search-operators.",
        ],
        code: `curl -G "https://www.xfluxapi.com/api/v1/search" \\
  --data-urlencode 'q=from:elonmusk lang:en' \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`,
      },
      {
        heading: "Operators worth using",
        paragraphs: [
          "from:elonmusk — only that account. No @ in the operator.",
          "lang:en — language filter.",
          "\"fed rate\" — exact phrase. Combine with OR: \"fed rate\" OR \"rate cut\".",
          "-is:reply — drop replies when the parameter is supported by the query parser you are using. If a result set is still noisy, tighten from: and a short phrase instead of a bare keyword.",
          "A bare keyword like CPI burns quota on memes. Prefer from: plus a phrase.",
        ],
      },
      {
        heading: "Tell an agent to call search",
        paragraphs: [
          "After the MCP server is installed (/mcp), a prompt that works: Search recent English posts from @elonmusk about rates using xflux_search_tweets. Do not scrape.",
          "Search is on demand. To get a Slack or Discord message every time an account posts, use a monitor (/monitor-twitter-account) instead of polling search in a loop.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do these operators work in Claude or Cursor?",
        answer:
          "Yes, through xflux_search_tweets on @xflux/xflux-mcp-server. Put the operator string in q.",
      },
      {
        question: "Are since: and until: supported?",
        answer: "See /docs/guides/search and /blog/twitter-api-search-operators for the operator list and date bounds.",
      },
      {
        question: "Search or a monitor?",
        answer: "Search answers a question now. A monitor watches one @handle continuously.",
      },
    ],
  },
];
