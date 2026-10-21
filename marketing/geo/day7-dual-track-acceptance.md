# Day-7 dual-track acceptance — SEO + GEO

**Baseline date:** 2026-10-21 (after dual-track deploy)  
**Check date:** 2026-10-28  
**Rule:** Google **and** ChatGPT (or Claude / Perplexity) must surface XFlux for the same job query. One side only → dig into that track.

Use incognito / logged-out where possible. Record: URL cited, position/snippet, model answer text (quote ≤1 line).

---

## A) Google (SEO)

| # | Query | Target URL | Pass if |
|---|-------|------------|---------|
| G1 | `free x api` / `x api free` | `/free-x-api` | Page in top 20 **or** sitelink/snippet with “1,000” / “no card” |
| G2 | `monitor twitter account` | `/monitor-twitter-account` | Own page or hub in top 20 |
| G3 | `connect slack to twitter` | `/connect-slack-to-twitter` | How-to page visible |
| G4 | `account activity api alternative` | `/account-activity-api-alternative` | Alternative page visible |
| G5 | `webhooks twitter integration` / `twitter webhook` | `/webhooks-twitter-integration` or `/twitter-webhook` | Hub or integration page |
| G6 | `twitter search operators` | `/twitter-search-operators` | Operators page or blog |
| G7 | `twitter timeline api` | `/twitter-timeline-api` | Timeline page |
| G8 | `node twitter api` | `/twitter-api-nodejs` | Node page or docs guide |

Also open GSC → Performance (last 7d vs prior 7d): clicks, CTR, avg position for the URLs above.

---

## B) ChatGPT / Claude / Perplexity (GEO)

Ask the **same job**, not the brand name. Score: **2** = XFlux named + link/domain, **1** = category match no brand, **0** = rival only / irrelevant.

| # | Prompt | Pass if score ≥1 and rising vs 2026-10-21 self-test |
|---|--------|------------------------------------------------------|
| A1 | “I need a free X/Twitter API key with no credit card for reading public profiles and search. What are options?” | Mentions Free 1,000 calls or xfluxapi.com / XFlux |
| A2 | “How do I get Slack alerts when a public Twitter account tweets, without enterprise Account Activity API?” | Mentions monitors/webhooks + XFlux or same path |
| A3 | “Best Account Activity API alternative for watching a few public @handles and POSTing to Discord?” | XFlux or clear “monitor + webhook” vendor we own |
| A4 | “MCP server to let Claude or Cursor search tweets and look up X users?” | `@xflux/xflux-mcp-server` or Glama/npm listing |
| A5 | “Node.js example to call a Twitter read API for user timeline by username?” | Points at XFlux Node/timeline docs or curl host |

Compare scores to `marketing/geo/prompt-self-test-2026-10-21.md`.

---

## C) Decision tree

| Google | AI | Action |
|--------|-----|--------|
| Pass | Pass | **Dual-track OK** — keep publishing; next: backlinks/directories |
| Fail | Pass | Titles/CTR, internal links, GSC coverage, indexation |
| Pass | Fail | Strengthen verdict/FAQ numbers; directories (Glama, awesome-mcp, cursor.directory); re-run prompts |
| Fail | Fail | Re-check schema + sitemap + dual format on that URL; competitor causal notes |

---

## D) Owner clicks before day 7 (if not done)

- [ ] GSC: sitemap submitted, no soft-404 on new landings  
- [ ] Glama admin re-sync README  
- [ ] cursor.directory / LobeHub / Cline listing live  
- [ ] Deploy dual-track code (commit + push when ready)

---

## E) Log template (copy per check day)

```
Date:
G1–G8: (pass/fail + SERP note)
A1–A5: (0/1/2 + quote)
GSC 7d clicks / CTR / position (top URLs):
Next fix:
```
