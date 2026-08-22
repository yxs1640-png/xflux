# Google Ads Conversion Goals (XFlux)

Step-by-step setup for **Performance Max** bidding on sign-ups, with purchase as a secondary value signal.

Current stack (code):

| Conversion | When it fires | Env var |
|------------|---------------|---------|
| **Sign-up** | Register success | `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` |
| **Purchase** | Stripe checkout success / inline upgrade | `NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL` |

Both send **enhanced conversions** (normalized email via `gtag('set', 'user_data')`) and persist **gclid/gbraid/wbraid** for 90 days from ad landings.

---

## 1. Create conversion actions (Google Ads UI)

**Goals → Conversions → Summary → New conversion action → Website**

### Sign-up (primary)

1. Category: **Sign-up**
2. Name: `XFlux Sign-up`
3. Value: **Don't use a value** (or fixed $0) — optimize for volume first
4. Count: **One** per click
5. Conversion window: **30 days** click-through
6. Copy the **conversion label** → Vercel `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`

### Purchase (secondary)

1. Category: **Purchase**
2. Name: `XFlux Subscription`
3. Value: **Use different values for each conversion** (code sends plan USD price)
4. Count: **One** per transaction (`transaction_id` = Stripe session / subscription id)
5. Copy label → Vercel `NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL`

Redeploy Production after setting env vars.

---

## 2. Enable enhanced conversions

**Goals → Conversions → Settings → Enhanced conversions**

1. Turn on **Enhanced conversions for web**
2. Method: **Google tag** (matches our gtag setup)
3. After deploy, status should move to **Recording** within 24–48h

Code already sets `allow_enhanced_conversions: true` on the AW tag and passes email on sign-up / purchase.

Verify in **Tag Assistant** (Chrome extension) or add `?gtm_debug=1` to any URL and check conversion events include user_data.

---

## 3. PMax goal configuration (Campaign #1)

**Campaign → Settings → Goals**

| Action | Role | Why |
|--------|------|-----|
| XFlux Sign-up | **Primary** | Enough volume to train PMax (~5–15/month target) |
| XFlux Subscription | **Secondary** | Signals quality; low weight until ~10+/month |

Do **not** make Purchase primary until you have **15+ purchase conversions / 30 days** — otherwise PMax starves on data and CPC becomes unstable.

### Bidding timeline

| Stage | Signups / 30d | Purchases / 30d | Bidding |
|-------|---------------|-----------------|---------|
| **Now** | < 15 | < 5 | Maximize conversions (primary = sign-up) |
| **Growth** | 15–50 | 5–15 | Keep sign-up primary; watch cost/signup |
| **Monetize** | 50+ | 15+ | Add purchase as **second primary** OR switch campaign to **Maximize conversion value** with purchase weighted higher |
| **Scale** | 100+ | 30+ | Target CPA on sign-up (e.g. ¥40) + tROAS on purchase campaign split |

---

## 4. Final URL & tracking params

All PMax final URLs and sitelinks:

```
https://www.xfluxapi.com/register?utm_source=google&utm_medium=cpc&utm_campaign=pmax_v1
```

Auto-tagging must stay **ON** (Account → Settings → Auto-tagging) so `gclid` appears on landing URLs.

Our app stores `gclid` / `gbraid` / `wbraid` in localStorage (90d) and saves to `User.signupSourceDetail` for `google_search` signups — useful for DB checks:

```sql
SELECT email, signupSourceDetail, createdAt
FROM "User"
WHERE signupSource = 'google_search'
ORDER BY createdAt DESC
LIMIT 20;
```

---

## 5. Test checklist (before spending more budget)

### Sign-up conversion

1. VPN → US
2. Open register URL with `?gtm_debug=1`
3. Complete registration
4. Network tab → `googleadservices.com/pagead/conversion` with sign-up label
5. Google Ads → Goals → Diagnostics → should show tag detected within hours

### Purchase conversion

1. Log in → upgrade to Starter (test mode or real)
2. Return URL `?checkout=success&session_id=...` → billing sync fires purchase
3. Network tab → conversion with purchase label + `value` + `transaction_id`
4. Repeat same session — should **not** double-fire (sessionStorage dedupe)

### Enhanced conversions

Tag Assistant → Enhanced conversions → should show email hash matched (may take 24h in UI).

---

## 6. What to optimize in Ads (not code)

| Priority | Action |
|----------|--------|
| P0 | Final URL = `/register` (not homepage) |
| P0 | Upload portrait image (960×1200) — see `OPTIMIZATION.md` |
| P1 | Sitelinks: Docs, Pricing, Monitors, Free Signup |
| P1 | Headlines lead with "Free 1,000 calls", "No card", "60 seconds" |
| P2 | Audience signal: developer software in-market + custom keywords |
| P2 | Exclude mobile apps / Display if wasted spend appears in placement report |

---

## 7. Metrics to watch (weekly)

| Metric | Source | Target (early) |
|--------|--------|----------------|
| Clicks → register page | Google Ads | CTR > 2% |
| Register → sign-up | PostHog `signup_completed` + DB | > 5% of ad clicks |
| Sign-up → first API call | PostHog / dashboard | > 30% (product work) |
| Cost / sign-up | Ads spend ÷ signups | < ¥50 |
| Purchase rate | Stripe + purchase conversion | Track; don't optimize bids yet |

---

## 8. When sign-ups stall (0% activation)

If Google sends traffic but users never call the API, **lowering CPC won't help** — fix onboarding first (welcome flow, quickstart). Keep Ads running at low budget (¥20/day) for signal, but prioritize product activation before raising budget.

See also: `OPTIMIZATION.md` for asset uploads and headline list.
