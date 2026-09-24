import type { BlogPost } from "./posts";

export const BLOG_POSTS_ZH: BlogPost[] = [
  {
    slug: "x-api-cost-2026",
    title: "2026 年 X/Twitter API 要花多少钱？",
    description:
      "对比官方 X API 按量计费与 Pro 推流（约 $5k/月）、第三方代理，以及 XFlux 从免费/$19 起的固定套餐——含账号监控与 webhook。",
    datePublished: "2026-09-20",
    keywords: [
      "x api pricing 2026",
      "twitter api cost",
      "x api alternative pricing",
      "cheap twitter api",
      "xflux pricing",
    ],
    sections: [
      {
        heading: "官方 X API：按量计费与高阶套餐",
        paragraphs: [
          "当你需要写权限、代表用户的 OAuth，或企业级推流时，X 开发者 API 仍是权威来源。定价与套餐会变；到 2026 年，对许多团队来说现实情况仍是：轻度读取用 Basic 或按量计费，实时产品则价格陡升。",
          "过滤式 / Pro 级推流常被引用在约 $5,000/月。若你需要覆盖全网的 firehose 级规则，这是正确产品；若你只关心一小批 @账号何时发帖，则是错配。",
          "请始终在 docs.x.com 核对最新数字——任何第三方对比（包括本文）仅供方向参考。",
        ],
      },
      {
        heading: "第三方读取 API：量级 vs 工作流",
        paragraphs: [
          "多家第三方 API 以更便宜的公开读取、按量计费出售。当你的负载是纯查询量——上百万次资料或搜索调用、别无他求时，它们占优。",
          "它们通常止步于产品面：你仍要自建轮询、签名方案、控制台和 agent 工具。若「盯这些账号并推送签名 JSON」已是半个需求，仅靠原始按量端点并不完整。",
        ],
      },
      {
        heading: "XFlux：固定套餐、监控与 webhook",
        paragraphs: [
          "XFlux 是以读取为主的 X/Twitter API，同一账号内自带定时账号监控。免费档：每月 1,000 次 API 调用、1 个监控、Dashboard 命中历史——无需信用卡。Starter 从 $19/月起，含 15 万次调用、3 个监控、HMAC 签名 HTTP webhook，以及最短 1 秒轮询间隔。",
          "更高档（Growth $49、Pro $99、Scale $249）提升配额与监控数量。监控轮询不消耗 REST API 配额。新命中的实时 webhook 投递需 Starter+；免费档仍可配置 URL 并发送测试 ping。",
          "你还获得面向 Claude/Cursor 的 MCP（@xflux/xflux-mcp-server）、Smart Money 预测者，以及实时信号摘要——按量代理很少打包这些工具。",
        ],
        code: `# Quick cost intuition (directional)
# Official Pro filtered stream:  ~$5,000/mo for network-wide rules
# XFlux Starter monitors:        $19/mo for accounts you pick + webhooks
# XFlux Free:                    $0 — 1k calls + 1 monitor (Dashboard history)`,
      },
      {
        heading: "如何选择",
        paragraphs: [
          "必须发帖、私信，或依赖 X 自身 SLA 的企业推流时，选官方 X。只需大批量公开查询且已自有告警栈时，选高量按量代理。",
          "想要固定月费可预期、账号级监控 + HMAC 签名 webhook、Make.com 路由，以及 MCP 服务器——又不想为用不到的 $5k 推流买单时，选 XFlux。",
        ],
      },
      {
        heading: "实例：三个账号做交易告警",
        paragraphs: [
          "假设你盯三个宏观/资金流账号，只在他们发帖时要 webhook 告警。对着官方 Basic 自己做，意味着自建时间线轮询（配额 + 基础设施）。官方推流则意味着为只需三个作者的场景支付 Pro 价格。",
          "在 XFlux Starter 上，你创建三个监控、可选关键词过滤、粘贴 Make.com 或自有服务器 URL，并校验 HMAC。同一账号还覆盖机器人或 agent 的按需搜索与资料查询。",
        ],
      },
    ],
    faqs: [
      {
        question: "XFlux 比官方 X API 更便宜吗？",
        answer:
          "对「读取 + 账号告警」来说，通常是：免费或 $19/月 Starter，对比 Basic/按量摩擦或约 $5k 推流。写权限/OAuth/企业 firehose 请用官方 X——XFlux 不替代这些。",
      },
      {
        question: "XFlux 按推文收费吗？",
        answer:
          "不。套餐是固定月度 REST 调用配额，外加固定数量的账号监控。监控轮询不消耗 API 调用配额。",
      },
      {
        question: "做交易告警必须用 $5,000/月的推流吗？",
        answer:
          "仅当你需要全网过滤式推流时。盯特定账号正是 XFlux 监控的用途——Starter+ 起 $19/月，含签名 webhook。",
      },
      {
        question: "在哪里看 XFlux 当前价格？",
        answer:
          "见 /pricing 与 /docs/compare/pricing。官方 X 价格请在 docs.x.com 确认。",
      },
    ],
  },
  {
    slug: "twitter-api-alternative",
    title: "2026 年最佳 Twitter API 替代方案（读取 + 账号告警）",
    description:
      "对比面向公开读取与账号告警的 Twitter/X API 替代方案。XFlux 何时更优：监控、签名 webhook、MCP，以及同一账号内的固定套餐。",
    datePublished: "2026-09-21",
    keywords: [
      "twitter api alternative",
      "x api alternative",
      "twitter api proxy",
      "best twitter api 2026",
      "xflux vs twitter api",
    ],
    sections: [
      {
        heading: "「替代」通常指什么",
        paragraphs: [
          "多数搜索 Twitter API 替代方案的团队需要三者之一：更便宜的公开读取、比官方门户更快的开通，或在账号发帖时推送告警——无需自建轮询器。",
          "写 API、广告与企业合规仍属于官方 X。诚实的替代方案在读取访问与开发者工作流上竞争。",
        ],
      },
      {
        heading: "替代方案的类别",
        paragraphs: [
          "官方 X API——完整平台能力、最高信任度，对许多独立/交易工作流成本与摩擦也最高。",
          "以量为主的读取 API（如 Sorsa 式廉价查询）——当你需要按请求计费的原始量级且已自有告警时很强。",
          "监控优先工具——盯 handle 的 Discord 机器人或 webhook 服务；在 REST 搜索/资料 API 或 AI agent 工具上往往偏弱。",
          "XFlux——固定套餐读取 API + 定时监控 + 签名 webhook + MCP + Smart Money / Signals，合于一款产品。",
        ],
      },
      {
        heading: "何时 XFlux 更合适",
        paragraphs: [
          "当任务是「查询 + 盯盘 + 通知 + 可选地问 Claude/Cursor」时，XFlux 胜出。一把 API key 覆盖资料、时间线、搜索、推文查询、Dashboard 监控、HMAC webhook（Starter+），以及 @xflux/xflux-mcp-server。",
          "若你需要发推、管理私信，或接入整条过滤 firehose，XFlux 不胜出。那些仍留在官方 X。",
        ],
      },
      {
        heading: "功能清单（实用向）",
        paragraphs: [
          "读取：资料、用户时间线、按 ID 查推文、搜索——XFlux REST 均支持。",
          "常开盯盘：带可选关键词过滤的账号监控；付费计划轮询间隔可低至 1 秒。",
          "投递：Starter+ 上的签名 HTTP webhook；Make.com Custom Webhook 有文档；Discord 经 Make 或自建机器人。",
          "Agents：面向 Claude Desktop 与 Cursor 的官方 MCP 包（与其他「xflux」Figma MCP 包无关）。",
        ],
      },
      {
        heading: "如何在一个下午评估",
        paragraphs: [
          "注册、跑一次资料查询、给一个活跃账号建一个监控、发一次测试 webhook，然后可选接入 MCP。若这条路径比拼代理 + cron + Discord 机器人更短，这个替代方案就在尽本分。",
        ],
        code: `curl -X GET "https://www.xfluxapi.com/api/v1/users/elonmusk" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`,
      },
    ],
    faqs: [
      {
        question: "XFlux 是官方 Twitter/X 产品吗？",
        answer:
          "不是。XFlux 是独立的读取 API 与监控产品。官方写能力与企业产品仍在 X 开发者平台。",
      },
      {
        question: "我能完全替代官方 API 吗？",
        answer:
          "仅针对公开读取 + 账号告警负载。若需要发帖、用户 OAuth 或全网推流，请保留官方 X。",
      },
      {
        question: "XFlux 与纯按量（PAYG）API 比如何？",
        answer:
          "PAYG 常在纯查询量上胜出。当你还需要固定套餐、监控、签名 webhook、Make 路由、MCP 与信号工具时，XFlux 胜出。",
      },
      {
        question: "我该从哪里开始？",
        answer:
          "在 /register 用免费档，然后看 /docs/quickstart。对比页：/compare/x-api 与 /docs/compare/pricing。",
      },
    ],
  },
  {
    slug: "twitter-account-monitor-webhook",
    title: "如何在 X 账号发帖时收到签名 Webhook",
    description:
      "配置 XFlux 账号监控与 HMAC-SHA256 签名 webhook，在新推文时推送。含载荷结构、Node 验签，以及 Make.com 链接。",
    datePublished: "2026-09-18",
    keywords: [
      "twitter account monitor webhook",
      "twitter webhook hmac",
      "x account alert webhook",
      "monitor.hit webhook",
      "make.com twitter webhook",
    ],
    sections: [
      {
        heading: "为何监控优于自己轮询",
        paragraphs: [
          "自己做意味着 cron + 拉时间线 + 去重 + 重试 + 密钥管理。XFlux 账号监控按计划轮询（Starter+ 可低至 1 秒）、在 Dashboard 存命中，并——在付费计划上——在有新匹配时向你的 HTTPS URL POST 签名 JSON。",
          "免费档含 1 个监控与命中历史。新命中的实时投递需 Starter（$19/月）或更高。免费档仍可保存 webhook URL 并发送测试 ping。",
        ],
      },
      {
        heading: "设置（Dashboard）",
        paragraphs: [
          "1. 创建账号并打开 Dashboard → Monitors。2. 添加目标 @用户名与可选的逗号分隔关键词。3. 展开 Webhook，粘贴 HTTPS 端点并保存。4. 复制仅显示一次的签名密钥。5. 点击 Test webhook。",
          "产品概览：/twitter-webhook。Make.com 分步指南：/docs/integrations/make。完整字段参考：/docs/webhooks。",
        ],
      },
      {
        heading: "载荷与请求头",
        paragraphs: [
          "命中时，XFlux 发送 Content-Type application/json，以及 X-XFlux-Event、X-XFlux-Timestamp 与 X-XFlux-Signature（sha256=…）。事件名为 monitor.hit。测试投递使用 monitor.test。",
        ],
        code: `POST https://your-server.com/webhooks/xflux
Content-Type: application/json
X-XFlux-Event: monitor.hit
X-XFlux-Timestamp: 1710000000
X-XFlux-Signature: sha256=<hex>

{
  "event": "monitor.hit",
  "monitor": {
    "id": "clx...",
    "targetUsername": "elonmusk",
    "keywords": null
  },
  "tweet": {
    "id": "1234567890",
    "text": "Hello world",
    "authorUsername": "elonmusk",
    "createdAt": "2026-06-14T12:00:00.000Z"
  },
  "detectedAt": "2026-06-14T12:00:05.000Z"
}`,
      },
      {
        heading: "校验 HMAC-SHA256",
        paragraphs: [
          "用你的 webhook 密钥，对 `{timestamp}.{raw_body}` 计算 HMAC-SHA256。用时间安全比较对照 X-XFlux-Signature。拒绝约五分钟以上的时间戳。务必使用原始 body 字节——先解析再重新 stringify 的 JSON 会破坏验签。",
        ],
        code: `import crypto from "crypto";

function verify(secret, timestamp, rawBody, signatureHeader) {
  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(\`\${timestamp}.\${rawBody}\`)
      .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader)
  );
}`,
      },
      {
        heading: "用 Make.com（或自建机器人）路由",
        paragraphs: [
          "把 Make.com Custom Webhook URL 粘贴进监控。Make 可扇出到 Slack、Telegram、Discord、Sheets 或 HTTP 模块。Discord 专项见 /twitter-discord-alerts。",
          "失败投递会记在 Dashboard；当前产品不自动重试——修好端点后使用 Test webhook。",
        ],
      },
    ],
    faqs: [
      {
        question: "哪个套餐包含实时 webhook？",
        answer:
          "Starter（$19/月）及以上。免费档可配置 URL 并发送测试 ping；实时 monitor.hit 投递需要付费计划。",
      },
      {
        question: "签名用什么算法？",
        answer:
          "对 `{timestamp}.{raw_body}` 做 HMAC-SHA256，以 sha256=<hex> 形式返回在 X-XFlux-Signature。",
      },
      {
        question: "能按关键词过滤吗？",
        answer:
          "可以——每个监控可设可选的逗号分隔关键词，只有匹配的推文才会产生命中。",
      },
      {
        question: "轮询会占用我的 API 配额吗？",
        answer:
          "不会。监控轮询与 REST /api/v1 调用配额分开。",
      },
    ],
  },
  {
    slug: "twitter-trading-alerts",
    title: "不用 $5k 推流，也能从 X 做交易与宏观告警",
    description:
      "用账号监控、关键词过滤与签名 webhook 搭建 Twitter/X 交易告警——从 $19/月起，无需官方 Pro 推流。",
    datePublished: "2026-09-19",
    keywords: [
      "twitter trading alerts",
      "macro twitter webhook",
      "stock twitter monitor",
      "x trading bot alerts",
      "unusual whales webhook",
    ],
    sections: [
      {
        heading: "多数交易台的真实需求",
        paragraphs: [
          "多数交易与宏观工作流并不需要完整的过滤 firehose。他们需要在一份可信账号列表发帖时尽快得知——有时仅当文本提到 Fed、CPI、$SPY 或某只 ticker。",
          "官方 Pro 推流（约 $5k/月量级）解决全网规则。XFlux 监控解决账号级盯盘，配合 Dashboard 过滤与 Starter $19/月起的 webhook 投递。",
        ],
      },
      {
        heading: "监控配置示例",
        paragraphs: [
          "@unusual_whales，关键词如 flow、block、sweep——只要期权资金流，不要无关帖。",
          "@elerianm，关键词 fed、inflation、rate——仅在出现政策用语时推宏观评论。",
          "@DeItaone，无关键词——该账号的每条突发标题。",
          "更多模板见 /docs/guides/trading-keywords，实时摘要见 /signals/trading。",
        ],
      },
      {
        heading: "接入你的技术栈",
        paragraphs: [
          "命中时 XFlux POST 签名 JSON。校验 HMAC，再路由到 Slack、Telegram、Discord（经 Make 或自建机器人），或根据文本调整仓位的交易 worker。",
          "若希望按前瞻性喊单排名账号，可配合 Smart Money 预测者（/predictors），再把那些 @handle 加为监控。",
        ],
        code: `{
  "event": "monitor.hit",
  "monitor": {
    "targetUsername": "unusual_whales",
    "keywords": "flow, block"
  },
  "tweet": {
    "id": "1234567890",
    "text": "Large $SPY call sweep detected...",
    "authorUsername": "unusual_whales"
  },
  "detectedAt": "2026-09-16T12:00:05.000Z"
}`,
      },
      {
        heading: "成本对比（方向性）",
        paragraphs: [
          "官方过滤推流：高月费档、复杂规则、企业级配置。",
          "XFlux：选账号、设关键词、填 webhook URL——免费档看 Dashboard 历史，Starter 做实时 1 秒轮询 + 签名投递。",
          "交易执行与合规仍由你负责。XFlux 投递文本告警，不下单。",
        ],
      },
      {
        heading: "运维建议",
        paragraphs: [
          "从更少监控与更紧关键词起步，降低噪音。上线前用 Test webhook。把签名失败与业务逻辑分开记日志，以免时钟偏差被当成市场事件。",
        ],
      },
    ],
    faqs: [
      {
        question: "XFlux 能替代 Bloomberg 或券商行情吗？",
        answer:
          "不能。它盯公开 X 账号并推送推文载荷。用作告警层，而非行情供应商。",
      },
      {
        question: "监控有多快？",
        answer:
          "付费计划支持最短 1 秒轮询间隔。检测延迟是轮询间隔加投递时间——不是保证亚秒级的交易所行情。",
      },
      {
        question: "必须用 Make.com 吗？",
        answer:
          "不必。把 webhook 指到自有 HTTPS 端点，或用 Make/n8n/Zapier 做无代码路由。",
      },
      {
        question: "交易场景落地页在哪？",
        answer:
          "/use-cases/trading-alerts，关键词模板在 /docs/guides/trading-keywords。",
      },
    ],
  },
  {
    slug: "twitter-mcp-claude-cursor",
    title: "通过 XFlux MCP 把 Claude 或 Cursor 接到 X 数据",
    description:
      "为 Claude Desktop 与 Cursor 安装 @xflux/xflux-mcp-server。读取资料、搜索、时间线、监控与 Smart Money——与 xflux.us 的 Figma MCP 无关。",
    datePublished: "2026-09-22",
    keywords: [
      "twitter mcp",
      "claude twitter api",
      "cursor mcp twitter",
      "xflux mcp server",
      "mcp x api",
    ],
    sections: [
      {
        heading: "XFlux MCP 服务器做什么",
        paragraphs: [
          "Model Context Protocol（MCP）让 Claude Desktop 与 Cursor 用你的 XFlux API key 调用工具。包名为 @xflux/xflux-mcp-server（registry id io.github.yxs1640-png/xflux）。",
          "工具覆盖读取 API：用户资料、搜索、时间线、推文查询、只读监控列表/命中，以及 Smart Money 发现。创建监控与 webhook URL 仍在 Dashboard——MCP 保持读取导向。",
        ],
      },
      {
        heading: "不是另一个「xflux」",
        paragraphs: [
          "另有无关项目也使用「xflux」之名（例如面向 Figma 的 MCP 工具）。本指南仅针对 xfluxapi.com 上的 X/Twitter API 产品 XFlux——包作用域 @xflux/xflux-mcp-server。",
        ],
      },
      {
        heading: "安装与运行",
        paragraphs: [
          "需要 Node 18+ 与 Dashboard 中的 API key（前缀 xflux_）。MCP 调用与其他请求一样计入套餐 REST 配额。",
        ],
        code: `export XFLUX_API_KEY=xflux_your_key_here
npx @xflux/xflux-mcp-server`,
      },
      {
        heading: "Cursor 与 Claude Desktop 配置",
        paragraphs: [
          "把同一段 JSON 加到 Cursor MCP 设置或 Claude 的 claude_desktop_config.json，然后重启客户端。",
        ],
        code: `{
  "mcpServers": {
    "xflux": {
      "command": "npx",
      "args": ["-y", "@xflux/xflux-mcp-server"],
      "env": {
        "XFLUX_API_KEY": "xflux_your_key_here"
      }
    }
  }
}`,
      },
      {
        heading: "实用的 agent 模式",
        paragraphs: [
          "用 xflux_smart_money_list 发现前瞻性账号（对已在盯的 handle 传 exclude），查看时间线，再到 Dashboard → Monitors 用 webhook 盯住它们。",
          "营销概览：/mcp。完整工具列表：/docs/integrations/mcp。Smart Money 中心：/predictors。",
        ],
      },
    ],
    faqs: [
      {
        question: "这是 Figma 那个 xflux MCP 吗？",
        answer:
          "不是。在 xfluxapi.com 获取 X/Twitter 数据请用 @xflux/xflux-mcp-server。其他名为 xflux 的包无关。",
      },
      {
        question: "MCP 能创建监控或 webhook 吗？",
        answer:
          "不能。MCP 可列出监控与命中（只读）。创建监控与 webhook URL 请在 Dashboard。",
      },
      {
        question: "免费计划能用 MCP 吗？",
        answer:
          "可以，在免费 API 配额内（每月 1,000 次）。重度 agent 循环可能需要付费计划。",
      },
      {
        question: "npm 包在哪？",
        answer:
          "https://www.npmjs.com/package/@xflux/xflux-mcp-server",
      },
    ],
  },
  {
    slug: "twitter-api-python-nodejs",
    title: "X/Twitter API 示例：用 XFlux 写 Python 与 Node.js",
    description:
      "可复制的 Python 与 Node.js 示例：用 Bearer API key 调用 https://www.xfluxapi.com/api/v1——资料、时间线与搜索。",
    datePublished: "2026-09-23",
    keywords: [
      "twitter api python",
      "twitter api nodejs",
      "x api bearer token example",
      "xflux api example",
      "twitter search api python",
    ],
    sections: [
      {
        heading: "Base URL 与鉴权",
        paragraphs: [
          "所有示例请求 https://www.xfluxapi.com/api/v1。传递 Authorization: Bearer xflux_YOUR_KEY（或 X-API-Key）。注册时创建密钥；在欢迎屏复制一次，或在 Dashboard → API Keys 新建。",
          "成功响应把载荷包在 data 字段。错误返回 error，HTTP 4xx/5xx。完整参考：/docs/api。",
        ],
      },
      {
        heading: "curl（连通性检查）",
        paragraphs: [
          "接入 SDK 前，先用 curl 确认密钥可用。",
        ],
        code: `curl -X GET "https://www.xfluxapi.com/api/v1/users/elonmusk" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

curl -G "https://www.xfluxapi.com/api/v1/search" \\
  -H "Authorization: Bearer xflux_YOUR_KEY" \\
  --data-urlencode "q=fed rate" \\
  --data-urlencode "limit=10"`,
      },
      {
        heading: "Python（requests）",
        paragraphs: [
          "如需可安装 requests。把密钥放在环境变量——切勿提交进仓库。",
        ],
        code: `import os
import requests

BASE = "https://www.xfluxapi.com/api/v1"
headers = {"Authorization": f"Bearer {os.environ['XFLUX_API_KEY']}"}

# Profile
r = requests.get(f"{BASE}/users/OpenAI", headers=headers, timeout=30)
r.raise_for_status()
print(r.json()["data"]["username"])

# Timeline
r = requests.get(
    f"{BASE}/users/OpenAI/tweets",
    headers=headers,
    params={"limit": 5},
    timeout=30,
)
r.raise_for_status()
for tweet in r.json()["data"]:
    print(tweet["id"], tweet.get("text", "")[:80])

# Search
r = requests.get(
    f"{BASE}/search",
    headers=headers,
    params={"q": "from:OpenAI lang:en", "limit": 5},
    timeout=30,
)
r.raise_for_status()
print(len(r.json()["data"]), "results")`,
      },
      {
        heading: "Node.js（fetch）",
        paragraphs: [
          "Node 18+ 内置全局 fetch。同样的 Bearer 请求头模式。",
        ],
        code: `const BASE = "https://www.xfluxapi.com/api/v1";
const headers = {
  Authorization: \`Bearer \${process.env.XFLUX_API_KEY}\`,
};

const user = await fetch(\`\${BASE}/users/OpenAI\`, { headers });
if (!user.ok) throw new Error(await user.text());
console.log((await user.json()).data.username);

const q = new URLSearchParams({ q: "fed rate", limit: "5" });
const search = await fetch(\`\${BASE}/search?\${q}\`, { headers });
if (!search.ok) throw new Error(await search.text());
console.log((await search.json()).data.length, "results");`,
      },
      {
        heading: "下一步",
        paragraphs: [
          "更长指南：/docs/guides/python 与 /docs/guides/nodejs。常开账号告警请加监控与 webhook（/docs/monitors、/docs/webhooks）。面向 agent 请安装 MCP（/mcp）。",
        ],
      },
    ],
    faqs: [
      {
        question: "有官方 Python/Node SDK 吗？",
        answer:
          "可用任意 HTTP 客户端调用 REST API。MCP 覆盖 agent 工具；对多数脚本，轻量 REST 示例已够用。",
      },
      {
        question: "速率限制 / 配额是多少？",
        answer:
          "按套餐月度调用配额（免费 1,000；Starter 15 万；更高档更多）。见 /docs/limits 与 /pricing。",
      },
      {
        question: "这些示例能发推吗？",
        answer:
          "写/发帖端点不是产品重点（发帖标注即将推出）。请用 XFlux 做读取、搜索、监控与 webhook。",
      },
      {
        question: "密钥从哪里获取？",
        answer:
          "在 /register 注册——会自动创建 Default 密钥。免费档无需信用卡。",
      },
    ],
  },
];
