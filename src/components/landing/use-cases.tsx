import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Coins,
  LineChart,
  Radar,
  Search,
  Sparkles,
  Target,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const USE_CASES = [
  {
    icon: LineChart,
    audience: "Traders & researchers",
    title: "Catch KOL posts before the market moves",
    problem:
      "You follow influential accounts but can't sit on X all day — and most API tools only let you pull data on demand.",
    solution: [
      "Monitor @accounts on a schedule — no cron jobs to maintain",
      "Keyword filters for Fed, flow, or ticker-specific hits",
      "Signed webhooks into Make, Slack, or your bot (paid)",
    ],
    unlike: "Unlike the official filtered stream ($5,000+/mo), you watch accounts you pick from $19.",
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/use-cases/trading-alerts",
    docLabel: "Trading alerts guide",
  },
  {
    icon: Bot,
    audience: "AI builders",
    title: "Aggregate AI lab & researcher timelines",
    problem:
      "You need OpenAI, Anthropic, DeepMind, and researcher posts in one pipeline — without official API friction.",
    solution: [
      "Poll timelines and search via REST or MCP",
      "Batch @handles into a research digest",
      "1,000 free API calls/month to prototype",
    ],
    unlike: "Unlike scrapers, you get stable JSON, quotas, and an MCP server for Claude/Cursor.",
    capabilities: ["API", "MCP"],
    docHref: "/use-cases/ai-research",
    docLabel: "AI research guide",
  },
  {
    icon: Coins,
    audience: "Crypto & memecoins",
    title: "Alert when crypto KOLs mention tokens",
    problem:
      "Memecoin and trading accounts move markets in minutes — manual refresh is too slow.",
    solution: [
      "Monitor KOLs with token/keyword filters",
      "Webhook hits to Telegram, Discord, or your bot",
      "Browse live crypto digests and Smart Money accounts",
    ],
    unlike: "Unlike enterprise listening suites, setup is self-serve and priced for builders.",
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/use-cases/crypto-alerts",
    docLabel: "Crypto alerts guide",
  },
  {
    icon: Terminal,
    audience: "AI agents",
    title: "Give Claude or Cursor live X data",
    problem:
      "Agents need profiles, search, and your monitor hits without you pasting screenshots.",
    solution: [
      "Official MCP Registry package via npx",
      "Compact summaries for agent context windows",
      "Read-only monitor list and hits with your API key",
    ],
    unlike: "Unlike posting-focused MCP servers, XFlux is built for research and monitoring.",
    capabilities: ["MCP", "API"],
    docHref: "/docs/integrations/mcp",
    docLabel: "MCP docs",
  },
  {
    icon: Sparkles,
    audience: "SaaS & product teams",
    title: "Embed X data in your product without enterprise sales",
    problem:
      "You want profile lookup or search inside your app, not a months-long developer portal application.",
    solution: [
      "Drop-in REST API with clear quotas per plan",
      "Scale from free tier to 4M calls/month",
      "Self-serve docs and API keys",
    ],
    unlike: "Unlike the official Basic tier at $100+/mo, paid plans start at $19.",
    capabilities: ["API"],
    docHref: "/docs/api",
    docLabel: "API reference",
  },
  {
    icon: Target,
    audience: "Growth & competitive intel",
    title: "Track competitors, founders, and industry voices",
    problem:
      "Enterprise social listening is overkill; wiring your own monitors eats engineering time.",
    solution: [
      "Watch multiple public accounts per plan",
      "Dashboard timeline of every new hit",
      "Webhook into Slack, Discord, or your backend",
    ],
    unlike: "Unlike listening suites priced for enterprises, XFlux is built for builders.",
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/docs/monitors",
    docLabel: "Monitor guide",
  },
  {
    icon: Radar,
    audience: "Alert & news workflows",
    title: "Turn account activity into real-time signals",
    problem:
      "You need a reliable trigger when a specific account posts — not a manual refresh or fragile scraper.",
    solution: [
      "Poll intervals from 1s (paid) to 5 min (Free)",
      "HMAC-signed webhook payloads for verification",
      "One monitor on Free — scale to 50 on Scale",
    ],
    unlike: "Unlike DIY scripts, polling runs in our infrastructure.",
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/docs/webhooks",
    docLabel: "Webhook setup",
  },
  {
    icon: Search,
    audience: "Indie hackers",
    title: "Start free, ship fast, upgrade when traction hits",
    problem:
      "You're validating an idea and don't want a credit card or sales call before the first API call.",
    solution: [
      "Free tier: 1,000 API calls + 1 monitor",
      "Instant signup — API key in under 60 seconds",
      "Upgrade only when usage grows",
    ],
    unlike: "Unlike platforms that gate access behind approval, you start building today.",
    capabilities: ["API", "Monitor"],
    docHref: "/docs/quickstart",
    docLabel: "Quickstart",
  },
] as const;

function capabilityClass(cap: string) {
  if (cap === "API") return "border-sky-500/20 bg-sky-500/10 text-sky-300";
  if (cap === "Monitor") return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
  if (cap === "MCP") return "border-violet-500/20 bg-violet-500/10 text-violet-300";
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
}

export function UseCases({
  registerHref = "/register?src=homepage_usecases",
}: {
  registerHref?: string;
}) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Built for the jobs you actually have
          </h2>
          <p className="mt-4 text-zinc-400 max-w-3xl mx-auto">
            Whether you need on-demand reads, always-on KOL watches, or MCP for AI agents, XFlux
            combines API and monitors — without enterprise pricing or approval delays.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <Card
              key={useCase.title}
              className="flex flex-col hover:border-sky-500/30 transition-colors"
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                    <useCase.icon className="h-5 w-5 text-sky-400" />
                  </div>
                  <Badge variant="default" className="shrink-0">
                    {useCase.audience}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-snug">{useCase.title}</CardTitle>
                <CardDescription className="text-zinc-400 leading-relaxed">
                  {useCase.problem}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="space-y-2 mb-4 flex-1">
                  {useCase.solution.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{useCase.unlike}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {useCase.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className={cn("rounded-full border px-2.5 py-0.5 text-xs", capabilityClass(cap))}
                    >
                      {cap}
                    </span>
                  ))}
                </div>
                <Link
                  href={useCase.docHref}
                  className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 transition-colors"
                >
                  {useCase.docLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-8 text-center">
          <p className="text-zinc-300 mb-2 font-medium">
            API for on-demand reads. Monitors for always-on watches. MCP for agents. One account.
          </p>
          <p className="text-sm text-zinc-500 mb-6 max-w-2xl mx-auto">
            Most alternatives sell you one or the other — cheap read access with no alerts, or
            expensive suites with no developer API. XFlux is both, from free tier up.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={registerHref}>
              <Button>
                Start free — see if your use case fits
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs/compare/pricing">
              <Button variant="outline">Compare pricing vs official X API</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
