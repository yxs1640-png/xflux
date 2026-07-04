# XFlux 产品方案

> 最后更新：2026-06-14  
> 战略定稿：**只做 X · Monitor 与 API 并列 · 订阅制**

---

## 1. 一句话定位

**XFlux = 专注 X/Twitter 的数据 API + KOL 实时监控，面向开发者和交易者，比官方便宜、比纯 API 工具多一层「不用自己写轮询」的 Monitor 能力。**

不做通用网页爬虫，不做多平台社交数据。

---

## 2. 战略决策（已定）

| 决策 | 选择 | 含义 |
|------|------|------|
| 业务范围 | **只做 X** | 全部工程、文档、营销围绕 Twitter/X；不扩展 LinkedIn、通用 Scrape 等 |
| 产品双核 | **API ∥ Monitor** | 首页、定价、Dashboard 同等突出；Monitor 不是 API 的附属功能 |
| 商业模式 | **订阅制** | Free / Basic / Pro / Enterprise 月费 + 配额；暂不做 PAYG 充值 |

---

## 3. 目标用户

| 画像 | 典型场景 | 主要用 |
|------|----------|--------|
| 独立开发者 / AI 项目 | 拉推文做 RAG、情绪分析、Bot | API |
| 交易者 / 研究员 | 跟踪 KOL、快讯账号、项目方 | Monitor |
| 小团队 SaaS | 嵌入用户资料、搜索到自己的产品 | API |
| 增长 / 运营 | 竞品账号、行业 KOL 动态 | Monitor |

---

## 4. 产品架构：双核 + 共享底座

```
                    ┌─────────────────────────────────┐
                    │         XFlux Platform          │
                    └─────────────────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
    ┌──────────────────┐                         ┌──────────────────┐
    │   XFlux API      │                         │  XFlux Monitor   │
    │   按需拉取数据    │                         │  后台轮询 + 推送  │
    └────────┬─────────┘                         └────────┬─────────┘
             │                                            │
             └────────────────────┬───────────────────────┘
                                  ▼
                    ┌─────────────────────────┐
                    │  共享：账号 · 套餐 · 密钥  │
                    │  Consumer API · Fly Worker │
                    └─────────────────────────┘
```

### 4.1 XFlux API（核一）

**价值：** 替代官方 X API，REST 即用，Bearer Key 鉴权。

**MVP 端点（已有）：**

- `GET /api/v1/users/:username` — 用户资料
- `GET /api/v1/users/:username/tweets` — 时间线
- `GET /api/v1/tweets/:id` — 单条推文
- `GET /api/v1/search?q=` — 搜索

**计费：** 计入用户 **API 配额**（`quotaUsed` / `quotaLimit`）。

**后续扩展（Phase 2+）：** 关系链、List、Trends、Community；写操作（发推/DM）单独评估合规后再做。

### 4.2 XFlux Monitor（核二）

**价值：** 用户指定 `@username`，后台自动发现新推文，Dashboard 展示 + 后续 Webhook/通知。

**与 API 的区别：**

| | API | Monitor |
|--|-----|---------|
| 触发 | 用户主动请求 | 系统按 interval 轮询 |
| 计费 | 扣 API 配额 | **不扣 API 配额**；受套餐 **任务数 + 最低检查间隔** 限制 |
| 交付 | HTTP 响应 | Dashboard 命中列表 → Webhook（Phase 2） |

**Monitor 能力路线图：**

| 阶段 | 能力 |
|------|------|
| **Phase 1** | 账号监控、轮询 worker、`MonitorHit` 表、Monitors 页展示最新命中、`lastCheckAt` / 错误状态 |
| **Phase 2** | Webhook 投递、HMAC 签名、Test webhook、delivery log |
| **Phase 3** | Filter Rule（Advanced Search 关键词监控） |
| **Phase 4** | Email / Telegram 通知 |

**数据模型（Phase 1 增量）：**

- `MonitorTask` 扩展：`lastTweetId`、`lastError`、`status`
- 新增 `MonitorHit`：`taskId`、`tweetId`、`text`、`authorUsername`、`detectedAt`

**Worker：** Fly.io 常驻进程轮询 Consumer API（`UserTweets` / `Search from:user`），不写 Vercel Cron。

---

## 5. 订阅与配额

与 `src/lib/constants.ts` 中 `PLANS` 对齐，Monitor 与 API **分开计量**。

| 套餐 | 月费 | API 调用/月 | Monitor 任务数 | 最快检查间隔 |
|------|------|-------------|----------------|--------------|
| Free | $0 | 1,000 | 1 | 5 min |
| Basic | $19 | 50,000 | 5 | 1 min |
| Pro | $99 | 500,000 | 20 | 30 sec |
| Enterprise | $499+ | 定制 | 定制 | 10 sec |

**原则：**

- API 超额 → 429，提示升级
- Monitor 超额（任务数或 interval 不达标）→ 创建/更新时拒绝
- Monitor 轮询 **不计入** API 配额（成本在 XFlux 侧用套餐价覆盖）
- 账单：MVP 为 Dashboard 内 mock 升级；Stripe 接入后同一套套餐 ID

**对外话术：** 同时展示「API 调用量」和「Monitor 槽位」，避免用户误以为监控会吃掉 API 额度。

---

## 6. 信息架构 & 页面

### 营销站

| 页面 | 重点 |
|------|------|
| 首页 | 双栏价值主张：**API** + **Monitor**；对比官方便宜 |
| Pricing | 每档同时列 API 配额 + Monitor 数量 + 检查频率 |
| Docs | API Reference + Monitor 使用指南（创建任务、理解命中） |

### Dashboard

| 模块 | 说明 |
|------|------|
| Overview | API 用量 + **活跃 Monitor 数 + 最近命中** |
| API Keys | 密钥管理 |
| Usage | API 调用图表与日志 |
| **Monitors** | 核心页：创建任务、状态、最新 3 条命中、「立即检查」 |
| Billing | 套餐切换 |
| Settings | 账号 |

Monitors 与 API Keys 在导航上 **同级**，不要藏在 Settings 里。

---

## 7. 竞品差异（简表）

| 对比 | XFlux 做法 |
|------|------------|
| ScrapeBadger | 不做通用爬虫；Monitor 更简单、X 垂直 |
| GetXAPI | 有 Dashboard + Monitor，非纯 CLI 按量工具 |
| TwexAPI | 不做 engagement 灰产；Monitor 与 API 同产品、同账号 |
| SocialData | 功能更深：监控 + 用量 + 套餐 |

---

## 8. 技术边界（与架构一致）

```
用户 → Vercel (Next.js: 营销 / Dashboard / /api/v1)
         ↓ 可选 XFLUX_API_SERVER_URL
       Fly.io api-server + monitor-worker
         ↓ X-Api-Key
       Consumer API (89.167.53.180/consumer/*)
         ↓
       Supabase PostgreSQL
```

- **密钥：** `CONSUMER_API_KEY` 仅 Fly；Vercel 用 internal key
- **本地开发：** Next.js 可直接读 `CONSUMER_API_KEY` 调 Consumer API

---

## 9. 里程碑

| 优先级 | 事项 | 状态 |
|--------|------|------|
| P0 | 读 API 端到端稳定（users / search） | 进行中 |
| P0 | Fly 部署 + Vercel 生产环境 | 待做 |
| **P0** | **Monitor Phase 1**（worker + hits + UI） | 待做 |
| P1 | 首页/定价 copy 突出双核 | 待做 |
| P1 | Stripe 订阅 | 待做 |
| P2 | Monitor Webhook | 待做 |
| P2 | 定价对比表（vs 官方 API） | 待做 |
| P3 | 免费 X 小工具（SEO） | 待做 |
| P3 | 写 API / DM | 评估后 |

---

## 10. 明确不做（至少 12 个月内）

- 通用网页爬虫 / 非 X 平台
- PAYG 按量充值（可日后加，不替代订阅）
- 买赞、买粉等 engagement 市场
- 与 XFlux 无关的 MCP/CLI 大生态（CLI 可很晚再做）

---

## 11. 成功指标（MVP 后 3 个月）

| 指标 | 目标方向 |
|------|----------|
| 注册 → 创建 API Key | > 60% |
| 注册 → 创建 ≥1 Monitor | > 30%（Monitor 是差异化） |
| 付费转化（Free → Basic+） | > 5% |
| API 错误率（5xx） | < 1% |
| Monitor 轮询成功率 | > 95% |

---

## 附录：Monitor Phase 1 实现清单

1. Prisma：`MonitorHit` + `MonitorTask` 字段扩展
2. Fly worker：按 `checkInterval` 调度 active tasks
3. 首次运行：只记录 `lastTweetId`，不刷历史
4. 命中：新 `tweetId` → 写 `MonitorHit`，更新 task
5. API：`GET/POST/PATCH/DELETE /api/monitors`（已有 CRUD，补 status/hits）
6. UI：Monitors 页展示 hits、`lastCheckAt`、错误 badge
7. 套餐校验：`PLAN_MONITOR_LIMITS` + 最低 interval 校验
