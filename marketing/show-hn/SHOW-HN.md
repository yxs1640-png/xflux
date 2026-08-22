# Show HN — XFlux

Submit at: https://news.ycombinator.com/submit

**Best time:** Tue–Thu, **8–10 AM Pacific** (10 PM–midnight CST). Stay online **2–3 hours** after posting to reply fast.

---

## Submit form

| Field | Value |
|-------|--------|
| **title** | `Show HN: XFlux – X/Twitter read API and account monitors (free tier)` |
| **url** | `https://www.xfluxapi.com` |
| **text** | *(leave empty — put details in first comment)* |

Title must start with `Show HN:`.

---

## First comment (post immediately after submit)

Copy-paste as your first reply on the thread:

```
Hi HN — maker here.

I built XFlux because the official X API pricing/approval slowed down side projects that only need read access and “tell me when @account posts.”

What it does today:
- REST API: profiles, timelines, search, tweet lookup (Bearer token, normalized JSON)
- Account monitors: poll public @handles on a schedule (no cron on your side)
- Signed HTTP webhooks on paid plans ($19/mo+)
- Free tier: 1,000 API calls/month, 1 monitor, instant API key, no credit card

Try without signup: homepage has a live API playground (cached public demo).

Quickstart tutorial: https://dev.to/xfluxapi/get-started-with-xflux-xtwitter-api-in-60-seconds-e40
Docs: https://www.xfluxapi.com/docs/api

Honest limitations:
- Read-only (no posting/DMs)
- Not the official X API — we aggregate public data via our own pipeline
- Free tier has rate limits; webhooks require Starter+

Happy to answer questions on architecture, pricing, or your use case (alerts, RAG, CRM enrichment, etc.).
```

Optional signup link with tracking (use in replies, not as main URL):

`https://www.xfluxapi.com/register?src=reddit_hn`

---

## Reply templates

**Pricing / vs official X API**

> Official Basic is $100+/mo with approval. We target read + monitor use cases: Free 1k calls/mo, Starter $19 for 150k calls + webhooks. Pricing page is public: https://www.xfluxapi.com/pricing

**Is the code open source?**

> Backend is hosted SaaS (not open source). Docs and API are public; you integrate via REST. Happy to share more on how we fetch/cache if useful.

**Reliability / ToS**

> We only expose public read data. Uptime and rate limits are documented in the dashboard Usage tab. If you have a specific SLA need, email support@xfluxapi.com.

**Why not scrape yourself?**

> You can — XFlux is for teams that want a stable API + optional monitors/webhooks without maintaining proxies, parsers, and polling jobs.

---

## Launch checklist

- [ ] Logged into HN account (age + karma help; new accounts may be flagged)
- [ ] Title + URL submitted
- [ ] First comment posted within 1 minute
- [ ] Dev.to article link in comment ✓
- [ ] Monitor thread every 15–30 min for 3 hours
- [ ] Check PostHog / DB for `signup_source = reddit_hn` next day
- [ ] Do **not** ask friends to upvote (HN detects vote rings)

---

## If it doesn't gain traction

- One Show HN per product is usually enough; don't repost the same week
- Try **Ask HN** angle later: “How do you monitor Twitter accounts without the official API?”
- Reddit r/SideProject or r/webdev as backup (same week is fine)
