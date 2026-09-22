import Link from "next/link";
import { Bell, Coins, Radar, Webhook, Zap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Crypto & Memecoin Alerts from X/Twitter — Monitors & Webhooks",
  description:
    "Monitor crypto and memecoin KOLs on X/Twitter with keyword filters and signed webhooks. From $19/mo — pair with Smart Money and live crypto signals.",
  path: "/use-cases/crypto-alerts",
  keywords: [
    "memecoin twitter alerts",
    "crypto twitter webhook",
    "solana kol monitor",
    "bitcoin twitter api",
    "crypto trading twitter bot",
  ],
});

const EXAMPLE_MONITORS = [
  {
    account: "blknoiz06",
    keywords: "memecoin, sol, pump",
    why: "High-signal trading chatter — filter to coin-related posts.",
  },
  {
    account: "WatcherGuru",
    keywords: "bitcoin, ETF, SEC",
    why: "Breaking crypto headlines — keyword filter cuts noise.",
  },
  {
    account: "CryptoCred",
    keywords: "",
    why: "Education and market takes — alert on every new post if you want full coverage.",
  },
];

const WORKFLOW = [
  {
    title: "Pick KOLs and news accounts",
    text: "Traders, launch accounts, or headline bots — any public @handle.",
  },
  {
    title: "Add token keywords",
    text: "Comma-separated filters (ticker, chain, meme name) so you only get relevant hits.",
  },
  {
    title: "Webhook to your stack",
    text: "HMAC-signed JSON → Telegram bot, Discord, Make.com, or your alert worker.",
  },
];

export default function CryptoAlertsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-400 mb-6">
              <Coins className="h-4 w-4" />
              Crypto &amp; memecoin alerts
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              Crypto KOL Alerts Without Building a Scraper
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Watch public crypto accounts on a schedule. Filter by token keywords and get{" "}
              <strong className="text-zinc-200">signed webhooks</strong> when they post — from{" "}
              <strong className="text-zinc-200">$19/mo</strong> on Starter.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=crypto_alerts">
                <Button size="lg">Start free — add a monitor</Button>
              </Link>
              <Link href="/docs/guides/trading-keywords">
                <Button variant="outline" size="lg">Keyword templates</Button>
              </Link>
              <Link href="/predictors">
                <Button variant="outline" size="lg">Smart Money</Button>
              </Link>
              <Link href="/signals/crypto">
                <Button variant="outline" size="lg">Live crypto signals</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {[
              {
                icon: Radar,
                title: "Account monitors",
                text: "Poll KOLs and news accounts — Dashboard hit history on every plan.",
              },
              {
                icon: Bell,
                title: "Keyword filters",
                text: "Only alert on tickers, chains, or meme names you care about.",
              },
              {
                icon: Webhook,
                title: "Live webhooks",
                text: "HMAC-signed POSTs on Starter+ — verify before you trade on a signal.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-amber-400 mb-2" />
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
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
                >
                  <p className="font-medium text-white">@{ex.account}</p>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    Keywords: {ex.keywords || "(none — all tweets)"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">{ex.why}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-500 mt-4">
              See live posts on{" "}
              <Link href="/signals/crypto" className="text-sky-400 hover:underline">
                crypto signals
              </Link>{" "}
              or{" "}
              <Link href="/signals/memecoins" className="text-sky-400 hover:underline">
                memecoins
              </Link>
              .
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
            <ol className="space-y-6">
              {WORKFLOW.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-400">
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
            <CodeBlock>{`{
  "event": "monitor.hit",
  "monitor": {
    "targetUsername": "blknoiz06",
    "keywords": "memecoin, sol"
  },
  "tweet": {
    "id": "1234567890",
    "text": "New SOL pair looking interesting...",
    "authorUsername": "blknoiz06"
  },
  "detectedAt": "2026-09-22T12:00:05.000Z"
}`}</CodeBlock>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <Zap className="h-8 w-8 text-amber-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Ready for crypto KOL alerts?</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              Free tier includes 1 monitor with Dashboard history. Upgrade to Starter for live
              webhook delivery and faster polling.
            </p>
            <Link href="/register?src=crypto_alerts_cta">
              <Button size="lg">Create free account</Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
