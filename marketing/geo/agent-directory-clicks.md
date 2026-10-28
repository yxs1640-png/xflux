# Agent directory — your clicks (ready)

Code is already on `main` (`b129c93` + follow-ups): `.mcp.json`, `glama.json`, `mcp-server/lhm.plugin.json`, `mcp-server/icon-400.png`.

## 1) cursor.directory — DONE

Live: https://cursor.directory/plugins/xflux  

## 2) Glama README re-sync — likely DONE

Public page already shows read-only / Smart Money / Not for posting (checked 2026-10-28).  
Admin: https://glama.ai/mcp/servers/yxs1640-png/xflux/admin if it ever goes stale again.

## 3) Cline marketplace — SUBMITTED

Issue: https://github.com/cline/mcp-marketplace/issues/3363  

Wait for maintainer review. Draft copy remains in `marketing/geo/cline-mcp-marketplace-issue.md`.  


## 4) LobeHub — SUBMITTED (awaiting publish)

Filed 2026-10-28: `yxs1640-png-xflux@1.2.1` (id 116617), `isClaimed: true`.  
CLI said Published; `plugin list` still shows `"status": "unpublished"` while **Repository enrichment** runs.

Check later:
```bash
export npm_config_registry=https://registry.npmjs.org/
npx -y @lobehub/market-cli plugin list --output json
```
When `status` becomes published/live, update `marketing/directories/README.md` and note the public URL.
