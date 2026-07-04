# 密钥与敏感信息管理

## 原则

- **永远不要**把 API Key、数据库密码、Stripe 密钥写进代码或提交到 Git
- **永远不要**在聊天、截图、Issue、PR 描述里粘贴完整密钥
- 只使用 `.env` / `.env.local`（已在 `.gitignore` 中忽略）

## 本地配置

```bash
# 根目录 — Next.js + Supabase
cp .env.example .env
# 编辑 .env，填入你的值（仅保存在本机）

# api-server — Consumer API
cp api-server/.env.example api-server/.env
# 编辑 CONSUMER_API_KEY 等
```

## 生产环境

| 平台 | 配置方式 |
|------|----------|
| Vercel | Project → Settings → Environment Variables |
| Fly.io | `fly secrets set CONSUMER_API_KEY=...` |
| Supabase | Dashboard → 数据库密码单独保管 |

## 密钥已泄露时

若密钥曾在对话或公开场合出现，建议**立即轮换**：

1. Consumer API — 在服务商后台重新生成 Key
2. Supabase — Project Settings → Database → Reset password，并更新 `DATABASE_URL` / `DIRECT_URL`
3. `XFLUX_INTERNAL_KEY` — 本地与 Fly.io / Vercel 同步更新为新随机串

生成随机 secret：

```bash
openssl rand -base64 32
```

## Cursor / AI 对话

- 向 AI 描述问题时用 `CONSUMER_API_KEY=***` 或「已配置」代替真实值
- 若误粘贴密钥，轮换密钥比依赖「删除聊天记录」更可靠
