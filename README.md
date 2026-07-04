# XFlux

Affordable & stable X/Twitter API proxy service — MVP built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## Features (MVP)

- **Landing page** — Marketing site with pricing and feature overview
- **User auth** — Email/password registration and login (NextAuth)
- **API Keys** — Generate and manage `xflux_*` API keys
- **REST API proxy** — User profiles, tweets, search (mock + optional live Twitter API v2)
- **Dashboard** — Usage stats, API logs, quota tracking
- **Monitors** — KOL tweet monitoring task management
- **Docs** — API documentation page

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- NextAuth.js
- Recharts

## Architecture

- **Vercel** — Next.js app, auth, dashboard, public `/api/v1/*`
- **Fly.io** — `api-server/` (Consumer API proxy) + `Dockerfile.worker` (Monitor 轮询)
- **Supabase** — PostgreSQL

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for **Vercel + Fly.io** deployment.

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (local, [Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres)

## Supabase 数据库配置

Supabase **新版界面**里，连接串不在 `Project Settings → Database`，而在：

**项目首页顶部 → 点击 `Connect` 按钮**

### 只有 DIRECT_URL 时（本地开发够用）

Project Overview 里若已有 `DIRECT_URL`（端口 **5432**），在 `.env` 里 **两个变量都填同一个值** 即可：

```env
DATABASE_URL="你的DIRECT_URL完整连接串"
DIRECT_URL="你的DIRECT_URL完整连接串"
```

示例格式：
```env
DATABASE_URL="postgresql://postgres:你的密码@db.abcdefgh.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:你的密码@db.abcdefgh.supabase.co:5432/postgres"
```

然后执行：
```bash
npx prisma db push
npm run dev
```

### 需要 DATABASE_URL（6543 池化连接）时

1. 项目首页 → **Connect**
2. 选择 **ORMs** → **Prisma**，或选 **Transaction pooler**（端口 **6543**）
3. 复制 Transaction 连接串 → 填入 `DATABASE_URL`，末尾加 `?pgbouncer=true`
4. `DIRECT_URL` 仍用 5432 直连（Connect → **Direct connection** 或 Overview 里的值）

| 变量 | 从哪里找 | 端口 |
|------|----------|------|
| `DIRECT_URL` | Connect → Direct connection，或 Project Overview | 5432 |
| `DATABASE_URL` | Connect → Transaction pooler / ORMs → Prisma | 6543 |

> 本地开发用 5432 直连即可；部署 Vercel 时再把 `DATABASE_URL` 换成 6543 池化连接。

部署到 Vercel 时，在 Environment Variables 里添加 `DATABASE_URL`、`DIRECT_URL`、`NEXTAUTH_URL`、`NEXTAUTH_SECRET`。

### Setup

```bash
cd ~/Projects/xflux
npm install

cp .env.example .env
# Default uses SQLite — no Postgres install needed

npx prisma db push
npm run dev
```

**Local database options:**

| Option | Command | When to use |
|--------|---------|-------------|
| **SQLite** (default) | `DATABASE_URL="file:./dev.db"` | Quick local dev, no install |
| **Docker Postgres** | `npm run db:up` then use postgres URL in `.env` | Match production locally |
| **Neon (cloud)** | Paste URL from [neon.tech](https://neon.tech) | No Docker, free tier |

For Docker Postgres, change `prisma/schema.prisma` provider back to `postgresql` and set:
`DATABASE_URL="postgresql://xflux:xflux@localhost:5432/xflux?schema=public"`

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | `file:./dev.db` (local SQLite) or PostgreSQL URL (production) |
| `NEXTAUTH_URL` | Yes | App URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Random 32+ char secret |
| `TWITTER_BEARER_TOKEN` | No | Twitter API v2 bearer token for live data |

Generate a secret:

```bash
openssl rand -base64 32
```

## API Usage

After registering, use your API key:

```bash
curl -H "Authorization: Bearer xflux_YOUR_KEY" \
  http://localhost:3000/api/v1/users/elonmusk
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/users/:username` | User profile |
| GET | `/api/v1/users/:username/tweets` | User timeline |
| GET | `/api/v1/tweets/:id` | Tweet by ID |
| GET | `/api/v1/search?q=keyword` | Search tweets |
| POST | `/api/v1/tweets` | Post tweet (requires OAuth setup) |

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

### Option B: GitHub Integration

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial XFlux MVP"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. Import project at [vercel.com/new](https://vercel.com/new)

3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` — from Vercel Postgres or Neon
   - `NEXTAUTH_URL` — your production URL (e.g. `https://xflux.vercel.app`)
   - `NEXTAUTH_SECRET` — random secret
   - `TWITTER_BEARER_TOKEN` — optional

4. After first deploy, run database migration:
   ```bash
   npx prisma db push
   ```
   Or add a build step with Vercel Postgres integration.

### Vercel Postgres Setup

1. In Vercel project → Storage → Create Database → Postgres
2. Change `prisma/schema.prisma` datasource provider from `sqlite` to `postgresql`
3. Connect to project — `DATABASE_URL` is auto-injected
4. Redeploy (build runs `prisma db push` or migrate)

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/v1/           # Public REST API (proxy)
│   ├── dashboard/        # Authenticated dashboard
│   ├── docs/             # API documentation
│   └── pricing/          # Pricing page
├── components/           # React components
└── lib/                  # Auth, DB, quota, Twitter proxy
prisma/
└── schema.prisma         # Database schema
```

## Roadmap

- [x] Stripe billing integration (see docs/STRIPE.md)
- [ ] Real-time WebSocket monitoring
- [ ] Telegram/Discord notifications
- [ ] Account pool management
- [ ] CLI tool
- [ ] Batch DM / posting queue (Bull/Redis)

## Legal Notice

This project interacts with X/Twitter data. Ensure compliance with [X Developer Agreement](https://developer.x.com/en/developer-terms/agreement) and applicable laws. Use official APIs when possible.

## License

MIT
