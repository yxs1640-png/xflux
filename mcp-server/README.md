# XFlux MCP Server

Thin [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the XFlux **read API** to Claude Desktop, Cursor, and other MCP clients.

Monitors and webhooks are configured in the [Dashboard](https://www.xfluxapi.com/dashboard/monitors) — this server does not create monitors via API.

## Tools

| Tool | Description |
|------|-------------|
| `xflux_get_user` | Profile lookup by @username |
| `xflux_search_tweets` | Search recent tweets |
| `xflux_get_user_tweets` | User timeline |
| `xflux_get_tweet` | Single tweet by ID |

## Resources

- `xflux://docs/trading-keywords` — monitor keyword templates
- `xflux://docs/monitors` — monitor + webhook setup summary

## Setup

```bash
cd mcp-server
npm install
export XFLUX_API_KEY=xflux_your_key_here
node index.mjs
```

### Cursor / Claude Desktop config

Add to your MCP settings (adjust path):

```json
{
  "mcpServers": {
    "xflux": {
      "command": "node",
      "args": ["/absolute/path/to/xflux/mcp-server/index.mjs"],
      "env": {
        "XFLUX_API_KEY": "xflux_your_key_here"
      }
    }
  }
}
```

Optional: `XFLUX_API_BASE` (default `https://www.xfluxapi.com/api/v1`) for local dev.

## Docs

https://www.xfluxapi.com/docs/integrations/mcp
