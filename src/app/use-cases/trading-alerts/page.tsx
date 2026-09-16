import Link from "next/link";
import { Bell, LineChart, TrendingUp, Webhook, Zap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Trading & Macro Alerts from X/Twitter — Account Monitors",
  description:
    "Get X/Twitter trading alerts when macro voices, flow accounts, or KOLs post. Keyword filters, signed webhooks, Make.com routing. From $19/mo — no $5,000/mo streaming tier.",
  path: "/use-cases/trading-alerts",
  keywords: [
    "twitter trading alerts",
    "stock market twitter monitor",
    "macro twitter webhook",
    "unusual whales alert",
    "x trading bot webhook",
  ],
});

const EXAMPLE_MONITORS = [
  {
    account: "unusual_whales",
    keywords: "flow, block, sweep",
    why: "Options flow and large prints — filter noise with keywords.",
  },
  {
    account: "elerianm",
    keywords: "fed, inflation, rate",
    why: "Macro commentary — only alert when Fed or inflation is mentioned.",
  },
  {
    account: "DeItaone",
    keywords: "",
    why: "Breaking market headlines — no filter, every post is signal.",
  },
];

const WORKFLOW = [
  {
    title: "Pick accounts you trust",
    text: "Macro analysts, flow scanners, or sector KOLs — any public @handle.",
  },
  {
    title: "Add keyword filters",
    text: "Comma-separated terms so you only get hits on $TSLA, CPI, or memecoin names.",
  },
  {
    title: "Route to your stack",
    text: "Signed webhooks → Make.com, n8n, your bot, or Slack — verify HMAC and act.",
  },
];

export default function TradingAlertsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 mb-6">
              <LineChart className="h-4 w-4" />
              Trading & macro alerts
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              X/Twitter Trading Alerts Without the $5,000/mo Stream
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              The official X API filtered stream starts at{" "}
              <strong className="text-zinc-200">$5,000/month</strong>. XFlux monitors the accounts
              you care about and pushes{" "}
              <strong className="text-zinc-200">signed webhooks</strong> when they post — with
              optional keyword filters for macro, flow, or ticker-specific alerts.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=trading_alerts">
                <Button size="lg">Start free — add your first monitor</Button>
              </Link>
              <Link href="/docs/guides/trading-keywords">
                <Button variant="outline" size="lg">Keyword templates</Button>
              </Link>
              <Link href="/signals/trading">
                <Button variant="outline" size="lg">Live market signals</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {[
              {
                icon: TrendingUp,
                title: "Account-level precision",
                text: "Watch @unusual_whales, macro voices, or memecoin KOLs — not the entire firehose.",
              },
              {
                icon: Bell,
                title: "Keyword filters",
                text: "Only alert on fed, CPI, $SPY, or specific tickers — comma-separated in Dashboard.",
              },
              {
                icon: Webhook,
                title: "Webhook delivery",
                text: "HMAC-signed JSON to your server or Make.com — 1s poll on Starter ($19/mo).",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-emerald-400 mb-2" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Example monitor setups</h2>
            <div className="space-y-4">
              {EXAMPLE_MONITORS.map((ex) => (
                <div
                  key={ex.account}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">@{ex.account}</p>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      Keywords: {ex.keywords || "(none — all tweets)"}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">{ex.why}</p>
                  </div>
                  <Link href="/docs/guides/trading-keywords" className="shrink-0">
                    <Button variant="outline" size="sm">
                      More templates
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-500 mt-4">
              Browse accounts posting now on our{" "}
              <Link href="/signals/trading" className="text-sky-400 hover:underline">
                live trading signal digest
              </Link>
              .
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
            <ol className="space-y-6">
              {WORKFLOW.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Webhook payload on hit</h2>
            <p className="text-zinc-400 text-sm mb-4">
              When a monitored account posts a matching tweet, XFlux POSTs JSON to your URL. Wire it
              into Make.com for Slack/Telegram alerts — see{" "}
              <Link href="/docs/integrations/make" className="text-sky-400 hover:underline">
                Make.com guide
              </Link>
              .
            </p>
            <CodeBlock>{`{
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
}`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Streaming API vs XFlux monitors</h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium" />
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                      Official filtered stream
                    </th>
                    <th className="px-4 py-3 text-left text-emerald-400 font-medium">
                      XFlux monitors
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Monthly cost", official: "$5,000+ (Pro tier)", xflux: "From $19/mo" },
                    { label: "Data scope", official: "Full firehose / rules", xflux: "Accounts you pick" },
                    { label: "Keyword filter", official: "Rule-based (complex)", xflux: "Per-monitor, Dashboard" },
                    { label: "Delivery", official: "Persistent stream", xflux: "Signed HTTP webhook" },
                    { label: "Setup time", official: "Enterprise approval", xflux: "Minutes, self-serve" },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-zinc-800 last:border-0">
                      <td className="px-4 py-3 text-zinc-300">{row.label}</td>
                      <td className="px-4 py-3 text-zinc-500">{row.official}</td>
                      <td className="px-4 py-3 text-zinc-200">{row.xflux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <Zap className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Ready to monitor market voices?</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              Free tier includes 1 monitor with Dashboard hit history. Upgrade to Starter for live
              webhook delivery and 1-second polling.
            </p>
            <Link href="/register?src=trading_alerts_cta">
              <Button size="lg">Create free account</Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
