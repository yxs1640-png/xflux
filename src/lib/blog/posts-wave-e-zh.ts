import type { BlogPost } from "./posts";

/** Wave E ZH mirrors — keep slugs identical to EN. */
export const BLOG_POSTS_WAVE_E_ZH: BlogPost[] = [
  {
    slug: "twitter-api-search-operators",
    title: "X/Twitter 搜索运算符（from: / since: / lang:）与 API 用法",
    description:
      "在读 API 里使用 X 高级搜索运算符——from:用户、since:、until:、lang:、filter:replies，并附 XFlux /api/v1/search 示例。",
    datePublished: "2026-09-28",
    keywords: [
      "twitter search operators",
      "twitter api search from",
      "x api search query",
      "twitter advanced search api",
      "xflux search",
    ],
    sections: [
      {
        heading: "为什么运算符比堆关键词更有效",
        paragraphs: [
          "只搜 “CPI” 会得到大量噪音：段子、回复、无关品牌。运算符能像 X 高级搜索一样收窄查询，但通过 API 便于自动化。",
          "XFlux 的 search 用 q 传查询字符串，无需走官方 X API 审批。文档：/docs/guides/search。",
        ],
      },
      {
        heading: "监控场景里最有用的运算符",
        paragraphs: [
          "from:username — 只要该账号的帖子。适合已知对象、想一次性拉取而不是长期 monitor。",
          "since:YYYY-MM-DD 与 until:YYYY-MM-DD — 限制时间窗。探索时窗口宜短，过宽浪费配额且噪音多。",
          "lang:en 等 — 过滤语言。filter:replies / -filter:replies — 包含或排除回复。min_faves / min_retweets — 互动门槛。",
          "谨慎组合：from:FederalReserve lang:en since:2026-09-01 通常优于塞五个无关词。",
        ],
      },
      {
        heading: "XFlux 示例",
        paragraphs: ["对 https://www.xfluxapi.com/api/v1/search 使用 Bearer；注意 URL 编码。"],
        code: `curl -G "https://www.xfluxapi.com/api/v1/search" \\
  -H "Authorization: Bearer xflux_YOUR_KEY" \\
  --data-urlencode "q=from:FederalReserve lang:en" \\
  --data-urlencode "limit=10"

# Python
import os, requests
r = requests.get(
    "https://www.xfluxapi.com/api/v1/search",
    headers={"Authorization": f"Bearer {os.environ['XFLUX_API_KEY']}"},
    params={"q": "CPI OR FOMC -filter:replies lang:en", "limit": 20},
    timeout=30,
)
r.raise_for_status()
print(len(r.json()["data"]))`,
      },
      {
        heading: "搜索 vs 账号监控",
        paragraphs: [
          "搜索是按需：适合研究、回填、agent（MCP xflux_search_tweets）。账号监控适合持续「这个 @ 发帖了」并在付费计划推送签名 webhook。",
          "交易/宏观关键词模板：/docs/guides/trading-keywords。Webhook：/blog/twitter-account-monitor-webhook。",
        ],
      },
    ],
    faqs: [
      {
        question: "官方全部运算符都能用吗？",
        answer: "常用读运算符（from、since、until、lang、filter、OR、引号）是实用集合。写操作或冷门运算符不在读 API 范围。",
      },
      {
        question: "搜索算月度配额吗？",
        answer: "算。每次搜索消耗 API 调用。Free 每月 1,000 次。见 /pricing 与 /docs/limits。",
      },
      {
        question: "能搜私密账号吗？",
        answer: "不能。XFlux 仅面向公开 X/Twitter 数据。",
      },
    ],
  },
  {
    slug: "webhook-vs-polling-twitter",
    title: "Twitter/X 账号告警：Webhook 还是轮询？",
    description:
      "对比轮询时间线与签名 HTTP webhook 做 X 账号告警——延迟、成本、失败模式，以及何时用 XFlux monitors。",
    datePublished: "2026-09-28",
    keywords: [
      "twitter webhook vs polling",
      "twitter account alerts",
      "x api polling",
      "signed webhooks twitter",
      "twitter monitor webhook",
    ],
    sections: [
      {
        heading: "轮询的陷阱",
        paragraphs: [
          "常见 DIY：每 N 分钟 cron、拉时间线、diff tweet id、通知 Slack/Discord。账号一多就吃配额、撞限流，任务静默失败也不易发现。",
          "轮询还有延迟下限。5 分钟 cron 意味着行情帖最多晚 5 分钟。缩短间隔会成倍增加 API 消耗。",
        ],
      },
      {
        heading: "Webhook 改变了什么",
        paragraphs: [
          "Monitors 由平台按调度观察，有新推文时 POST 到你的 HTTPS。付费 XFlux 计划会对 payload 签名（HMAC）便于验真。仍需幂等处理——任何 webhook 系统都可能重复投递。",
          "你用端点可靠性（TLS、快速 2xx、重试）换掉 cron 复杂度；生产告警通常该这么做。",
        ],
      },
      {
        heading: "何时轮询仍合适",
        paragraphs: [
          "一次性研究脚本、MCP agent 会话、低风险仪表盘可以按需轮询。Free 探索也常从这里开始。",
          "混合：用搜索/轮询发现账号，再把优质对象升级为 monitors + webhooks，不再人肉养 cron。",
        ],
      },
      {
        heading: "落地清单",
        paragraphs: [
          "延迟或漏帖会亏钱时优先 webhook；还在摸查询时先轮询。校验签名、记录投递 id、处理函数控制在几百毫秒内。",
          "配置：/docs/monitors、/docs/webhooks。叙事：/blog/twitter-account-monitor-webhook。Discord：/twitter-discord-alerts。",
        ],
      },
    ],
    faqs: [
      {
        question: "Free 含正式 webhook 吗？",
        answer: "Free 可创建 monitor 并发测试推送。新帖正式投递从 Starter 起。见 /pricing。",
      },
      {
        question: "如何校验 XFlux webhook？",
        answer: "用 Dashboard 中的签名密钥校验 HMAC header，再信任 body。见 /docs/webhooks。",
      },
      {
        question: "端点挂了怎么办？",
        answer: "按重试与补齐设计。接收端要高可用；请求路径上不要做重活——先入队再快速 ack。",
      },
    ],
  },
  {
    slug: "twitter-api-free-tier",
    title: "2026 年 Twitter/X API 免费档：你实际能得到什么",
    description:
      "对比读取公开 X 数据的免费路径——官方准入现实 vs XFlux 等 freemium（1,000 次调用 + 1 个 monitor）。",
    datePublished: "2026-09-28",
    keywords: [
      "twitter api free tier",
      "x api free 2026",
      "free twitter api alternative",
      "twitter api free plan",
      "xflux free tier",
    ],
    sections: [
      {
        heading: "「免费 Twitter API」很容易误导",
        paragraphs: [
          "开发者仍在搜 free Twitter API。X 改价后，正经读量多半要付费并过审。以前靠爬虫或已死免费档的项目需要清晰的 freemium，否则会卡住。",
          "评估免费档问三件事：是到期试用还是每月额度？是否必须写操作？只要偶发读取，还是要推送告警？",
        ],
      },
      {
        heading: "XFlux Free 含什么",
        paragraphs: [
          "Free：每月 1,000 次 API 调用、1 个账号监控、自助注册、无需信用卡。可读资料、时间线、推文查询与搜索。含文档与 Dashboard。",
          "新帖签名 webhook 从付费计划开始（$19/mo 起）。Free 用来验证鉴权、接客户端、体验 monitor——不是撑生产新闻台。",
        ],
      },
      {
        heading: "如何把 1,000 次用好",
        paragraphs: [
          "缓存资料查询。少用密轮询，多用 monitors。搜索加运算符并限制 limit。避免热重载狂打同一接口。",
          "触顶后 Starter 升到每月 150,000 次并含 webhook。价格：/pricing 与 /blog/x-api-cost-2026。",
        ],
      },
      {
        heading: "替代方案怎么看",
        paragraphs: [
          "爬虫和非官方客户端看着「免费」，直到 TOS、封 IP 或值班爆炸。托管读 API 用钱换稳定。对比：/blog/twitter-api-alternative 与 /compare。",
        ],
      },
    ],
    faqs: [
      {
        question: "XFlux 隶属 X Corp 吗？",
        answer: "不。XFlux 是独立的公开数据读 API 与监控产品。",
      },
      {
        question: "需要官方开发者审批吗？",
        answer: "用 XFlux 自助即可。/register 创建密钥后直接调用。",
      },
      {
        question: "Free 额度用尽会怎样？",
        answer: "额度重置前或升级前，后续调用会被拒绝。在 Dashboard → Usage 查看。",
      },
    ],
  },
  {
    slug: "twitter-to-discord-alerts",
    title: "把 X/Twitter 账号告警推到 Discord",
    description:
      "XFlux monitors → 签名 webhook → Discord webhook/机器人，把账号发帖灌进频道——不必自己轮询时间线。",
    datePublished: "2026-09-28",
    keywords: [
      "twitter to discord",
      "twitter discord webhook",
      "x account discord alerts",
      "twitter bot discord",
      "monitor twitter discord",
    ],
    sections: [
      {
        heading: "目标",
        paragraphs: [
          "团队希望创始人、交易所或宏观账号一发帖，Discord 频道就亮。自己轮询等于养 worker、存游标、扛故障。",
          "更干净：在 XFlux 监控 @，收签名 HTTP webhook，再转发短消息到 Discord Incoming Webhook。",
        ],
      },
      {
        heading: "最小架构",
        paragraphs: [
          "1) 建 Discord 频道 webhook。2) 部署 HTTPS 接收端（Worker / Vercel / Make）。3) 建 XFlux monitor 指向接收端。4) 校验签名、格式化、POST 到 Discord。",
          "Make 用户可少写代码：/docs/integrations/make。落地页：/twitter-discord-alerts。",
        ],
      },
      {
        heading: "接收端示意（Node）",
        paragraphs: ["示意代码——生产环境务必先校验 HMAC。"],
        code: `// After verifying XFlux signature...
const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
const tweet = payload.tweet; // shape depends on monitor event

await fetch(discordWebhook, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: \`**@\${payload.username}** posted:\\n\${tweet.text}\\n\${tweet.url}\`,
  }),
});`,
      },
      {
        heading: "运维建议",
        paragraphs: [
          "账号狂刷线程时限制 Discord 频率。按 tweet id 去重。宏观与 meme 分频道，方便静音。",
          "更多：/blog/twitter-account-monitor-webhook。关键词：/docs/guides/trading-keywords。",
        ],
      },
    ],
    faqs: [
      {
        question: "Discord 能直接调 XFlux 吗？",
        answer: "Incoming webhook 只收 POST。需要中间层（自建或 Make）先接 XFlux。",
      },
      {
        question: "一定要 Bot Token 吗？",
        answer: "频道 webhook 通常够用。Bot 适合斜杠命令等更复杂场景。",
      },
      {
        question: "需要什么套餐？",
        answer: "正式 monitor 投递需付费。Free 可先测通 Discord 转发。",
      },
    ],
  },
  {
    slug: "track-crypto-kols-twitter-api",
    title: "用 API 追踪加密 KOL（别再用表格人肉刷）",
    description:
      "用搜索 + 账号监控跟踪加密影响者与项目号——把表格盯盘换成可预算的 webhook 与配额。",
    datePublished: "2026-09-28",
    keywords: [
      "crypto kol twitter",
      "track crypto influencers twitter",
      "twitter crypto alerts",
      "memecoin twitter monitor",
      "xflux crypto",
    ],
    sections: [
      {
        heading: "表格撑不住",
        paragraphs: [
          "交易台和散户把 KOL、创始人、部署者塞进 Notion/Sheets，再手动刷时间线。当你在乎分钟级而不是小时级时就会崩——也不会在有人喊单时打到 Discord。",
          "把 KOL 追踪当成工程：搜索发现候选 → 高信号账号升级 monitor → 命中推到告警栈。",
        ],
      },
      {
        heading: "先发现再升级",
        paragraphs: [
          "用 cashtag 与叙事运算符（如 $SOL OR “airdrop” lang:en -filter:replies）建候选列表。对反复做可证伪判断的账号拉时间线——别只看互动诱饵。",
          "保留对象升级为 XFlux monitors。若要预测型账号排名，可结合 Smart Money（/predictors）。",
        ],
      },
      {
        heading: "告警卫生",
        paragraphs: [
          "L1/L2 新闻与 meme KOL 分频道。接收端可再滤关键词。第一天别监控太多账号——每个 monitor 都是运维承诺。",
          "用例：/use-cases/crypto-alerts。相关：/blog/twitter-trading-alerts。",
        ],
      },
      {
        heading: "配额怎么花",
        paragraphs: [
          "探索期会烧掉搜索/时间线调用。稳态应偏 monitor，避免对每个 KOL 每分钟轮询。先用 Free 验证链路，再上 Starter+ 拿正式 webhook 与更高配额。",
        ],
      },
    ],
    faqs: [
      {
        question: "能一起监控私密 Telegram 吗？",
        answer: "XFlux 专注公开 X 数据。Telegram 用自有栈；可用同一 Discord 转发器汇合告警。",
      },
      {
        question: "和社交聆听套件有何不同？",
        answer: "XFlux 是开发者向 REST + monitors + MCP，不是完整品牌社交套件。告警 UX 由你掌控。",
      },
      {
        question: "从哪开始？",
        answer: "注册 → 建密钥 → 搜 cashtag → 加一个 monitor → 接 Discord。指南：/docs/guides/search、/twitter-discord-alerts。",
      },
    ],
  },
];
