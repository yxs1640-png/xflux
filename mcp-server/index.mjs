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
    headers: { Authorization: `Bearer ${API_KEY}` },
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

const server = new McpServer({
  name: "xflux",
  version: "1.1.0",
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

const transport = new StdioServerTransport();
await server.connect(transport);
