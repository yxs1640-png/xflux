import Link from "next/link";
import { ArrowRight, Bell, Database, Radar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PATHS = [
  {
    icon: Database,
    step: "1",
    title: "Pull data on demand",
    description:
      "Call REST endpoints from your app, script, or data pipeline — profiles, search, timelines, tweet lookup.",
    examples: ["Enrich a CRM with @handles", "Backfill tweets for sentiment", "Power a search UI"],
    href: "/docs/quickstart",
    linkLabel: "API quickstart",
  },
  {
    icon: Radar,
    step: "2",
    title: "Watch accounts in the background",
    description:
      "Create monitors in the Dashboard. XFlux polls for new tweets so you do not need cron jobs or scrapers.",
    examples: ["Track KOL accounts", "Watch competitor launches", "Alert on brand mentions"],
    href: "/docs/monitors",
    linkLabel: "Monitor guide",
  },
  {
    icon: Bell,
    step: "3",
    title: "Get pushed via webhook",
    description:
      "On Starter plans and above, new monitor hits POST signed JSON to your HTTPS endpoint — build real-time alerts.",
    examples: ["Slack / Discord bots", "Trading signal pipelines", "Auto-summarize new posts"],
    href: "/twitter-webhook",
    linkLabel: "Webhook integration",
  },
] as const;

export function UseCaseStrip() {
  return (
    <section className="py-20 border-t border-zinc-800/50 bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Three ways teams use XFlux
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Start with the REST API for one-off reads. Add monitors when you need ongoing coverage.
            Upgrade to webhooks when you want push instead of poll.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PATHS.map((path) => (
            <Card key={path.title} className="h-full border-zinc-800/80">
              <CardHeader>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sm font-semibold text-sky-400">
                    {path.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900">
                    <path.icon className="h-5 w-5 text-sky-400" />
                  </div>
                </div>
                <CardTitle className="text-xl">{path.title}</CardTitle>
                <CardDescription className="text-zinc-400">{path.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {path.examples.map((example) => (
                    <li key={example} className="text-sm text-zinc-500 before:content-['·'] before:mr-2 before:text-zinc-600">
                      {example}
                    </li>
                  ))}
                </ul>
                <Link
                  href={path.href}
                  className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300"
                >
                  {path.linkLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
