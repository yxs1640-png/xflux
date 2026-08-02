import Link from "next/link";
import { Radar, Search, User, Webhook, MessageSquare, List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CAPABILITIES = [
  {
    icon: User,
    title: "Profiles & users",
    description: "Lookup public profiles by @username — id, bio, followers, verification.",
    useCase: "CRM enrichment, author cards, verification checks",
    endpoints: ["GET /api/v1/users/:username"],
    href: "/docs/api",
  },
  {
    icon: MessageSquare,
    title: "Timelines",
    description: "Fetch recent tweets from any public account timeline.",
    useCase: "Feed widgets, backtests, content archives",
    endpoints: ["GET /api/v1/users/:username/tweets"],
    href: "/docs/api",
  },
  {
    icon: Search,
    title: "Search",
    description: "Search public posts by keyword, hashtag, or from:username.",
    useCase: "Brand monitoring, trend research, RAG ingestion",
    endpoints: ["GET /api/v1/search?q="],
    href: "/docs/api",
  },
  {
    icon: List,
    title: "Tweet lookup",
    description: "Retrieve a single tweet by ID for enrichment or moderation pipelines.",
    useCase: "Link unfurling, moderation, fact-check tools",
    endpoints: ["GET /api/v1/tweets/:id"],
    href: "/docs/api",
  },
  {
    icon: Radar,
    title: "Account monitors",
    description: "Background polling for new tweets — no cron jobs or scraping scripts.",
    useCase: "KOL tracking, competitor watches, alert rules",
    endpoints: ["Dashboard → Monitors"],
    href: "/docs/monitors",
  },
  {
    icon: Webhook,
    title: "Signed webhooks",
    description: "HTTP POST to your URL when a monitor detects a new tweet. HMAC verified.",
    useCase: "Slack bots, trading signals, real-time AI agents",
    endpoints: ["POST your-endpoint (Starter+)"],
    href: "/twitter-webhook",
  },
];

export function ApiCapabilities() {
  return (
    <section className="py-24 border-t border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            One API for read access — plus monitors that push to you
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            REST endpoints for on-demand pulls. Account monitors with optional webhooks when you
            do not want to poll yourself.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap) => (
            <Link key={cap.title} href={cap.href} className="group block h-full">
              <Card className="h-full transition-colors group-hover:border-sky-500/30">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                    <cap.icon className="h-5 w-5 text-sky-400" />
                  </div>
                  <CardTitle className="text-lg">{cap.title}</CardTitle>
                  <CardDescription>{cap.description}</CardDescription>
                  <p className="text-xs text-zinc-500 mt-2">
                    <span className="text-zinc-600">Use for:</span> {cap.useCase}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cap.endpoints.map((ep) => (
                      <Badge key={ep} variant="sky" className="font-mono text-xs">
                        {ep}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
