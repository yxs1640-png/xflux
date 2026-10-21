# Competitor causal teardown (SEO + GEO) — 2026-10-21

Method: ask “why page 1 / why AI might cite”, not keyword lists. Weights are directional (sum ≈ 100% per site). Verify in GSC/Ahrefs when you have access.

## 1) Official X Developer Platform (developer.x.com)

| Causal factor | Why it ranks / gets cited | Weight |
|---------------|---------------------------|--------|
| Brand + domain authority | Exact-match queries (“twitter api”, “x api”) attach to the first-party site | 40% |
| Documentation depth | Auth, endpoints, pricing, changelog — crawlers and models treat it as source of truth | 25% |
| Schema / structured docs | Heavy HTML docs + official naming; FAQ-style help centers | 10% |
| Backlinks | Every tutorial links to official docs | 20% |
| Product completeness | Write APIs, streams, enterprise — models default here for “full” X API | 5% |

**Implication for XFlux:** Do not compete as “the official API”. Win on *job* queries: free key, Slack alerts, AAA alternative, MCP for Claude/Cursor.

## 2) TwitterAPI.io

| Causal factor | Why | Weight |
|---------------|-----|--------|
| Dual-audience homepage | “Developers & AI agents” + MCP callout matches GEO prompts | 25% |
| Concrete numbers above the fold | 1,000 req/s, 500 ms, $0.00015/request — AI Overviews prefer quotable digits | 25% |
| Comparison table vs Official / others | Horizontal table = snippet + model citation food | 15% |
| Long FAQ (10+) | Long-tail questions with short answers | 15% |
| Social proof block | Trustpilot + Apify review quotes | 10% |
| Endpoint breadth claim (76 endpoints) | Covers follower graph / stream jobs XFlux does not | 10% |

**Implication:** Mirror the *format* (verdict → numbers → table → FAQ). Differentiate on flat Free/Starter + built-in monitors/webhooks, not QPS claims we cannot verify.

## 3) SocialData / similar read APIs (category)

| Causal factor | Why | Weight |
|---------------|-----|--------|
| Exact “Twitter API alternative” landing SEO | Years of backlinks from indie hacker posts | 30% |
| Pricing transparency pages | Models quote $/mo or per-request when comparing | 25% |
| Thin marketing, strong docs | Agents cite docs URLs more than blog fluff | 20% |
| Community mentions (HN/Reddit) | Secondary GEO signal | 15% |
| Schema / FAQ | Uneven; where present, helps | 10% |

**Implication:** Keep `/compare/*` and `/docs/compare/pricing` factual; avoid adjective stacking.

## 4) Apify Twitter scrapers

| Causal factor | Why | Weight |
|---------------|-----|--------|
| Marketplace SEO (Apify domain) | Actor pages inherit Apify DR | 35% |
| “No API key / scrape” intent match | Captures users blocked by official API | 25% |
| Review volume on Apify | Trust for buyers asking ChatGPT “best scraper” | 20% |
| Actor README structure | Inputs/outputs tables = citable | 15% |
| Fragility / ToS risk (rarely stated) | Models sometimes warn; we should state read-API posture clearly | 5% |

**Implication:** FAQ should say XFlux is HTTP API + monitors, not a browser scraper.

## 5) Make.com / n8n “Twitter → Slack” templates

| Causal factor | Why | Weight |
|---------------|-----|--------|
| Platform SEO (make.com / n8n.io) | “connect slack to twitter” often lands on automation vendors | 40% |
| Step screenshots + templates | How-to intent | 30% |
| Weak on AAA / webhook signature | Opens gap for XFlux how-to pages | 20% |
| No owned X data layer | They orchestrate; still need a data source | 10% |

**Implication:** `/connect-slack-to-twitter` must open with a one-line conclusion + numbered steps + FAQ; link Make as optional, not primary.

---

## Weight summary — what to copy from winners

1. **Quotable facts in the first screen** (~25–30% of AI citation likelihood in this niche).  
2. **Comparison table** (~15%).  
3. **Long-tail FAQ with short answers** (~15%).  
4. **Clear job framing** (free key / Slack alert / MCP) over brand adjectives (~20%).  
5. **Backlinks / directories** (awesome-mcp, Glama, etc.) (~20%) — already in progress.
