# Stripe 接入指南（测试模式优先）

XFlux 使用 **Stripe Checkout** 订阅付费（Starter / Growth / Pro / Scale），通过 **Webhook** 同步套餐，**Customer Portal** 管理账单。

**本指南优先讲解如何在 Stripe Test 模式下完整跑通流程**（无需公司注册、无需真实付款）。  
公司注册（Stripe Atlas）相关内容已移至 [STRIPE_ATLAS.md](./STRIPE_ATLAS.md)，后期再处理。

## 1. 创建 Stripe 产品与价格（Test 模式）

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. **左上角切换到 Test mode**（非常重要！）
3. 进入 **Product catalog → + Add product**
4. 创建四个 recurring 月付产品：

| 产品 | 建议价格 | 环境变量 |
|------|----------|----------|
| XFlux Starter | $19/mo | `STRIPE_PRICE_BASIC` |
| XFlux Growth | $49/mo | `STRIPE_PRICE_GROWTH` |
| XFlux Pro | $99/mo | `STRIPE_PRICE_PRO` |
| XFlux Scale | $249/mo | `STRIPE_PRICE_SCALE` |

5. 每个产品创建 **Recurring → Monthly** 价格，复制 **Price ID**（以 `price_` 开头）

或运行 `npm run stripe:bootstrap` 自动创建全部测试产品。

## 2. 获取 Test 密钥

在 **Test mode** 下：

Dashboard → **Developers → API keys**：

| 变量 | 说明 |
|------|------|
| `STRIPE_SECRET_KEY` | `sk_test_...` （测试密钥） |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` （可选） |

## 3. 配置 Webhook（测试模式推荐用 Stripe CLI）

### 本地开发（最简单）

1. 安装 Stripe CLI（首次）：https://stripe.com/docs/stripe-cli
2. 登录：
   ```bash
   stripe login
   ```
3. 启动转发（保持终端运行）：
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. 复制终端输出的 `whsec_...` 值，作为 `STRIPE_WEBHOOK_SECRET`。

### 生产（Vercel，上线前再做）

1. Stripe Dashboard（切换到 Live 模式后）→ **Webhooks → Add endpoint**
2. URL：`https://xfluxapi.com/api/webhooks/stripe`
3. 事件同上，复制 `whsec_...` 到环境变量。

## 4. 启用 Customer Portal

Dashboard → **Settings → Billing → Customer portal** → 启用，并允许：

- 取消订阅
- 更新支付方式
- （可选）切换套餐（若希望在 Portal 内升降级）

## 5. 本地环境变量（测试模式）

在项目根目录的 `.env` 文件中加入（或修改）以下内容：

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx   # 可选
STRIPE_PRICE_BASIC=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_GROWTH=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_SCALE=price_xxxxxxxxxxxxxxxx
```

保存后重启 `npm run dev`。

## 6. 数据库迁移

新增 User 表 Stripe 字段后，在项目根目录执行：

```bash
npx prisma db push
```

## 7. 测试流程（Test 模式完整验证）

1. 确保本地 `.env` 已填好上面 4 个 Stripe 测试变量，并重启开发服务器：
   ```bash
   npm run dev
   ```

2. 用测试账号登录 → 进入 **Dashboard → Billing**

3. 点击 **Start Basic**（或 Go Pro）

4. Stripe Checkout 页面会打开，使用以下测试卡：
   - 卡号：`4242 4242 4242 4242`
   - 有效期：任意未来月份/年（如 12/28）
   - CVC：任意三位（如 123）
   - 邮编：任意（如 12345）

5. 支付成功后会跳转回 `/dashboard/billing?checkout=success`

6. 等待几秒（Webhook 异步），刷新页面：
   - 当前计划应变为 **BASIC**（或 PRO）
   - 配额限制已更新

7. 点击 **Manage billing** 按钮，可进入 Stripe Customer Portal（测试模式）：
   - 可以模拟取消订阅、更新支付方式

8. 在 Stripe Dashboard（Test 模式）查看：
   - Customers → 有你的测试客户
   - Subscriptions → 有活跃订阅
   - Events → 有 webhook 事件

完成以上步骤即表示测试模式 Stripe 已成功接入。

## 行为说明

| 场景 | 行为 |
|------|------|
| 未配置 Stripe | Billing 页仍可用 mock 升级（仅本地测试） |
| 首次订阅 | Stripe Checkout |
| 已有订阅换套餐 | 直接 `subscriptions.update`（按比例计费） |
| 降级到 Free | 打开 Customer Portal 取消订阅 |
| 订阅取消 | Webhook 将用户重置为 `FREE` |

## 8. 上线前检查（以后再做）

- [ ] 切换到 Stripe **Live mode**，创建正式产品和价格
- [ ] 使用 live 密钥（`sk_live_...`）和 live Price ID
- [ ] 在 Vercel 配置生产环境变量 + Webhook
- [ ] `NEXTAUTH_URL` 设置为生产域名
- [ ] 在 Stripe Portal 设置中配置品牌和客服邮箱

---

**现在你只需要专注把 Test 模式跑通即可。** 公司注册和 Live 模式后期再处理。
