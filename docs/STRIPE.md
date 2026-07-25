# Stripe 接入指南

XFlux 使用 **Stripe Checkout** 订阅付费（Starter / Growth / Pro / Scale），通过 **Webhook** 同步套餐，**Customer Portal** 管理账单与取消。

| 环境 | 密钥 | 配置位置 |
|------|------|----------|
| **Production（Live）** | `sk_live_...` + Live `price_...` + Live `whsec_...` | Vercel **Production** |
| **本地开发（Test）** | `sk_test_...` + Test `price_...` | 项目根目录 `.env` + Stripe CLI |

公司注册与 Atlas 文案见 [STRIPE_ATLAS.md](./STRIPE_ATLAS.md)。

---

## 1. Production 上线（Live）

### 1.1 Stripe Dashboard

1. 左上角 **关闭 Test mode**（Live）
2. **Settings → Account** — 确认 **Charges enabled**
3. **Product catalog** — 四个 monthly 产品：

| 产品 | 价格 | Vercel 变量 |
|------|------|-------------|
| XFlux Starter | $19/mo | `STRIPE_PRICE_BASIC` |
| XFlux Growth | $49/mo | `STRIPE_PRICE_GROWTH` |
| XFlux Pro | $99/mo | `STRIPE_PRICE_PRO` |
| XFlux Scale | $249/mo | `STRIPE_PRICE_SCALE` |

4. **Developers → API keys** — `sk_live_...`（`pk_live_...` 可选，Checkout 模式不强制）
5. **Webhooks** — 直接打开 https://dashboard.stripe.com/webhooks → **添加接收端**
   - URL: `https://xfluxapi.com/api/webhooks/stripe`
   - 事件:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - 复制 **签名密钥** `whsec_...`（Live 专用，与 Test 不同）
6. **Settings → Billing → Customer portal**（https://dashboard.stripe.com/settings/billing/portal）
   - **激活链接**
   - 允许：取消订阅、更新支付方式、切换方案（Starter / Growth / Pro / Scale 四档）
   - **客户可更改数量** — 关闭（按账号订阅，quantity 恒为 1）

或用脚本创建 Live 产品（`.env` 临时填入 `sk_live_...`，勿提交 git）：

```bash
npm run stripe:bootstrap-live
npm run stripe:check-live
```

### 1.2 Vercel Production 环境变量

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_SCALE=price_...
BILLING_CHECKOUT_ENABLED=true
NEXTAUTH_URL=https://xfluxapi.com
```

保存后 **Redeploy Production**。  
生产默认 `BILLING_CHECKOUT_ENABLED` 为 **off**；必须显式设为 `true` 才会开放付费 checkout。

### 1.3 上线验证

1. https://xfluxapi.com/pricing — 付费按钮可点，无 Coming soon
2. 登录 → **Dashboard → Billing** → **Starter $19** → 真实卡支付
3. Stripe Live → Payments / Subscriptions 有记录
4. Webhooks → 事件交付 **200**
5. `/dashboard/billing` 显示 **Starter**，配额已更新
6. **Manage billing** 可打开 Customer Portal

### 1.4 资金与合规（Live 运营注意）

- **Mercury 未批 / 未绑定**：款先进 **Stripe 余额**；Atlas 允许 EIN 等待期收美国信用卡
- **EIN 未下**：可收美国卡；部分支付方式可能受限，EIN 下来后补进 Stripe / Mercury / Atlas
- **密钥安全**：`sk_live_` / `whsec_` 仅放 Vercel Production，勿提交 git、勿发到聊天
- **本地 `.env`**：继续用 Test 密钥开发，与 Production Live 密钥分离

---

## 2. 本地开发（Test 模式）

### 2.1 创建 Test 产品与密钥

1. Stripe Dashboard → **开启 Test mode**
2. 创建同上四个产品，或 `npm run stripe:bootstrap`
3. **Developers → API keys** → `sk_test_...`

### 2.2 Webhook（Stripe CLI）

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

复制终端输出的 `whsec_...` → `.env` 的 `STRIPE_WEBHOOK_SECRET`。

### 2.3 本地 `.env`

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_SCALE=price_...
# BILLING_CHECKOUT_ENABLED 本地可省略（development 默认 on）
```

```bash
npm run stripe:check    # 验证配置
npm run dev
```

### 2.4 本地测试卡

- 卡号：`4242 4242 4242 4242`
- 有效期 / CVC / 邮编：任意未来有效值

登录 → Billing → 选套餐 → Checkout → 刷新确认套餐与配额。

---

## 3. 行为说明

| 场景 | 行为 |
|------|------|
| Production 未设 `BILLING_CHECKOUT_ENABLED=true` | 付费按钮 Coming soon；API checkout 返回 503 |
| 未配置 Stripe（本地） | 可用 mock 升级（仅 dev，无 `sk_` 时） |
| Production + Stripe 已配置 | mock 升级拒绝，必须走 Checkout |
| 首次订阅 | Stripe Checkout |
| 已有订阅升级 | `subscriptions.update`（按比例计费） |
| 已有订阅降级 | 周期末生效（pending plan） |
| 降级到 Free | Customer Portal 取消订阅 |
| 订阅取消 / 删除 | Webhook 重置为 `FREE`，enforce monitor 限制 |

---

## 4. 脚本命令

| 命令 | 用途 |
|------|------|
| `npm run stripe:check` | 验证 Test `.env` |
| `npm run stripe:bootstrap` | 创建 Test 产品与 price ID |
| `npm run stripe:check-live` | 验证 Live `.env` |
| `npm run stripe:bootstrap-live` | 创建 Live 产品与 price ID |

---

## 5. 故障排查

| 现象 | 常见原因 |
|------|----------|
| Checkout 503 / Coming soon | `BILLING_CHECKOUT_ENABLED` 未 true，或未 Redeploy |
| Checkout 503 price not configured | 某个 `STRIPE_PRICE_*` 缺失或不是 `price_` |
| 付完钱仍是 Free | Live Webhook 未配、`whsec_` 错误或事件非 200 |
| Portal 打不开 | Customer Portal 未激活链接 |
| 套餐与 Stripe 不一致 | Vercel `price_` 与 Dashboard 产品不匹配 |

Webhook 日志：Stripe Dashboard → Webhooks → 接收端 → **事件交付**。
