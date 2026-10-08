If you've tried the official X (Twitter) API, you know the drill: application forms, tier pricing that starts at $100+/month, and approval delays. **XFlux** is built for developers who need read access and account monitoring without that overhead.

## What XFlux gives you

- **REST API** - profiles, timelines, search, tweet lookup
- **Account monitors** - poll public @handles on a schedule
- **Signed webhooks** - test pings on Free; live hit delivery on Starter+
- **Live signal digests** - 90+ public topic pages at [xfluxapi.com/signals](https://www.xfluxapi.com/signals?utm_source=devto&utm_medium=article)
- **Free tier** - 1,000 API calls/month, 1 monitor, no credit card

Docs: [xfluxapi.com/docs](https://www.xfluxapi.com/docs)

## 1. Create a free account

Register at [xfluxapi.com/register](https://www.xfluxapi.com/register?src=devto). A default API key is created automatically - you'll see it once on the dashboard after signup.

No approval wait. No credit card on the Free plan.

## 2. Make your first API call

Look up a public profile:

```bash
curl -X GET "https://www.xfluxapi.com/api/v1/users/elonmusk" \
  -H "Authorization: Bearer xflux_YOUR_KEY"
```

Search recent posts:

```bash
curl -G "https://www.xfluxapi.com/api/v1/search" \
  -H "Authorization: Bearer xflux_YOUR_KEY" \
  --data-urlencode "q=from:elonmusk" \
  --data-urlencode "limit=10"
```

User timeline:

```bash
curl -G "https://www.xfluxapi.com/api/v1/users/elonmusk/tweets" \
  -H "Authorization: Bearer xflux_YOUR_KEY" \
  --data-urlencode "limit=10"
```

All responses are normalized JSON. Keys are prefixed with `xflux_`.

## 3. Try the live demo (no signup)

The homepage has a built-in playground - Profile, Search, and Timeline tabs with live demo requests.

**Live demo:** [xfluxapi.com](https://www.xfluxapi.com)

Public demo routes are cached ~5 minutes and don't require an API key.

## 4. Add an account monitor (optional)

In **Dashboard > Monitors**, add `@username`. XFlux polls for new tweets so you don't need cron jobs or scrapers.

On **Starter ($19/mo)** and above, live hits are delivered to your webhook URL. On **Free**, you can still save a URL and send **test pings** (try [webhook.site](https://webhook.site)) to verify signatures:

```http
POST https://your-app.com/webhooks/xflux
X-XFlux-Event: monitor.test
X-XFlux-Signature: sha256=...
```

Paid plans send `monitor.hit` on real tweet matches:

```http
X-XFlux-Event: monitor.hit
```

Verify HMAC-SHA256 before trusting the payload. Full guide: [Webhook docs](https://www.xfluxapi.com/docs/webhooks)

Browse live X/Twitter digests by topic (AI, crypto, trading, startups): [xfluxapi.com/signals](https://www.xfluxapi.com/signals?utm_source=devto&utm_medium=article)

## Pricing snapshot

| Plan | Price | API calls/mo | Monitors |
| --- | --- | --- | --- |
| Free | $0 | 1,000 | 1 |
| Starter | $19 | 150,000 | 3 + webhooks |
| Pro | $99 | 1.2M | 20 |

Full limits: [xfluxapi.com/pricing](https://www.xfluxapi.com/pricing)

## When to use XFlux vs the official API

**Good fit for XFlux:**

- Prototyping with a free tier
- Read-only pipelines (RAG, sentiment, CRM enrichment)
- Monitoring specific accounts with webhooks
- Teams that want self-serve billing, not enterprise sales

**Stick with official X API if:**

- You need write access (posting, DMs) - XFlux read API only today
- You require official partnership / compliance certification

## Next steps

- [Live Signals hub](https://www.xfluxapi.com/signals?utm_source=devto&utm_medium=article)
- [API Reference](https://www.xfluxapi.com/docs/api)
- [Monitors guide](https://www.xfluxapi.com/docs/monitors)
- [Quickstart](https://www.xfluxapi.com/docs/quickstart)

Questions or feedback: [xfluxapi.com/feedback](https://www.xfluxapi.com/feedback)

*Disclosure: I'm building XFlux. If you try it, I'd love feedback on what you'd use it for - drop a comment or use the feedback form.*
