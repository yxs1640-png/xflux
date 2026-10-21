# GEO prompt self-test — 2026-10-21

Fixed prompts (ask each in a **new** chat, no XFlux in the prompt):

1. 有没有免费的 X API / free X API key，不要信用卡？
2. 怎么在 Claude 或 Cursor 里用 MCP 读 Twitter / X 公开数据？
3. 怎么把 Twitter 新推文提醒接到 Slack？
4. Twitter Account Activity API 有没有便宜的替代？
5. npm 上有没有 Twitter MCP server 给 agent 用？

## Results from this environment

| Channel | Result |
|---------|--------|
| **Cursor (this agent + web tools)** | Can cite XFlux correctly: `xfluxapi.com/free-x-api`, `/mcp`, `@xflux/xflux-mcp-server`, Slack Incoming Webhook path `/connect-slack-to-twitter`. |
| **ChatGPT (browser)** | Blocked here (`Unable to load site`). Run the 5 prompts in your own ChatGPT and note: mentions XFlux? link = xfluxapi.com? wrong “xflux” Figma? |
| **Claude.ai (browser)** | Region unavailable from this network. Same checklist in your Claude app if you have access. |
| **Perplexity (browser)** | Cloudflare challenge; not completed. |
| **Google web index** | Own pages rank for free X API / MCP queries (`/free-x-api`, `/mcp`, blog). That helps browsing agents; cold models without search may still omit XFlux. |

## Scorecard template (fill after you run ChatGPT/Claude)

| # | Mentions XFlux? | Correct URL? | Notes |
|---|-----------------|--------------|-------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
