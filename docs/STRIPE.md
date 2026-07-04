# Stripe 接入指南

XFlux 使用 **Stripe Checkout** 订阅付费（Basic / Pro），通过 **Webhook** 同步套餐，**Customer Portal** 管理账单。

## 1. 创建 Stripe 产品与价格

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)（建议先用 **Test mode**）
2. **Product catalog → Add product**
3. 创建两个 recurring 月付产品：

| 产品 | 建议价格 | 环境变量 |
|------|----------|----------|
| XFlux Basic | $19/mo | `STRIPE_PRICE_BASIC` |
| XFlux Pro | $99/mo | `STRIPE_PRICE_PRO` |

4. 每个产品创建 **Recurring → Monthly** 价格，复制 **Price ID**（`price_...`）

## 2. 获取 API 密钥

Dashboard → **Developers → API keys**：

| 变量 | 说明 |
|------|------|
| `STRIPE_SECRET_KEY` | Secret key（`sk_test_...` 或 `sk_live_...`） |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key（可选，当前 Checkout 跳转模式可不配） |

## 3. 配置 Webhook

### 生产（Vercel）

1. Developers → **Webhooks → Add endpoint**
2. URL：`https://xflux-lake.vercel.app/api/webhooks/stripe`
3. 监听事件：
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. 复制 **Signing secret** → `STRIPE_WEBHOOK_SECRET`（`whsec_...`）

### 本地开发

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

终端会输出 `whsec_...`，写入本地 `.env` 的 `STRIPE_WEBHOOK_SECRET`。

## 4. 启用 Customer Portal

Dashboard → **Settings → Billing → Customer portal** → 启用，并允许：

- 取消订阅
- 更新支付方式
- （可选）切换套餐（若希望在 Portal 内升降级）

## 5. 环境变量

写入 `.env` 和 **Vercel Environment Variables**：

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PRO=price_...
```

## 6. 数据库迁移

新增 User 表 Stripe 字段后，在项目根目录执行：

```bash
npx prisma db push
```

## 7. 测试流程

1. `npm run dev`
2. 注册并登录 → **Dashboard → Billing**
3. 点击 **Start Basic** → 跳转 Stripe Checkout
4. 测试卡号：`4242 4242 4242 4242`，任意未来日期与 CVC
5. 支付成功后回到 Billing 页，Webhook 会把 `planTier` 更新为 `BASIC`
6. 点击 **Manage billing** 可进入 Portal 取消或改支付方式

## 行为说明

| 场景 | 行为 |
|------|------|
| 未配置 Stripe | Billing 页仍可用 mock 升级（仅本地测试） |
| 首次订阅 | Stripe Checkout |
| 已有订阅换套餐 | 直接 `subscriptions.update`（按比例计费） |
| 降级到 Free | 打开 Customer Portal 取消订阅 |
| 订阅取消 | Webhook 将用户重置为 `FREE` |

## 上线前检查

- [ ] 切换到 Stripe **Live mode**，使用 live 密钥与 live Price ID
- [ ] Vercel 配置生产 Webhook URL
- [ ] `NEXTAUTH_URL` 为生产域名
- [ ] 在 Portal 设置中配置品牌与客服邮箱
