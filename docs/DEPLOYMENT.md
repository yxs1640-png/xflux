# XFlux 部署指南：Vercel + Fly.io + Supabase

## 架构

```
用户浏览器
    ↓
Vercel (Next.js)              ← 网站、Dashboard、/api/v1/*
    ↓  XFLUX_INTERNAL_KEY
Fly.io xflux-api (api-server/) ← Consumer API 代理，密钥仅存于此
    ↓  X-Api-Key
http://89.167.53.180/consumer/*

Fly.io xflux-monitor-worker    ← Monitor 后台轮询 + Webhook
    ↓  DATABASE_URL
Supabase PostgreSQL
```

| 组件 | 平台 | 目录 / 配置 |
|------|------|-------------|
| 主站 | Vercel | 仓库根目录 |
| API 代理 | Fly.io | `api-server/` + `api-server/fly.toml` |
| Monitor Worker | Fly.io | `Dockerfile.worker` + `worker/fly.toml` |
| 数据库 | Supabase | 已有 |

---

## 第 0 步：准备

```bash
# 安装 Fly CLI
curl -L https://fly.io/install.sh | sh
export PATH="$HOME/.fly/bin:$PATH"
fly auth login

# Internal Key（Fly api-server 与 Vercel 共用）
openssl rand -hex 32

# 测试 Consumer API
curl -i 'http://89.167.53.180/consumer/Search?q=test' \
  -H 'X-Api-Key: 你的密钥'
```

环境变量模板：`.env.fly.example`

---

## 第 1 步：部署 Fly API Server

```bash
cd ~/Projects/xflux/api-server

fly launch --no-deploy
# App: xflux-api  |  Region: sin  |  不要创建 Postgres/Redis

fly secrets set \
  CONSUMER_API_KEY="你的Consumer密钥" \
  XFLUX_INTERNAL_KEY="第0步生成的hex"

fly deploy
```

验证：

```bash
curl https://xflux-api.fly.dev/health

curl -H "x-flux-internal-key: 你的INTERNAL_KEY" \
  "https://xflux-api.fly.dev/v1/search?q=test"
```

或使用脚本（在仓库根目录）：

```bash
chmod +x scripts/check-fly-deploy.sh
./scripts/check-fly-deploy.sh https://xflux-api.fly.dev 你的INTERNAL_KEY
```

---

## 第 2 步：部署 Vercel

1. [vercel.com/new](https://vercel.com/new) → Import GitHub 仓库  
2. **Environment Variables**：

```env
DATABASE_URL=Supabase 6543 pooler ?pgbouncer=true
DIRECT_URL=Supabase 5432 直连
NEXTAUTH_URL=https://你的项目.vercel.app
NEXTAUTH_SECRET=openssl rand -base64 32

XFLUX_API_SERVER_URL=https://xflux-api.fly.dev
XFLUX_INTERNAL_KEY=与 Fly api-server 相同
```

**不要设置** `CONSUMER_API_KEY`、`MONITOR_WORKER_ENABLED`。

3. Deploy 后测试：

```bash
curl -H "Authorization: Bearer xflux_你的KEY" \
  "https://你的项目.vercel.app/api/v1/search?q=test"
```

---

## 第 3 步：部署 Fly Monitor Worker

```bash
cd ~/Projects/xflux

fly launch --config worker/fly.toml --dockerfile Dockerfile.worker --no-deploy

fly secrets set \
  DATABASE_URL="与 Vercel 相同的 Supabase 6543" \
  DIRECT_URL="与 Vercel 相同的 Supabase 5432" \
  CONSUMER_API_KEY="你的Consumer密钥" \
  -a xflux-monitor-worker

fly deploy . --config worker/fly.toml -a xflux-monitor-worker

fly logs -a xflux-monitor-worker
```

Logs 应出现：

```text
[xflux-worker] health server on :8080
[xflux-worker] starting tick=30000ms batch=5
[xflux-worker] polled=...
```

---

## 环境变量对照

| 变量 | Fly api-server | Fly worker | Vercel |
|------|:--------------:|:----------:|:------:|
| `CONSUMER_API_KEY` | ✅ | ✅ | ❌ |
| `XFLUX_INTERNAL_KEY` | ✅ | ❌ | ✅ |
| `XFLUX_API_SERVER_URL` | ❌ | ❌ | ✅ |
| `DATABASE_URL` / `DIRECT_URL` | ❌ | ✅ | ✅ |
| `NEXTAUTH_*` | ❌ | ❌ | ✅ |
| `STRIPE_*` / `STRIPE_PRICE_*` | ❌ | ❌ | ✅ |

Stripe 配置详见 [docs/STRIPE.md](./STRIPE.md)。

---

## 本地开发

```env
CONSUMER_API_KEY=...              # 直连 Consumer，无需 Fly
# 不配 XFLUX_API_SERVER_URL
# MONITOR_WORKER_ENABLED=true     # 可选：dev 内嵌轮询
```

---

## 常见问题

**Fly 401** — `XFLUX_INTERNAL_KEY` 与请求头不一致  

**Vercel 502** — Fly api 未运行；URL 无尾斜杠；查 `fly logs`  

**Monitor 不自动更新** — Worker 未部署；`DATABASE_URL` 与 Vercel 不一致；查 `fly logs -a xflux-monitor-worker`  

**Consumer 参数** — 编辑 `api-server/src/lib/consumer-client.ts`  

**账号需验证** — Fly 需完成支付方式验证才能 `fly deploy`

---

## Monitor Webhook

Basic+ 套餐在 Dashboard → Monitors 配置 Webhook。详见 `/docs/webhooks`。

---

## 本地 dev 与生产分工

| 能力 | 本地 | 生产 |
|------|------|------|
| API | `CONSUMER_API_KEY` 或 Fly | Vercel → Fly api-server |
| Monitor 轮询 | `MONITOR_WORKER_ENABLED=true` | Fly worker |
| Monitor 手动 | Dashboard Check now | 同左 |
