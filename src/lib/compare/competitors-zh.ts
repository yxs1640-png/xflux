import type { ComparePage } from "./competitors";

export const COMPARE_PAGES_ZH: ComparePage[] = [
  {
    slug: "x-api",
    title: "XFlux vs 官方 X API",
    description:
      "对比 XFlux 固定套餐与账号监控，以及官方 X/Twitter API——在读取、告警、推流与写权限上各自何时使用。",
    keywords: [
      "xflux vs x api",
      "twitter api alternative",
      "x api pricing comparison",
      "cheap twitter api vs official",
    ],
    competitorName: "官方 X API",
    rows: [
      {
        label: "接入",
        them: "开发者门户、应用配置，档位审批因情况而异",
        us: "即时注册——一分钟内拿到 API key",
      },
      {
        label: "定价模式",
        them: "按量计费和/或高月费档位",
        us: "固定月费套餐（API 配额 + 监控）",
      },
      {
        label: "入门成本（方向性）",
        them: "Basic/按量历史上约 $100+/月量级；Pro 推流约 $5k/月",
        us: "免费：1k 次调用 + 1 个监控。Starter：$19/月",
      },
      {
        label: "资料 / 时间线 / 搜索",
        them: "有",
        us: "有 — REST + MCP",
      },
      {
        label: "账号监控 + webhook",
        them: "自己轮询，或昂贵的推流产品",
        us: "内置监控；Starter+ 上实时 HMAC webhook",
      },
      {
        label: "过滤 / 实时推流",
        them: "Pro 过滤推流常被引用约 $5,000/月",
        us: "账号级监控作为务实替代",
      },
      {
        label: "发帖 / 点赞 / 私信（写）",
        them: "有（需凭证）",
        us: "无 — 专注读取与监控",
      },
      {
        label: "面向 AI agent 的 MCP",
        them: "社区封装，使用你的 X 密钥",
        us: "官方包 @xflux/xflux-mcp-server",
      },
    ],
    whenThem: [
      "你需要写权限（发帖、点赞、私信）或用户委托的 OAuth",
      "你要求官方企业 firehose / 过滤推流 SLA",
      "合规要求第一方 X 开发者合同",
    ],
    whenUs: [
      "你只需公开读取，以及特定账号发帖时的告警",
      "你想要从免费/$19 起的固定定价，而非按量意外或 $5k 推流",
      "你想在同一账号获得监控、签名 webhook、Make.com、MCP 与 Signals",
    ],
    faqs: [
      {
        question: "XFlux 是官方 X API 的即插即用替代吗？",
        answer:
          "不是。XFlux 覆盖公开读取、账号监控、webhook 与 MCP。写 API 与企业推流仍走官方 X。",
      },
      {
        question: "本对比里的官方价格是固定的吗？",
        answer:
          "不是——X 的套餐会变。请在 docs.x.com 核对当前费率。XFlux 价格见 /pricing。",
      },
      {
        question: "监控会消耗 REST 配额吗？",
        answer:
          "不会。定时监控轮询与 /api/v1 调用配额分开。",
      },
    ],
    relatedLinks: [
      { href: "/docs/compare/pricing", label: "定价对比官方（文档）" },
      { href: "/pricing", label: "XFlux 定价" },
      { href: "/twitter-webhook", label: "Twitter webhook" },
      { href: "/mcp", label: "MCP 概览" },
      { href: "/blog/x-api-cost-2026", label: "2026 年 X API 成本" },
    ],
  },
  {
    slug: "sorsa",
    title: "XFlux vs Sorsa API",
    description:
      "Sorsa 侧重廉价、高量 X/Twitter 读取与教程 SEO；XFlux 在固定套餐之外，加上账号监控、签名 webhook、MCP 与 Signals。",
    keywords: [
      "xflux vs sorsa",
      "sorsa api alternative",
      "sorsa twitter api",
      "twitter api alternative comparison",
    ],
    competitorName: "Sorsa API",
    rows: [
      {
        label: "核心卖点",
        them: "廉价公开读取 / 爬虫式 REST（以量为主）",
        us: "读取 API + 常开账号监控 + 签名 webhook",
      },
      {
        label: "定价形态",
        them: "按请求固定价 / 面向低 $/1k 读取的档位——请在其站点核对",
        us: "固定月费 免费 → Scale，含调用配额 + 监控名额",
      },
      {
        label: "账号监控",
        them: "非核心产品叙事——通常自己轮询",
        us: "带可选关键词过滤的 Dashboard 监控",
      },
      {
        label: "签名 webhook",
        them: "通常不是差异化重点",
        us: "Starter+ 上 HMAC-SHA256 的 monitor.hit 投递",
      },
      {
        label: "AI / MCP",
        them: "自行接入 agent",
        us: "面向 Claude 与 Cursor 的 @xflux/xflux-mcp-server",
      },
      {
        label: "内容 / 发现",
        them: "强语言 how-to 博客（Python/Node/Go）",
        us: "实时 Signals 摘要 + Smart Money 预测者 + 文档/博客",
      },
    ],
    whenThem: [
      "你主要需要以最低单位成本做大批量公开读取",
      "你已自有轮询、告警与 agent 基础设施",
      "你在评估纯查询 API，且不需要监控",
    ],
    whenUs: [
      "你需要特定 @handle 发帖时的告警——无需写轮询器",
      "你想要可预期的免费/$19+ 套餐，覆盖读取与监控",
      "你想在同一产品内获得 MCP、Make.com 路由与 Signals",
    ],
    faqs: [
      {
        question: "谁在原始 $/1k 推文价格上更优？",
        answer:
          "像 Sorsa 这类以量为主的读取 API，常宣传极低单位价。请把你预期的月调用量对照 XFlux 套餐配额——单位价本身忽略了监控/webhook 工作量。",
      },
      {
        question: "XFlux 是爬虫市场吗？",
        answer:
          "不是。XFlux 是自助式读取 API，付费计划上具备一等公民的账号监控与签名 webhook。",
      },
      {
        question: "能两个都用吗？",
        answer:
          "可以。有些团队用廉价批量读取 API 做回填，用 XFlux 做实时监控、webhook 与 agent MCP 接入。",
      },
    ],
    relatedLinks: [
      { href: "/pricing", label: "XFlux 定价" },
      { href: "/compare/x-api", label: "对比官方 X API" },
      { href: "/twitter-webhook", label: "Webhook" },
      { href: "/mcp", label: "MCP" },
      { href: "/blog/twitter-api-alternative", label: "API 替代方案指南" },
    ],
  },
  {
    slug: "socialdata",
    title: "XFlux vs SocialData",
    description:
      "SocialData 提供深入的监控 API 文档；XFlux 将监控与 Dashboard、Make.com webhook、MCP 与信号摘要搭配在一起。",
    keywords: [
      "xflux vs socialdata",
      "socialdata alternative",
      "twitter monitor api",
      "socialdata vs xflux",
    ],
    competitorName: "SocialData",
    rows: [
      {
        label: "监控 API 文档",
        them: "强大的、面向开发者的监控 API 文档",
        us: "监控主要经 Dashboard；REST + MCP 上只读列表/命中",
      },
      {
        label: "产品体验",
        them: "API 优先工作流",
        us: "Dashboard 管监控/webhook + REST 做查询",
      },
      {
        label: "自动化",
        them: "通过其 API 集成",
        us: "签名 webhook + 有文档的 Make.com / Discord 模式",
      },
      {
        label: "读取 API",
        them: "社交数据端点（因套餐而异）",
        us: "资料、时间线、搜索、推文查询",
      },
      {
        label: "附加能力",
        them: "聚焦社交数据 API",
        us: "MCP、Smart Money 预测者、实时 Signals 摘要",
      },
      {
        label: "定价形态",
        them: "其自有档位——请在其站点核对",
        us: "固定 免费/$19+，含监控",
      },
    ],
    whenThem: [
      "你希望完全通过可编程监控 API 驱动监控",
      "你已标准化在 SocialData 的文档与客户端库上",
      "你只需要其特定的社交数据端点",
    ],
    whenUs: [
      "你更偏好 Dashboard 配置，再用 Make.com 路由告警",
      "你想在产品内获得 Claude/Cursor MCP 与 Smart Money 发现",
      "你想要一个覆盖读取与账号盯盘的固定套餐",
    ],
    faqs: [
      {
        question: "XFlux 是否暴露完整的监控 CRUD HTTP API？",
        answer:
          "监控在 Dashboard 创建与配置。REST 暴露只读列表与命中；MCP 镜像该只读访问。",
      },
      {
        question: "我仍能自动化告警吗？",
        answer:
          "可以——Starter+ 上签名 HTTP webhook，指向自有服务器或 Make.com Custom Webhook。",
      },
      {
        question: "这是联盟营销对比吗？",
        answer:
          "不是。双方功能都会变——请在 SocialData 站点核对当前文档与定价。",
      },
    ],
    relatedLinks: [
      { href: "/docs/monitors", label: "监控文档" },
      { href: "/docs/integrations/make", label: "Make.com 指南" },
      { href: "/signals", label: "Signals" },
      { href: "/predictors", label: "Smart Money" },
      { href: "/mcp", label: "MCP" },
    ],
  },
];
