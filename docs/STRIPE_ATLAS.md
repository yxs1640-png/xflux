# Stripe Atlas — US C-Corp registration copy

Use the text below when applying for **Stripe Atlas** (Delaware C-Corp) and activating **Stripe Live**. Replace placeholders marked `[...]` after incorporation.

---

## Company details (Atlas form)

| Field | Suggested value |
|-------|-----------------|
| **Legal name** | XFlux, Inc. |
| **Entity type** | Delaware C Corporation |
| **DBA / product name** | XFlux |
| **Website** | https://xfluxapi.com |
| **Support email** | support@xfluxapi.com *(forward to your inbox via Cloudflare Email Routing)* |
| **Business category (Stripe)** | Software / SaaS |
| **MCC (if asked)** | 5734 — Computer Software Stores |

---

## Short business description (1–2 sentences)

> XFlux, Inc. operates a subscription-based software platform that provides developers and businesses with programmatic access to public X (Twitter) data through a REST API and an account monitoring service with webhook notifications. Customers pay monthly subscription fees for API quotas and monitor capacity.

---

## Detailed business description (Atlas “describe your business”)

> XFlux, Inc. is a Delaware C corporation that sells B2B software subscriptions to developers, researchers, and small teams worldwide.
>
> Our product, **XFlux**, is a hosted platform available at our website. It offers:
>
> 1. **XFlux API** — REST endpoints to look up public X/Twitter profiles, tweets, and search results. Customers authenticate with API keys and are billed based on monthly call quotas.
> 2. **XFlux Monitor** — A background monitoring service that watches public X accounts for new posts and delivers alerts via dashboard and optional customer-configured webhooks.
>
> Revenue is recurring subscription revenue (Free, Starter, Growth, Pro, and Scale tiers). We do not sell consumer physical goods. We do not operate a marketplace. Payment processing is handled by Stripe.
>
> We comply with applicable platform terms, prohibit illegal scraping or abuse, and publish Terms of Service, Privacy Policy, and Refund Policy on our website.

---

## Stripe Live — “Product or service description”

> Subscription SaaS: API access and social account monitoring for public X (Twitter) data. Monthly plans from $0–$249 with usage quotas.

---

## Stripe Live — Statement descriptor (card statement)

- **Descriptor:** `XFLUX API` or `XFLUX INC`
- Keep under 22 characters; avoid “Twitter” alone to reduce confusion with X Corp.

---

## URLs to provide Stripe / Atlas

| Page | URL |
|------|-----|
| Homepage | `/` |
| Pricing | `/pricing` |
| Terms of Service | `/terms` |
| Privacy Policy | `/privacy` |
| Refund Policy | `/refund` |
| Acceptable Use | `/acceptable-use` |
| Documentation | `/docs` |

Production base URL: `https://xfluxapi.com`

---

## Founder information (typical Atlas fields)

Prepare in English:

- Full legal name (as on passport)
- Date of birth
- Home address (China address is acceptable)
- Phone number
- Percentage ownership: 100% (if solo founder)
- Role: CEO / Director

---

## After incorporation — update these site placeholders

1. **`src/lib/legal-config.ts`** — legal entity name, state, support email
2. **Footer** — already links to legal pages
3. **Stripe Dashboard** — Business name → **XFlux, Inc.**
4. **Vercel** — no change required for legal pages

---

## Stripe Live checklist

### Done / in progress (XFlux)

- [x] Atlas application submitted (XFLUX, Inc., Delaware C-Corp)
- [x] Legal pages live: `/terms` `/privacy` `/refund` `/acceptable-use`
- [x] Stripe Payments activated (Live)
- [x] Mercury application submitted (awaiting approval)
- [ ] EIN received → upload to Mercury + Atlas + Stripe
- [ ] Mercury approved → link bank in Stripe for payouts
- [ ] Vercel Production: Live `STRIPE_*` + `BILLING_CHECKOUT_ENABLED=true` + Redeploy
- [ ] End-to-end Live test ($19 Starter + webhook 200)
- [ ] 83(b) proof filed and archived

### Reference (full launch)

- [ ] `support@xfluxapi.com` receives mail (Cloudflare Email Routing)
- [ ] Stripe Test checkout verified locally (before first Live deploy)
- [ ] Live Webhook: `https://xfluxapi.com/api/webhooks/stripe` + `whsec_...`
- [ ] Customer Portal: activate link; four paid products; quantity changes off
- [ ] CPA consulted for US + China tax reporting (1120, 5472, DE franchise tax)

---

*This document is operational guidance, not legal advice.*
