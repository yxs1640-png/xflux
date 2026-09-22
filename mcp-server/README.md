# XFlux MCP Server

Thin [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the XFlux **read API** to Claude Desktop, Cursor, and other MCP clients.

**Registry name:** `io.github.yxs1640-png/xflux`

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

## Resources

- `xflux://docs/trading-keywords` — monitor keyword templates
- `xflux://docs/monitors` — monitor + webhook setup summary

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

# 1. Publish npm package (official registry only)
npm login --registry=https://registry.npmjs.org
npm publish --access public

# 2. Install publisher CLI (macOS)
brew install mcp-publisher

# 3. Authenticate & publish metadata
mcp-publisher login github
mcp-publisher publish

# 4. Verify
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.yxs1640-png/xflux"
```

Do **not** open a PR on `modelcontextprotocol/registry` — publishing uses the CLI only.

## Docs

https://www.xfluxapi.com/docs/integrations/mcp
