# Free X API: 1,000 calls a month, no credit card

[XFlux Free](https://www.xfluxapi.com/free-x-api) is an independent read API for public X/Twitter data. It is not the official API at developer.x.com.

Free includes:

- 1,000 API calls / month
- 1 account monitor (hits in the Dashboard)
- An instant key, no credit card

Live Slack, Discord, or HTTPS webhooks start on Starter at $19/mo.

## Smoke test

Register: https://www.xfluxapi.com/register?src=github_free. Copy the key from Dashboard → API Keys.

```bash
curl -H "Authorization: Bearer xflux_YOUR_KEY" \
  https://www.xfluxapi.com/api/v1/users/elonmusk
```

```bash
curl -G "https://www.xfluxapi.com/api/v1/search" \
  --data-urlencode 'q=from:elonmusk lang:en' \
  -H "Authorization: Bearer xflux_YOUR_KEY"
```

```bash
curl -G "https://www.xfluxapi.com/api/v1/users/elonmusk/tweets" \
  --data-urlencode "limit=10" \
  -H "Authorization: Bearer xflux_YOUR_KEY"
```

The same key works in Claude or Cursor:

```json
{
  "mcpServers": {
    "xflux": {
      "command": "npx",
      "args": ["-y", "@xflux/xflux-mcp-server"],
      "env": { "XFLUX_API_KEY": "xflux_YOUR_KEY" }
    }
  }
}
```

Tool calls count against the same 1,000. The server does not post tweets.

Site version: https://www.xfluxapi.com/blog/free-x-api-1000-calls
