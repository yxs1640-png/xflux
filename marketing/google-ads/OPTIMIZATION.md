# Google Ads Optimization Checklist (XFlux)

Current campaign: **Campaign #1** · Performance Max · ¥20/day · US · Maximize conversions.

## P0 — Do today (biggest impact)

### 1. Change final URL to register page

Google Ads → Campaign #1 → Asset group → **Final URL**:

```
https://www.xfluxapi.com/register?utm_source=google&utm_medium=cpc&utm_campaign=pmax_v1
```

Why: 13 clicks / 0 signups — homepage adds an extra step. Register page matches conversion goal (`/register` page view).

### 2. Upload missing images (fix「较差」 ad strength)

Open folder: `marketing/google-ads/`

| Slot | File | Size |
|------|------|------|
| Landscape ×3+ | `01-homepage-hero.png`, `02-pricing.png`, `04-monitors-doc.png` | 1200×628 |
| **Portrait ×1** | **`07-portrait-960x1200.png`** | 960×1200 |
| Square ×1 | `06-square-padded.png` | 1200×1200 |

Target: ad strength **Average → Good** (良好).

### 3. Verify conversion in Google Ads

Goals → Conversions → **网页浏览** → Status should become **Active** within 24–48h after SSR conversion deploy.

Test: VPN → open `/register` → check Network for `googleadservices.com/pagead/conversion`.

---

## P1 — This week

### 4. Sitelinks (4+)

| Text | URL |
|------|-----|
| Free Signup | `/register?utm_source=google&utm_medium=cpc` |
| API Docs | `/docs` |
| Pricing | `/pricing` |
| Monitor Guide | `/docs/monitors` |

### 5. Headlines — lead with conversion hooks

Ensure these 5 are in the set (replace weakest duplicates):

1. Free 1,000 API Calls / Month
2. Instant API Key, No Card
3. Start Free in 60 Seconds
4. X/Twitter Read API for Devs
5. Account Monitors Built In

### 6. Audience signal (optional)

Asset group → Audience → add:

- In-market: **Programming & developer software**
- Custom segment keywords: `twitter api`, `x api alternative`, `twitter api pricing`

---

## P2 — After 7 days of data

### 7. Review metrics (Jul 26 baseline)

| Metric | Baseline | Target (7d) |
|--------|----------|-------------|
| CTR | 3.60% | > 2% |
| CPC | ¥1.15 | < ¥2 |
| Clicks → Register | 0% | > 5% |
| Cost / signup | — | < ¥50 (early) |

Check DB: `User` where `signupSource = 'google_search'` and `createdAt` recent.

### 8. When to adjust budget

- **Increase** (¥20 → ¥30/day): 3+ signups in 7 days, CPC stable
- **Pause / reduce**: 50+ clicks, 0 signups after landing page fix + 7 days
- **Switch strategy**: after 15+ conversions/month, try tCPA

### 9. Do NOT do yet

- Display-only campaigns (low intent for dev tools)
- Broad geo beyond US/CA/UK/AU
- Target CPA bidding (not enough conversion data)

---

## Tracking alignment

| Layer | What |
|-------|------|
| Google Ads | Page view conversion on `/register` |
| PostHog | `$pageview`, `signup_completed` with UTM |
| Database | `User.signupSource = google_search` when `utm_source=google` |

Register URL for all ad links:

```
https://www.xfluxapi.com/register?utm_source=google&utm_medium=cpc&utm_campaign=pmax_v1
```
