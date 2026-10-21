# Agent directory — your clicks (ready)

Code is already on `main` (`b129c93` + follow-ups): `.mcp.json`, `glama.json`, `mcp-server/lhm.plugin.json`, `mcp-server/icon-400.png`.

## 1) cursor.directory

1. Open https://cursor.directory/plugins/new  
2. Sign in with GitHub `yxs1640-png`  
3. Paste `https://github.com/yxs1640-png/xflux` → Scan repo  
4. Confirm it detects `.mcp.json` → Publish Plugin  

## 2) Glama README re-sync

Public page still shows the **old** MVP README (mock / Post tweet). GitHub root README is already read-only.

1. Open https://glama.ai/mcp/servers/yxs1640-png/xflux/admin  
2. **Login with GitHub** as `yxs1640-png` (browser session here was logged out)  
3. Use **Repository syncs → request a re-sync**  
4. Optionally edit Profile description to:  
   `Read-only X/Twitter API for agents: search, timelines, profiles, Smart Money. npm @xflux/xflux-mcp-server. Not for posting.`  
5. Refresh the public page until MVP/mock text is gone  

`glama.json` with `"maintainers": ["yxs1640-png"]` is in the repo root for claim/sync recognition.

## 3) Cline marketplace

Open https://github.com/cline/mcp-marketplace/issues/new?template=mcp-server-submission.yml  

Copy from `marketing/geo/cline-mcp-marketplace-issue.md`.

Logo URL: https://raw.githubusercontent.com/yxs1640-png/xflux/main/mcp-server/icon-400.png  

## 4) LobeHub

Manifest generated: `mcp-server/lhm.plugin.json` (9 tools, v1.2.1).

In your terminal (browser login required):

```bash
npx -y @lobehub/market-cli login
npx -y @lobehub/market-cli github connect
npx -y @lobehub/market-cli plugin publish https://github.com/yxs1640-png/xflux --dir /Users/yxs/Projects/xflux/mcp-server
npx -y @lobehub/market-cli plugin list --output json
```

Do **not** paste credentials from `~/.lobehub-market/`.
