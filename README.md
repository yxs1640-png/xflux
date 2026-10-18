# XFlux

Read-only X/Twitter API for agents and apps: profiles, search, timelines, account monitors with signed webhooks, and Smart Money. Not for posting.

**Site:** [xfluxapi.com](https://www.xfluxapi.com) · **MCP:** [xfluxapi.com/mcp](https://www.xfluxapi.com/mcp) · **Agents:** [llms.txt](https://www.xfluxapi.com/llms.txt)

Free tier: **1,000 calls/month**, **1 monitor**, **no credit card**. Paid plans add signed HTTP webhooks and higher quotas.

## What it does

- **Read API** — public profiles, timelines, single tweets, and search. Bearer key, JSON.
- **Monitors** — watch @handles on a schedule. New tweets are delivered with a signed webhook on paid plans. Create monitors in the [Dashboard](https://www.xfluxapi.com/dashboard/monitors), not by posting to the API.
- **Smart Money** — ranked KOL accounts and recent calls (read-only).
- **MCP server** — the same read API inside Claude Desktop, Cursor, and other MCP clients.

This service does not post tweets, send DMs, or require official X API approval.

## REST API

Base URL: `https://www.xfluxapi.com/api/v1`

```bash
curl -H "Authorization: Bearer xflux_YOUR_KEY" \
  https://www.xfluxapi.com/api/v1/users/x
```

Get a key at [Dashboard → API Keys](https://www.xfluxapi.com/dashboard/api-keys).

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/users/:username` | Profile |
| GET | `/api/v1/users/:username/tweets` | Timeline |
| GET | `/api/v1/tweets/:id` | One tweet |
| GET | `/api/v1/search?q=` | Search tweets |
| GET | `/api/v1/monitors` | Your monitors (read-only) |
| GET | `/api/v1/monitors/:id/hits` | Hits for one monitor (read-only) |

Docs: https://www.xfluxapi.com/docs

## MCP

Registry name `io.github.yxs1640-png/xflux`. npm package [`@xflux/xflux-mcp-server`](https://www.npmjs.com/package/@xflux/xflux-mcp-server).

```bash
export XFLUX_API_KEY=xflux_your_key_here
npx -y @xflux/xflux-mcp-server
```

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

| Tool | Description |
|------|-------------|
| `xflux_get_user` | Profile by @username |
| `xflux_search_tweets` | Search recent tweets |
| `xflux_get_user_tweets` | User timeline |
| `xflux_get_tweet` | One tweet by ID |
| `xflux_list_monitors` | List monitors (read-only) |
| `xflux_get_monitor_hits` | Hits for one monitor |
| `xflux_smart_money_list` | Ranked Smart Money accounts |
| `xflux_smart_money_profile` | One Smart Money profile |
| `xflux_smart_money_claims` | Recent Smart Money calls |

Server details: [mcp-server/README.md](mcp-server/README.md). Docs: https://www.xfluxapi.com/docs/integrations/mcp

## Recipes

- [Connect Slack to Twitter alerts](recipes/connect-slack-to-twitter-alerts.md)
- [Free X API: 1,000 calls, no card](recipes/free-x-api-1000-calls.md)
- [Twitter search operators for agents](recipes/twitter-search-operators-for-agents.md)

## This repository

The public product runs from this repo: the website on Vercel, the API proxy and monitor worker on Fly.io, and the MCP package in `mcp-server/`. Deploy notes: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## License

MIT
