Add under **APIs / Developer Tools** (or nearest social-media / API section):

```markdown
* [XFlux](https://www.xfluxapi.com) — X/Twitter read REST API (profiles, search, timelines) plus account monitors with signed HTTP webhooks. [Freemium]

  Free tier: 1,000 API calls/month, 1 monitor, instant API key. Paid from $19/mo.
```

## PR steps

1. Fork https://github.com/ripienaar/free-for-dev
2. Branch: `add-xflux`
3. Find the best section (search for "Twitter" or "API" in README.md)
4. Add the entry above in alphabetical order within that section
5. Open PR with title: `Add XFlux — X/Twitter API with free tier`

## PR body template

```
## Summary
Adds XFlux — a freemium X/Twitter read API with built-in account monitors.

## Service
- Website: https://www.xfluxapi.com
- Free tier: 1,000 API calls/month, no credit card
- REST API + optional signed webhooks on paid plans
```
