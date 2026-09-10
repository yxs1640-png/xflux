# Google Ads — Make / Automation long-tail (Search)

**Keep the existing Performance Max / API campaign running.** This file is a **second campaign** targeting Make/Zapier/automation intent. Do not replace headlines in Campaign #1 — add this as a separate Search campaign or asset group when ready.

## Campaign setup

| Setting | Value |
|---------|--------|
| Type | **Search** (not Display) |
| Goal | Sign-up (same conversion as PMax) |
| Geo | US, CA, UK, AU (match existing) |
| Budget | Start **¥10–15/day** (test alongside PMax ¥20/day) |
| Bidding | Maximize conversions (switch to tCPA after 15+ signups/month) |
| Final URL | `https://www.xfluxapi.com/docs/integrations/make?utm_source=google&utm_medium=cpc&utm_campaign=make_automation_v1` |
| Alternative URL | `https://www.xfluxapi.com/register?utm_source=google&utm_medium=cpc&utm_campaign=make_automation_v1` |

### Why this landing page

Users searching Make/automation terms want a **how-to**, not a generic homepage. `/docs/integrations/make` matches intent and links to register.

---

## Keywords (Phrase & Exact match)

Add as **Phrase match** first; promote winners to Exact.

### Tier A — high intent

```
"twitter webhook make"
"twitter make.com integration"
"x webhook make"
"monitor twitter make"
"twitter automation make"
"make.com twitter webhook"
"twitter account monitor webhook"
```

### Tier B — automation / no-code

```
"twitter zapier webhook"
"twitter webhook automation"
"x twitter webhook integration"
"twitter alert webhook"
"watch twitter account webhook"
"twitter monitor webhook api"
```

### Tier C — use-case long-tail

```
"twitter trading bot webhook"
"memecoin twitter alert"
"twitter kOL monitor webhook"
"twitter to slack webhook"
"twitter to telegram automation"
```

### Negative keywords (shared with API campaign)

```
free twitter api official
twitter developer portal
post tweet
write tweet
login twitter
jobs
course
tutorial python scrape
nitter
```

---

## Headlines (15 max — paste into Search ads)

**Keep existing API headlines in Campaign #1.** Use this set only for the Make/automation campaign:

1. Twitter Webhooks for Make.com
2. X Monitor → Make Automation
3. No Polling Code Required
4. Signed JSON to Your Webhook
5. Watch @Accounts on a Schedule
6. Connect Make in 5 Minutes
7. 1s Poll + Webhooks From $19
8. XFlux + Make Custom Webhook
9. Free Tier — Test Webhooks
10. Instant Signup, No Card
11. REST API + Monitors Included
12. Keyword Filters on Monitors
13. Slack, Telegram via Make
14. Alternative to X API $100+
15. Docs + Step-by-Step Guide

---

## Descriptions (4 recommended)

1. Watch public X accounts and POST signed JSON to your Make Custom Webhook. Step-by-step guide. Free test pings.
2. No cron jobs or polling code. XFlux monitors @handles and delivers webhooks on Starter from $19/mo with 1s polling.
3. Route tweet alerts to Slack, Telegram, or Sheets through Make. Compatible with Zapier and n8n webhooks too.
4. REST API + account monitors in one platform. 1,000 free API calls/mo. Upgrade when you need live webhook delivery.

---

## Sitelinks (Make campaign)

| Text | URL |
|------|-----|
| Make.com Guide | `/docs/integrations/make?utm_source=google&utm_medium=cpc&utm_campaign=make_automation_v1` |
| Free Signup | `/register?utm_source=google&utm_medium=cpc&utm_campaign=make_automation_v1` |
| Webhook Docs | `/docs/webhooks?utm_source=google&utm_medium=cpc&utm_campaign=make_automation_v1` |
| Pricing | `/pricing?utm_source=google&utm_medium=cpc&utm_campaign=make_automation_v1` |

---

## Ad strength assets

Reuse from `marketing/google-ads/`:

- `04-monitors-doc.png` — monitor + webhook UI
- `01-homepage-hero.png` — brand
- `07-portrait-960x1200.png` — portrait slot

Optional: screenshot `/docs/integrations/make` after deploy for a Make-specific creative.

---

## Audience signals (optional)

- In-market: **Business automation software**
- Custom segment URLs: `make.com`, `zapier.com`, `n8n.io`
- Custom segment keywords: `make.com scenario`, `zapier webhook`, `twitter automation`

---

## Tracking

| Event | UTM campaign |
|-------|----------------|
| Make landing | `make_automation_v1` |
| Existing PMax | `pmax_v1` (unchanged) |

Check signups: `User.signupSource = 'google_search'` and `signupSourceDetail` contains `make_automation_v1` or landing path in PostHog.

---

## Rollout checklist

- [ ] Deploy `/docs/integrations/make` to production
- [ ] Create Search campaign **Make Automation v1** (do not edit PMax asset group)
- [ ] Final URL → Make tutorial page
- [ ] Paste headlines/descriptions from this file
- [ ] Add Tier A keywords (phrase match)
- [ ] Add negative keyword list
- [ ] Publish Dev.to article → add canonical link in ad extensions (optional)
- [ ] Review after 7 days: CTR, CPC, signups vs API campaign
