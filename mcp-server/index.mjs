#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = process.env.XFLUX_API_BASE ?? "https://www.xfluxapi.com/api/v1";
const API_KEY = process.env.XFLUX_API_KEY;

if (!API_KEY) {
  console.error("XFLUX_API_KEY is required. Get one from https://www.xfluxapi.com/dashboard");
  process.exit(1);
}

async function xfluxFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "User-Agent": "XFlux-MCP/1.2",
      "X-XFlux-Client": "mcp",
    },
  });
  const body = await res.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    throw new Error(`XFlux API ${res.status}: ${body.slice(0, 200)}`);
  }
  if (!res.ok) {
    throw new Error(json.error ?? `XFlux API ${res.status}`);
  }
  return json;
}

function textResult(text) {
  return { content: [{ type: "text", text }] };
}

function trimText(text, max = 280) {
  const t = String(text ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function formatUser(data) {
  const u = data?.data ?? data;
  if (!u || typeof u !== "object") return JSON.stringify(data, null, 2);
  const lines = [
    `@${u.username ?? "?"} — ${u.name ?? "?"}`,
    u.verified ? "Verified: yes" : null,
    `Followers: ${u.followers_count ?? "?"} · Following: ${u.following_count ?? "?"} · Tweets: ${u.tweet_count ?? "?"}`,
    u.description ? `Bio: ${trimText(u.description, 200)}` : null,
    u.id ? `ID: ${u.id}` : null,
    u.username ? `URL: https://x.com/${u.username}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

function formatTweet(t, index) {
  if (!t || typeof t !== "object") return String(t);
  const handle = t.author?.username || t.author_username || t.author_id || "?";
  const id = t.id || t.tweet_id;
  const created = t.created_at || t.tweet_created_at || t.detected_at || "";
  const metrics = t.public_metrics;
  const prefix = index != null ? `${index}. ` : "";
  const lines = [
    `${prefix}@${String(handle).replace(/^@/, "")}${created ? ` · ${created}` : ""}`,
    trimText(t.text, 320),
  ];
  if (metrics) {
    lines.push(
      `♥ ${metrics.like_count ?? 0} · ↻ ${metrics.retweet_count ?? 0} · 💬 ${metrics.reply_count ?? 0}`
    );
  }
  if (id && handle && handle !== "?") {
    lines.push(`https://x.com/${String(handle).replace(/^@/, "")}/status/${id}`);
  } else if (t.url) {
    lines.push(t.url);
  }
  return lines.join("\n");
}

function formatTweetList(payload, emptyLabel = "No tweets.") {
  const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  if (!list.length) return emptyLabel;
  const meta = payload?.meta;
  const header = meta?.query
    ? `Search "${meta.query}" — ${list.length} result(s)`
    : `${list.length} tweet(s)`;
  return [header, "", ...list.map((t, i) => formatTweet(t, i + 1))].join("\n\n");
}

function formatMonitors(payload) {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  if (!list.length) {
    return "No monitors yet. Create one in https://www.xfluxapi.com/dashboard/monitors";
  }
  const blocks = list.map((m, i) => {
    const lines = [
      `${i + 1}. @${m.target_username} [${m.status}] ${m.is_active ? "active" : "paused"}`,
      `   id: ${m.id}`,
      m.keywords ? `   keywords: ${m.keywords}` : "   keywords: (any new tweet)",
      `   interval: ${m.check_interval_sec}s · webhook: ${m.has_webhook ? "yes" : "no"}`,
      m.last_check_at ? `   last_check: ${m.last_check_at}` : null,
      m.last_error ? `   last_error: ${trimText(m.last_error, 120)}` : null,
    ];
    if (Array.isArray(m.recent_hits) && m.recent_hits.length) {
      lines.push("   recent hits:");
      for (const h of m.recent_hits.slice(0, 3)) {
        lines.push(`   - ${trimText(h.text, 100)} · ${h.url || h.tweet_id}`);
      }
    }
    return lines.filter(Boolean).join("\n");
  });
  return [`${list.length} monitor(s)`, "", ...blocks].join("\n");
}

function formatMonitorHits(payload) {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};
  const header = [
    `Monitor ${meta.monitor_id ?? "?"}`,
    meta.target_username ? `@${meta.target_username}` : null,
    meta.keywords ? `keywords: ${meta.keywords}` : null,
    `${list.length} hit(s)`,
  ]
    .filter(Boolean)
    .join(" · ");
  if (!list.length) return `${header}\n\nNo hits yet.`;
  const blocks = list.map((h, i) => {
    const when = h.detected_at || h.tweet_created_at || "";
    return [
      `${i + 1}. @${h.author_username}${when ? ` · ${when}` : ""}`,
      trimText(h.text, 320),
      h.url || `tweet_id: ${h.tweet_id}`,
    ].join("\n");
  });
  return [header, "", ...blocks].join("\n\n");
}

function formatClaimLine(c, index) {
  const prefix = index != null ? `${index}. ` : "";
  const handle = c.username ? `@${c.username}` : "";
  const when = c.tweet_created_at || "";
  const dir = c.direction ? ` (${c.direction})` : "";
  return [
    `${prefix}${handle}${when ? ` · ${when}` : ""}${c.niche ? ` · ${c.niche}` : ""}`,
    `${c.claim_summary || c.subject || "?"}${dir}`,
    c.url || (c.tweet_id ? `tweet_id: ${c.tweet_id}` : null),
  ]
    .filter(Boolean)
    .join("\n");
}

function formatSmartMoneyList(payload) {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};
  if (!list.length) {
    return "No Smart Money accounts matched (try a broader niche or fewer excludes). Hub: https://www.xfluxapi.com/predictors";
  }
  const header = [
    `${list.length} Smart Money account(s)`,
    meta.niche ? `niche=${meta.niche}` : null,
    meta.days ? `last ${meta.days}d` : null,
    meta.exclude_count ? `excluded ${meta.exclude_count}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const blocks = list.map((p, i) => {
    const lines = [
      `${i + 1}. @${p.username}${p.display_name ? ` — ${p.display_name}` : ""} [${p.niche}]`,
      `   activity=${p.discovery_score ?? "?"}${p.accuracy_score != null ? ` · track=${p.accuracy_score}` : ""} · claims=${p.total_claims ?? 0}`,
      p.profile_url ? `   ${p.profile_url}` : null,
      `   Monitor: https://www.xfluxapi.com/dashboard/monitors`,
    ];
    const claims = Array.isArray(p.recent_claims) ? p.recent_claims : [];
    if (claims.length) {
      lines.push("   recent calls:");
      for (const c of claims.slice(0, 3)) {
        lines.push(`   - ${trimText(c.claim_summary, 160)}${c.url ? ` · ${c.url}` : ""}`);
      }
    }
    return lines.filter(Boolean).join("\n");
  });
  return [header, "", ...blocks].join("\n\n");
}

function formatSmartMoneyProfile(payload) {
  const p = payload?.data;
  if (!p) return "Profile not found.";
  const lines = [
    `@${p.username}${p.display_name ? ` — ${p.display_name}` : ""} [${p.niche}]`,
    p.bio ? `Bio: ${trimText(p.bio, 200)}` : null,
    `activity=${p.discovery_score ?? "?"}${p.accuracy_score != null ? ` · track=${p.accuracy_score}` : ""} · claims=${p.total_claims ?? 0} · hits/misses=${p.hit_count ?? 0}/${p.miss_count ?? 0}`,
    p.profile_url || null,
    p.x_url || null,
    "Add Monitor: https://www.xfluxapi.com/dashboard/monitors",
  ];
  const claims = Array.isArray(p.recent_claims) ? p.recent_claims : [];
  if (!claims.length) {
    return [...lines.filter(Boolean), "", "No recent claims in window."].join("\n");
  }
  return [
    ...lines.filter(Boolean),
    "",
    `${claims.length} recent call(s):`,
    "",
    ...claims.map((c, i) => formatClaimLine({ ...c, username: p.username }, i + 1)),
  ].join("\n\n");
}

function formatSmartMoneyClaims(payload) {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};
  const header = [
    `${list.length} Smart Money call(s)`,
    meta.niche ? `niche=${meta.niche}` : null,
    meta.days ? `last ${meta.days}d` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  if (!list.length) return `${header}\n\nNo claims in window.`;
  return [header, "", ...list.map((c, i) => formatClaimLine(c, i + 1))].join("\n\n");
}

const server = new McpServer({
  name: "xflux",
  version: "1.2.0",
});

server.tool(
  "xflux_get_user",
  "Look up a public X/Twitter user profile by @username. Returns a short summary.",
  { username: z.string().describe("Handle without @, e.g. elonmusk") },
  async ({ username }) => {
    const data = await xfluxFetch(`/users/${encodeURIComponent(username.replace(/^@/, ""))}`);
    return textResult(formatUser(data));
  }
);

server.tool(
  "xflux_search_tweets",
  "Search recent public tweets via XFlux (same query syntax as X search). Returns compact summaries.",
  {
    q: z.string().describe('Search query, e.g. from:elonmusk or "fed rate" lang:en'),
    limit: z.number().int().min(1).max(100).optional().describe("Max results (default 20)"),
  },
  async ({ q, limit }) => {
    const data = await xfluxFetch("/search", { q, limit: limit ?? 20 });
    return textResult(formatTweetList(data, "No matching tweets."));
  }
);

server.tool(
  "xflux_get_user_tweets",
  "Fetch recent tweets from a public @username timeline. Returns compact summaries.",
  {
    username: z.string().describe("Handle without @"),
    limit: z.number().int().min(1).max(100).optional().describe("Max results (default 20)"),
  },
  async ({ username, limit }) => {
    const handle = username.replace(/^@/, "");
    const data = await xfluxFetch(`/users/${encodeURIComponent(handle)}/tweets`, {
      limit: limit ?? 20,
    });
    return textResult(formatTweetList(data, "No tweets on this timeline."));
  }
);

server.tool(
  "xflux_get_tweet",
  "Look up a single tweet by numeric ID. Returns a short summary.",
  { id: z.string().describe("Tweet ID") },
  async ({ id }) => {
    const data = await xfluxFetch(`/tweets/${encodeURIComponent(id)}`);
    const tweet = data?.data ?? data;
    return textResult(formatTweet(tweet));
  }
);

server.tool(
  "xflux_list_monitors",
  "List your XFlux account monitors (read-only). Shows @targets, keywords, status, webhook, optional recent hits.",
  {
    include_hits: z
      .boolean()
      .optional()
      .describe("Include up to 3 recent hits per monitor (default false)"),
  },
  async ({ include_hits }) => {
    const data = await xfluxFetch("/monitors", {
      include_hits: include_hits ? "1" : undefined,
      hit_limit: include_hits ? 3 : undefined,
    });
    return textResult(formatMonitors(data));
  }
);

server.tool(
  "xflux_get_monitor_hits",
  "List recent hits for one of your monitors (read-only). Create/edit monitors in the Dashboard.",
  {
    monitor_id: z.string().describe("Monitor id from xflux_list_monitors"),
    limit: z.number().int().min(1).max(100).optional().describe("Max hits (default 20)"),
  },
  async ({ monitor_id, limit }) => {
    const data = await xfluxFetch(`/monitors/${encodeURIComponent(monitor_id)}/hits`, {
      limit: limit ?? 20,
    });
    return textResult(formatMonitorHits(data));
  }
);

server.tool(
  "xflux_smart_money_list",
  "Discover ranked Smart Money X/Twitter accounts (macro, trading, crypto, geopolitics) that posted extractable forward-looking calls recently. Pass exclude to skip handles you already track. Prefer this over googling long analyst prompts.",
  {
    niche: z
      .enum(["MACRO", "TRADING", "CRYPTO", "GEOPOLITICS", "macro", "trading", "crypto", "geopolitics"])
      .optional()
      .describe("Optional niche filter"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("Max accounts to return (default 4)"),
    exclude: z
      .string()
      .optional()
      .describe("Comma-separated @handles to exclude (already tracked)"),
    days: z
      .number()
      .int()
      .min(1)
      .max(90)
      .optional()
      .describe("Only accounts with a call in the last N days (default 14)"),
  },
  async ({ niche, limit, exclude, days }) => {
    const data = await xfluxFetch("/smart-money", {
      niche: niche ? String(niche).toUpperCase() : undefined,
      limit: limit ?? 4,
      exclude: exclude || undefined,
      days: days ?? 14,
    });
    return textResult(formatSmartMoneyList(data));
  }
);

server.tool(
  "xflux_smart_money_profile",
  "Get one Smart Money account profile plus recent extracted prediction calls (default last 14 days).",
  {
    username: z.string().describe("Handle without @"),
    days: z.number().int().min(1).max(90).optional().describe("Claim window in days (default 14)"),
    limit: z.number().int().min(1).max(50).optional().describe("Max claims (default 20)"),
  },
  async ({ username, days, limit }) => {
    const handle = username.replace(/^@/, "");
    const data = await xfluxFetch(`/smart-money/${encodeURIComponent(handle)}`, {
      days: days ?? 14,
      limit: limit ?? 20,
    });
    return textResult(formatSmartMoneyProfile(data));
  }
);

server.tool(
  "xflux_smart_money_claims",
  "List recent Smart Money prediction calls across accounts. Optional niche and exclude list.",
  {
    niche: z
      .enum(["MACRO", "TRADING", "CRYPTO", "GEOPOLITICS", "macro", "trading", "crypto", "geopolitics"])
      .optional()
      .describe("Optional niche filter"),
    exclude: z.string().optional().describe("Comma-separated @handles to exclude"),
    limit: z.number().int().min(1).max(50).optional().describe("Max claims (default 20)"),
    days: z.number().int().min(1).max(90).optional().describe("Window in days (default 14)"),
  },
  async ({ niche, exclude, limit, days }) => {
    const data = await xfluxFetch("/smart-money/claims", {
      niche: niche ? String(niche).toUpperCase() : undefined,
      exclude: exclude || undefined,
      limit: limit ?? 20,
      days: days ?? 14,
    });
    return textResult(formatSmartMoneyClaims(data));
  }
);

server.resource(
  "trading-keywords",
  "xflux://docs/trading-keywords",
  { description: "Keyword templates for trading/macro XFlux monitors", mimeType: "text/plain" },
  async () => ({
    contents: [
      {
        uri: "xflux://docs/trading-keywords",
        mimeType: "text/plain",
        text: `XFlux monitor keyword templates (comma-separated, OR match):

Macro: fed, rate, inflation, CPI, PPI, GDP, jobs, treasury, yield, FOMC
Flow: flow, sweep, block, call, put, gamma, open interest
Earnings: earnings, EPS, guidance, beat, miss, revenue, outlook
Crypto: bitcoin, BTC, ethereum, ETH, ETF, halving, liquidation

Full guide: https://www.xfluxapi.com/docs/guides/trading-keywords
Monitors are configured in Dashboard (not via MCP write). Webhooks on Starter ($19/mo)+.
Use xflux_list_monitors / xflux_get_monitor_hits to inspect existing monitors.`,
      },
    ],
  })
);

server.resource(
  "monitors-setup",
  "xflux://docs/monitors",
  { description: "How to set up XFlux account monitors and webhooks", mimeType: "text/plain" },
  async () => ({
    contents: [
      {
        uri: "xflux://docs/monitors",
        mimeType: "text/plain",
        text: `XFlux monitors watch public @accounts on a schedule.

1. Register at https://www.xfluxapi.com/register
2. Dashboard → Monitors → add @username + optional keywords
3. First check baselines — only newer tweets become hits
4. Starter plan ($19/mo): paste HTTPS webhook URL for live delivery
5. Verify X-XFlux-Signature (HMAC-SHA256)

MCP (read-only): xflux_list_monitors, xflux_get_monitor_hits
REST: GET /api/v1/monitors , GET /api/v1/monitors/:id/hits

Docs: https://www.xfluxapi.com/docs/monitors
Make.com: https://www.xfluxapi.com/docs/integrations/make`,
      },
    ],
  })
);

server.resource(
  "smart-money",
  "xflux://docs/smart-money",
  {
    description: "Smart Money discovery niches, exclude usage, and monitor CTA",
    mimeType: "text/plain",
  },
  async () => ({
    contents: [
      {
        uri: "xflux://docs/smart-money",
        mimeType: "text/plain",
        text: `XFlux Smart Money — ranked X accounts that post forward-looking market calls.

Niches: MACRO | TRADING | CRYPTO | GEOPOLITICS

Agent workflow (prefer MCP tools over pasting long prompts into Google):
1. xflux_smart_money_list — limit=4, days=14, exclude="handle1,handle2,..."
2. xflux_smart_money_profile — dig into one @username
3. xflux_smart_money_claims — recent call stream across accounts
4. Open Dashboard → Monitors to watch any @handle + optional keywords/webhooks

Hub: https://www.xfluxapi.com/predictors
REST: GET /api/v1/smart-money , /api/v1/smart-money/:username , /api/v1/smart-money/claims

Not financial advice. Calls are auto-extracted from public tweets.`,
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
