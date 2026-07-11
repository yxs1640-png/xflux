import Link from "next/link";
import {
  ArrowRight,
  Bot,
  LineChart,
  Radar,
  Search,
  Sparkles,
  Target,
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
      "Get signed webhooks when new tweets land (paid plans)",
      "Review hit history in the Dashboard",
    ],
    unlike: "Unlike read-only API proxies, you don't build the polling layer yourself.",
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/docs/monitors",
    docLabel: "Monitor guide",
  },
  {
    icon: Bot,
    audience: "AI & data builders",
    title: "Feed tweets into RAG, sentiment, and analytics",
    problem:
      "Your pipeline needs profiles, timelines, and search results — but the official API is costly and slow to approve.",
    solution: [
      "REST endpoints for users, tweets, and search",
      "Bearer API key — integrate in minutes",
      "1,000 free calls/month to prototype",
    ],
    unlike: "Unlike scrapers, you get stable JSON and documented limits.",
    capabilities: ["API"],
    docHref: "/docs/quickstart",
    docLabel: "API quickstart",
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
      "Enterprise social listening is overkill and overpriced; wiring your own monitors eats engineering time.",
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
      "Poll intervals from 15s (Scale) to 5 min (Free)",
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
            Whether you need on-demand data or always-on account watches, XFlux combines a read API
            and monitors in one place — without enterprise pricing or approval delays.
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
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs",
                        cap === "API"
                          ? "border-sky-500/20 bg-sky-500/10 text-sky-300"
                          : cap === "Monitor"
                            ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      )}
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
            API for on-demand reads. Monitors for always-on watches. One account, one bill.
          </p>
          <p className="text-sm text-zinc-500 mb-6 max-w-2xl mx-auto">
            Most alternatives sell you one or the other — cheap read access with no alerts, or
            expensive suites with no developer API. XFlux is both, from free tier up.
          </p>
          <Link href={registerHref}>
            <Button>
              Start free — see if your use case fits
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
