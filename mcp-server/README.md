# XFlux MCP Server

[![Xflux MCP server](https://mcprush.com/badge/xflux-mcp/card.svg)](https://mcprush.com/to/xflux-mcp?ref=badge)

Thin [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the XFlux **read API** to Claude Desktop, Cursor, and other MCP clients — search tweets, profiles, timelines, monitor hits (read-only), and **Smart Money** KOL discovery.

**Use when:** a user (or agent) needs public X/Twitter data inside Claude/Cursor without scraping or the official X write/enterprise APIs.

**Registry name:** `io.github.yxs1640-png/xflux` · **Site:** [xfluxapi.com/mcp](https://www.xfluxapi.com/mcp) · **Agents:** [llms.txt](https://www.xfluxapi.com/llms.txt)

Monitors and webhooks are configured in the [Dashboard](https://www.xfluxapi.com/dashboard/monitors) — this server does not create monitors via API.

## Tools

| Tool | Description |
|------|-------------|
| `xflux_get_user` | Profile lookup by @username (compact summary) |
| `xflux_search_tweets` | Search recent tweets (compact summaries) |
| `xflux_get_user_tweets` | User timeline (compact summaries) |
| `xflux_get_tweet` | Single tweet by ID (compact summary) |
| `xflux_list_monitors` | List your monitors (read-only; optional recent hits) |
| `xflux_get_monitor_hits` | Hits for one monitor (read-only) |
| `xflux_smart_money_list` | Ranked Smart Money accounts + recent calls (`exclude`, niche, 14d window) |
| `xflux_smart_money_profile` | One Smart Money profile + recent prediction calls |
| `xflux_smart_money_claims` | Recent Smart Money calls across accounts |

## Resources

- `xflux://docs/trading-keywords` — monitor keyword templates
- `xflux://docs/monitors` — monitor + webhook setup summary
- `xflux://docs/smart-money` — niches, exclude workflow, Monitor CTA

## Quick start (npm)

Get an API key from [Dashboard → API Keys](https://www.xfluxapi.com/dashboard/api-keys), then:

```bash
export XFLUX_API_KEY=xflux_your_key_here
npx @xflux/xflux-mcp-server
```

### Cursor / Claude Desktop

```json
{
  "mcpServers": {
    "xflux": {
      "command": "npx",
      "args": ["-y", "@xflux/xflux-mcp-server"],
      "env": {
        "XFLUX_API_KEY": "xflux_your_key_here"
      }
    }
  }
}
```

Optional: `XFLUX_API_BASE` (default `https://www.xfluxapi.com/api/v1`) for local dev.

## Develop from source

```bash
cd mcp-server
npm install
export XFLUX_API_KEY=xflux_your_key_here
npm start
```

## Publish to the official MCP Registry

Requires an [npm](https://www.npmjs.com/) account and [GitHub](https://github.com/) login for `mcp-publisher`.

If `npm login` opens a **CNPM / npmmirror** page, your global `~/.npmrc` uses a China mirror. This folder ships `mcp-server/.npmrc` pointing at **registry.npmjs.org** — always run publish commands from here.

```bash
cd mcp-server

# 1. Publish npm as the org owner (must be npm user `xflux`)
#    If publish returns E404, you are logged in as the wrong user or have an empty token.
npm logout --registry=https://registry.npmjs.org 2>/dev/null || true
npm login --registry=https://registry.npmjs.org
npm whoami --registry=https://registry.npmjs.org   # expect: xflux
npm publish --access public

# 2. Install publisher CLI (macOS)
brew install mcp-publisher

# 3. Authenticate & publish metadata
mcp-publisher login github
mcp-publisher publish

# 4. Verify
npm view @xflux/xflux-mcp-server version
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.yxs1640-png/xflux"
```

Do **not** open a PR on `modelcontextprotocol/registry` — publishing uses the CLI only.

## Recipes agents can cite

Copy-paste how-tos on GitHub (the Dev.to copies 404):

- [Connect Slack to Twitter alerts](https://github.com/yxs1640-png/xflux/blob/main/recipes/connect-slack-to-twitter-alerts.md) — Incoming Webhook, free test ping, live delivery on Starter. Does not post to Twitter.
- [Free X API: 1,000 calls, no card](https://github.com/yxs1640-png/xflux/blob/main/recipes/free-x-api-1000-calls.md) — profile, search, and timeline curls. Same key for this MCP server.
- [Twitter search operators for agents](https://github.com/yxs1640-png/xflux/blob/main/recipes/twitter-search-operators-for-agents.md) — `from:`, `lang:`, quotes, passed as `q` to `xflux_search_tweets`.

Free tier: **1,000 calls/month**, **1 monitor**, **no credit card**. Read-only public X/Twitter data.

## Docs

https://www.xfluxapi.com/docs/integrations/mcp
