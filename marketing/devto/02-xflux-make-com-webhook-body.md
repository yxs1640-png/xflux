If you automate with **Make.com** (formerly Integromat), you probably already use **Custom Webhooks** as scenario triggers. What X does *not* give you is a webhook when `@someaccount` posts — so teams end up polling timelines or paying for enterprise streaming.

**XFlux** fills that gap: you pick a public @handle, optional keywords, and XFlux POSTs signed JSON to your Make URL when a new tweet matches.

Full docs: [xfluxapi.com/docs/integrations/make](https://www.xfluxapi.com/docs/integrations/make?utm_source=devto&utm_medium=article)

## What you need

- Free [XFlux](https://www.xfluxapi.com/register?src=devto_make) account (test webhooks on Free)
- [Make.com](https://www.make.com) account
- **Starter ($19/mo)** or above for **live** hit delivery (1s poll interval, 3 monitors)

## 1. Create a Make Custom Webhook

1. New **Scenario** in Make
2. First module: **Webhooks → Custom webhook → Add**
3. Copy the URL (`https://hook.us2.make.com/...`)
4. Turn the scenario **ON**

## 2. Configure XFlux

1. **Dashboard → Monitors →** add a monitor (`@username`)
2. Optional **keywords** (comma-separated) — tweet must contain at least one
3. Expand **Webhook** → paste Make URL → **Save**
4. Copy the signing secret (shown once)

## 3. Test it

Click **Test webhook** in XFlux. Make should show a `monitor.test` event:

```json
{
  "event": "monitor.test",
  "monitor": {
    "id": "clx...",
    "targetUsername": "elonmusk",
    "keywords": null
  },
  "test": true
}
```

If Make returns **400**, check the scenario is ON and re-run the test.

## 4. Live hits (Starter+)

When a new tweet passes your filters, XFlux sends:

```json
{
  "event": "monitor.hit",
  "monitor": {
    "id": "clx...",
    "targetUsername": "blknoiz06",
    "keywords": "launch, CA"
  },
  "tweet": {
    "id": "1234567890",
    "text": "New launch on Solana ...",
    "authorUsername": "blknoiz06",
    "createdAt": "2026-09-10T12:00:00.000Z"
  },
  "detectedAt": "2026-09-10T12:00:05.000Z"
}
```

Map `tweet.text`, `tweet.authorUsername`, and `detectedAt` into Slack, Telegram, Google Sheets, or an HTTP module.

Tweet link pattern:

```
https://x.com/{tweet.authorUsername}/status/{tweet.id}
```

## Example Make flow

```
Custom webhook (XFlux)
  → Router (monitor.hit only)
  → Telegram / Slack message
  → Google Sheets append row
```

Same pattern works with **Zapier** (Webhooks by Zapier) or **n8n** (Webhook node).

## Why not poll the API yourself?

Polling 1 account every 15 seconds is ~5,760 calls/day — mostly wasted when nobody posts. XFlux monitors run in the background; on Starter you get **1s polling** and **signed webhooks** without maintaining cron, cursors, or dedupe logic.

## Pricing snapshot

| Plan | Price | Monitors | Live webhooks | Min poll |
|------|-------|----------|---------------|----------|
| Free | $0 | 1 | Test only | 5 min |
| Starter | $19/mo | 3 | Yes | 1s |

Details: [xfluxapi.com/pricing](https://www.xfluxapi.com/pricing?utm_source=devto&utm_medium=article)

## Next steps

- [Make integration guide](https://www.xfluxapi.com/docs/integrations/make?utm_source=devto&utm_medium=article)
- [Webhook signatures](https://www.xfluxapi.com/docs/webhooks?utm_source=devto&utm_medium=article)
- [Free signup](https://www.xfluxapi.com/register?src=devto_make)

If you wire XFlux into Make for trading alerts, KOL tracking, or brand monitoring — reply with your scenario; curious what people build.
