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

const server = new McpServer({
  name: "xflux",
  version: "1.0.0",
});

server.tool(
  "xflux_get_user",
  "Look up a public X/Twitter user profile by @username.",
  { username: z.string().describe("Handle without @, e.g. elonmusk") },
  async ({ username }) => {
    const data = await xfluxFetch(`/users/${encodeURIComponent(username.replace(/^@/, ""))}`);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

server.tool(
  "xflux_search_tweets",
  "Search recent public tweets via XFlux (same query syntax as X search).",
  {
    q: z.string().describe('Search query, e.g. from:elonmusk or "fed rate" lang:en'),
    limit: z.number().int().min(1).max(100).optional().describe("Max results (default 20)"),
  },
  async ({ q, limit }) => {
    const data = await xfluxFetch("/search", { q, limit: limit ?? 20 });
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

server.tool(
  "xflux_get_user_tweets",
  "Fetch recent tweets from a public @username timeline.",
  {
    username: z.string().describe("Handle without @"),
    limit: z.number().int().min(1).max(100).optional().describe("Max results (default 20)"),
  },
  async ({ username, limit }) => {
    const handle = username.replace(/^@/, "");
    const data = await xfluxFetch(`/users/${encodeURIComponent(handle)}/tweets`, {
      limit: limit ?? 20,
    });
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

server.tool(
  "xflux_get_tweet",
  "Look up a single tweet by numeric ID.",
  { id: z.string().describe("Tweet ID") },
  async ({ id }) => {
    const data = await xfluxFetch(`/tweets/${encodeURIComponent(id)}`);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
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
Monitors are configured in Dashboard (not via REST API). Webhooks on Starter ($19/mo)+.`,
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

Docs: https://www.xfluxapi.com/docs/monitors
Make.com: https://www.xfluxapi.com/docs/integrations/make`,
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
