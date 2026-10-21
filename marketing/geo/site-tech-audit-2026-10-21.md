# Site tech audit (SEO + GEO) — 2026-10-21

Pass/fail against the dual-track checklist. Re-check in GSC after deploy.

## Title & meta description

| Check | Status | Notes |
|-------|--------|-------|
| Homepage title includes core job words | Pass | `XFlux — X/Twitter Read API & Account Monitors` |
| Default meta has numbers (1,000 / no card) | Pass | `DEFAULT_DESCRIPTION` in `src/lib/seo.ts` |
| Long-tail pages own one primaryKeyword each | Pass | `LONG_TAIL_LANDINGS` |
| Titles ~50–60 chars where possible | Watch | Some AAA/webhook titles run long; trim if CTR stays low |
| Meta descriptions ~150–160 chars | Watch | Spot-check top GSC URLs after 7 days |

## Schema

| Type | Where | Status |
|------|-------|--------|
| Organization | `OrganizationJsonLd` in root layout | Pass |
| SoftwareApplication | Home + Pricing product JSON-LD | Pass |
| FAQPage | Long-tail landings, docs FAQ, webhook hub, MCP, compare | Pass |
| BreadcrumbList | Long-tail landings + `/twitter-webhook` + `/mcp` | Pass |
| Product (pricing offers) | `/pricing` `PricingProductJsonLd` | Pass |

Logo URL: GitHub raw `mcp-server/icon-400.png` (no `public/icon.png` yet). Optional follow-up: ship `/icon.png` under `public/` and point Organization `logo` there.

## Sitemap & Search Console

| Check | Status | Notes |
|-------|--------|-------|
| `sitemap.ts` lists all long-tail paths | Pass | free-x-api, Slack, webhooks, AAA example, nodejs, timeline, lookup, verify, operators |
| `robots.ts` points at `/sitemap.xml` | Pass | |
| Submitted to GSC | Owner action | Confirm property `www.xfluxapi.com` → Sitemaps shows success |
| llms.txt / llms-full.txt | Pass | Updated with GEO URLs earlier |

## Internal links

| Check | Status | Notes |
|-------|--------|-------|
| Long-tail `related[]` hubs | Pass | Each page links hub + sibling jobs |
| Footer / compare / docs cross-links | Pass | Prior GSC wire-up |
| Orphan risk | Low | New landings in sitemap + related + footer; re-crawl if a page gets 0 impressions after 14d |

## Dual-track content format (step 2)

Pages with `verdict` + `facts` + compare table + long-tail FAQ:

- `/free-x-api`
- `/monitor-twitter-account`
- `/connect-slack-to-twitter`
- `/twitter-search-operators`
- `/twitter-search-api`
- `/account-activity-api-alternative`
- `/webhooks-twitter-integration`
- `/twitter-timeline-api`
- `/twitter-user-lookup`
- `/twitter-account-activity-api-example`
- `/twitter-api-nodejs`

Remaining long-tails still have cards/FAQ; upgrade when they enter top GSC impressions.

## Gaps / next fixes (optional)

1. Host `public/icon.png` (400×400) and switch Organization `logo` off GitHub raw.
2. Add BreadcrumbJsonLd to hub pages (`/twitter-webhook`, `/mcp`) if not already present.
3. After day-7 acceptance: retitle any URL with impressions >500 and CTR <1%.
