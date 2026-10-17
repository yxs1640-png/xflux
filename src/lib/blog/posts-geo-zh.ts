import type { BlogPost } from "./posts";

/** GEO recipes ZH — slugs match EN. */
export const BLOG_POSTS_GEO_ZH: BlogPost[] = [
  {
    slug: "connect-slack-to-twitter-alerts",
    title: "用 Slack Incoming Webhook 把 Twitter 提醒接到频道",
    description:
      "逐步说明：监控公开 X/Twitter 账号，把新帖发进 Slack 频道。免费可发测试消息，实时送达从 Starter 开始。只读，不会从 Slack 发推。",
    datePublished: "2026-10-17",
    keywords: ["connect slack to twitter", "slack twitter webhook", "twitter to slack"],
    sections: [
      {
        heading: "这条链路在做什么",
        paragraphs: [
          "这条 recipe 把公开 X/Twitter 帖子送进 Slack，不会从 Slack 发推，也不是官方 Account Activity API。",
          "XFlux 监控一个公开 @handle。出现匹配的新帖时，向 Slack Incoming Webhook 发送 { \"text\": \"*@author* posted:\\n…\\n链接\" }。免费档可发测试。实时命中从 Starter（$19/月）开始。",
          "短页：/connect-slack-to-twitter。参考：/docs/webhooks。",
        ],
      },
      {
        heading: "1. 创建 Slack Incoming Webhook",
        paragraphs: [
          "Slack：应用 → Incoming Webhooks → 添加到 Slack → 选择频道 → 复制 URL，形如 https://hooks.slack.com/services/T…/B…/…",
          "这个 URL 等同于发帖权限，不要公开。",
        ],
      },
      {
        heading: "2. 建一个免费监控",
        paragraphs: [
          "在 /register?src=blog_slack_recipe 注册（免费档不需要卡）。Dashboard → Monitors，添加一个公开用户名，可选关键词。",
          "把 Slack URL 填进 webhook，点 Test。频道里应出现：XFlux test OK — monitor @handle is connected。",
        ],
      },
      {
        heading: "3. 打开实时送达",
        paragraphs: [
          "免费档把命中记在 Dashboard，并能发测试。Starter 及以上会在检测到新帖时发 Slack 消息。",
          "同一个监控可以改成 Discord 或你自己的 HTTPS URL。",
        ],
      },
    ],
    faqs: [
      {
        question: "能从 Slack 发推吗？",
        answer: "不能。方向是 Twitter/X → Slack。XFlux 是读 API 加监控。",
      },
      {
        question: "需要自建 Slack bot 吗？",
        answer: "不需要。频道文本用 Incoming Webhook 就够。Block Kit 或线程才需要 bot。",
      },
      {
        question: "免费测试等于实时提醒吗？",
        answer: "测试只证明 URL 通。新帖实时消息需要 Starter 或更高。",
      },
    ],
  },
  {
    slug: "free-x-api-1000-calls",
    title: "免费 X API：每月 1,000 次调用，无需信用卡",
    description:
      "如何拿到免费的 X/Twitter 读 API key：资料、搜索、时间线。每月 1,000 次，1 个账号监控。独立于官方 X 开发者门户。",
    datePublished: "2026-10-17",
    keywords: ["free x api", "free twitter api", "x api free"],
    sections: [
      {
        heading: "免费档包含什么",
        paragraphs: [
          "XFlux Free 是面向公开 X/Twitter 数据的独立读 API，不是 developer.x.com 上的官方 API。",
          "免费包含每月 1,000 次调用、1 个账号监控（命中在 Dashboard），以及即时 key。不需要信用卡。Slack / Discord / HTTPS 实时 webhook 从 Starter $19/月开始。说明页：/free-x-api。",
        ],
      },
      {
        heading: "拿 key 并测一个资料",
        paragraphs: [
          "在 /register?src=blog_free_x_api 注册。Dashboard → API Keys 复制以 xflux_ 开头的 key。REST 和 MCP 用同一把。",
        ],
        code: `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  https://www.xfluxapi.com/api/v1/users/elonmusk`,
      },
      {
        heading: "搜索和时间线",
        paragraphs: [
          "搜索支持公开搜索常见运算符（from:、lang:、引号）。时间线是 GET /api/v1/users/{handle}/tweets。成功调用计入 1,000 次。",
        ],
        code: `curl -G "https://www.xfluxapi.com/api/v1/search" \\
  --data-urlencode 'q=from:elonmusk lang:en' \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`,
      },
      {
        heading: "同一把 key 给 Claude 或 Cursor",
        paragraphs: [
          "安装 @xflux/xflux-mcp-server，设置 XFLUX_API_KEY。工具调用计入同一 1,000 次。服务器只读，不能发帖。安装页：/mcp。",
        ],
      },
    ],
    faqs: [
      {
        question: "这是官方免费 X API 吗？",
        answer: "不是。官方计划在 developer.x.com。对比见 /docs/compare/pricing。",
      },
      {
        question: "免费档能发推吗？",
        answer: "不能。XFlux 是公开数据只读加监控。",
      },
      {
        question: "什么时候需要付费？",
        answer: "超过 1,000 次、需要多于 1 个监控，或要实时 webhook 时。",
      },
    ],
  },
  {
    slug: "twitter-search-operators-for-agents",
    title: "给 Agent 用的 Twitter 搜索运算符（from:、lang:、引号）",
    description:
      "可复制的 Twitter 搜索运算符，用于 API 或 MCP：from:账号、lang:en、引号短语、OR、减号。免费档每月 1,000 次。",
    datePublished: "2026-10-17",
    keywords: ["twitter search operators", "x search operators"],
    sections: [
      {
        heading: "运算符放在 q 里",
        paragraphs: [
          "XFlux GET /api/v1/search 的查询在参数 q。Agent 用 MCP 工具 xflux_search_tweets 时传同一串。这不是官方 X recent search 产品。",
          "速查页：/twitter-search-operators。更全的说明：/docs/guides/search 与 /blog/twitter-api-search-operators。",
        ],
        code: `curl -G "https://www.xfluxapi.com/api/v1/search" \\
  --data-urlencode 'q=from:elonmusk lang:en' \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`,
      },
      {
        heading: "值得用的运算符",
        paragraphs: [
          "from:elonmusk — 只要这个账号，运算符里不要加 @。",
          "lang:en — 语言。",
          "\"fed rate\" — 精确短语。可与 OR 组合。",
          "裸关键词（例如只搜 CPI）会烧掉配额。优先 from: 加短语。",
        ],
      },
      {
        heading: "怎么对 agent 说",
        paragraphs: [
          "装好 MCP（/mcp）后可以用：用 xflux_search_tweets 搜索 @elonmusk 最近的英文利率相关帖子，不要爬虫。",
          "搜索是按需的。要在每次发帖时通知 Slack 或 Discord，用监控（/monitor-twitter-account），不要循环轮询搜索。",
        ],
      },
    ],
    faqs: [
      {
        question: "Claude 或 Cursor 里能用这些运算符吗？",
        answer: "可以。通过 @xflux/xflux-mcp-server 的 xflux_search_tweets，把运算符字符串放进 q。",
      },
      {
        question: "搜索和监控怎么选？",
        answer: "搜索回答当下的问题。监控持续盯一个 @handle。",
      },
    ],
  },
];
