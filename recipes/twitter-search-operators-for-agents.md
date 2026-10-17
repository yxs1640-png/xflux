# Twitter search operators for agents

Pass the operator string as `q` on `GET /api/v1/search`, or as the `q` argument of MCP tool `xflux_search_tweets`.

This matches common public search grammar. It is not the official X recent-search product.

```bash
curl -G "https://www.xfluxapi.com/api/v1/search" \
  --data-urlencode 'q=from:elonmusk lang:en' \
  -H "Authorization: Bearer xflux_YOUR_KEY"
```

Operators that stay useful:

- `from:elonmusk` — that account only. Do not put `@` in the operator.
- `lang:en`
- `"fed rate"` — exact phrase. Combine with `OR`.
- Prefer `from:` plus a phrase. A bare keyword burns the free 1,000 calls on noise.

A prompt that works after installing the MCP server (https://www.xfluxapi.com/mcp):

> Search recent English posts from @elonmusk about rates using xflux_search_tweets. Do not scrape.

Search answers a question now. To get a Slack message every time an account posts, use a monitor (https://www.xfluxapi.com/monitor-twitter-account) instead of polling search.

Cheat sheet: https://www.xfluxapi.com/twitter-search-operators

Site version: https://www.xfluxapi.com/blog/twitter-search-operators-for-agents
