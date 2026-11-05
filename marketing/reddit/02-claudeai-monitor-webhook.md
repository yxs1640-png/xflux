# Reddit + X — Monitor → webhook (educational)

**Goal:** Pain-first post: watch public X accounts and get a webhook (Slack/Discord/HTTPS). MCP is one closing sentence, not the hook.

**Before posting:** karma ≥ 50 on the Reddit account; reply to every comment in the first 2 hours.  
**Register UTMs (replies only):** `https://www.xfluxapi.com/register?src=reddit_claudeai`

Pick **one** channel the same day — do not cross-post Reddit + a hard sell on X within hours.

---

## r/ClaudeAI (primary)

**Submit:** https://www.reddit.com/r/ClaudeAI/submit  
**Style:** educational / “I built” — not an ad flair if the subreddit is picky.

### Title (pick one)

```
I built an MCP-friendly way for Claude to read X — but the real win was account monitors → webhook
```

```
How I stopped polling Twitter in a cron loop: monitor @handles and push signed webhooks
```

### Body (copy-paste)

```
Context: I needed Claude (and a small backend) to notice when specific public X accounts post — trading / research alerts — without running my own scrapers or paying official X enterprise pricing.

Polling search/timeline in a loop burns quota and breaks. What worked better:

1. Watch the @handles I care about on a schedule (account monitor)
2. Optional keyword filter so I only wake up on “CPI”, “$SOL”, etc.
3. On a match, POST a signed HTTP webhook to Slack, Discord, or my own URL

I wrapped the same read API as an MCP server so Claude/Cursor can search and look up profiles with tools — but for always-on alerts, the monitor + webhook path matters more than chat.

Free tier is enough to try: 1,000 API calls/mo, 1 monitor, Dashboard hit history, test webhook ping (no card). Live webhook delivery is on paid plans.

- Overview / MCP install: https://www.xfluxapi.com/mcp
- Monitors docs: https://www.xfluxapi.com/docs/monitors
- Slack recipe: https://www.xfluxapi.com/blog/connect-slack-to-twitter-alerts

Happy to answer setup questions (Claude Desktop config, Discord URL, signing). What would you monitor first?
```

### First comment (optional, after post is up)

```
If you only want Claude tool-calling (search / profile / timeline), this is the one-liner:

npx -y @xflux/xflux-mcp-server

Copy-paste prompts: https://www.xfluxapi.com/mcp
```

---

## X / Twitter (short)

Post when you have a simple GIF or screenshot (Dashboard monitor + Slack ping). Text alone is weaker.

### Tweet A (pain → product)

```
Stopped polling X in a cron loop.

Watch public @handles → optional keywords → signed webhook to Slack/Discord/your URL.

Free: 1 monitor + test ping (no card)
Live delivery from $19/mo

https://www.xfluxapi.com/docs/monitors

(Claude/Cursor: same API via MCP — https://www.xfluxapi.com/mcp)
```

### Tweet B (shorter)

```
X account posts → webhook to Slack.

That’s the loop I wanted. Built it as XFlux monitors (free to test).

Docs: https://www.xfluxapi.com/docs/monitors
MCP for Claude/Cursor: https://www.xfluxapi.com/mcp
```

---

## Do / Don’t

| Do | Don’t |
|----|--------|
| Lead with polling pain / alerts | Lead with “official MCP Registry” |
| Offer to help in comments | Dump register link in the title |
| One concrete example (@handle → Slack) | Feature laundry list |
| Mention MCP once at the end | Make the whole post about MCP |

---

## After you post

1. Save the Reddit/X URL here or in ops notes for Show HN timing later.  
2. If engagement is positive, week-3 follow-up: GIF of FirstSquawk/KOL → Slack (see `marketing/devto/03-…`).  
3. Do **not** re-post the same body to r/SideProject the same week (see `01-sideproject-showcase.md`).
