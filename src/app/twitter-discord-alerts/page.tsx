import Link from "next/link";
import { MessageSquare, Webhook, Zap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Twitter → Discord Alerts via Webhooks",
  description:
    "Send X/Twitter account alerts to Discord with XFlux monitors: Make.com Custom Webhook → Discord, or your bot verifying HMAC-signed webhooks. From $19/mo.",
  path: "/twitter-discord-alerts",
  keywords: [
    "twitter discord alerts",
    "x discord webhook",
    "twitter to discord bot",
    "make.com discord twitter",
    "xflux discord",
  ],
});

const FAQS = [
  {
    question: "Does XFlux ship a first-party Discord bot?",
    answer:
      "No. Use Make.com’s Discord modules with a Custom Webhook, or point XFlux signed webhooks at your own Discord bot.",
  },
  {
    question: "Which plan do I need for live Discord alerts?",
    answer:
      "Starter ($19/mo) or higher for live monitor.hit delivery. Free can configure URLs and send test pings.",
  },
  {
    question: "How do I verify webhooks in my bot?",
    answer:
      "HMAC-SHA256 over `{timestamp}.{raw_body}` using the Dashboard signing secret. See /docs/webhooks.",
  },
];

const STEPS = [
  {
    title: "Create an XFlux monitor",
    text: "Dashboard → Monitors → add @username and optional keywords.",
  },
  {
    title: "Choose a Discord path",
    text: "Make.com Custom Webhook → Discord channel, or your bot’s HTTPS endpoint.",
  },
  {
    title: "Paste the webhook URL",
    text: "Save on the monitor, copy the signing secret, click Test webhook.",
  },
];

export default function TwitterDiscordAlertsPage() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300 mb-6">
              <MessageSquare className="h-4 w-4" />
              Discord alerts
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              Twitter → Discord without a $5k stream
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Watch public X accounts with XFlux monitors, then route{" "}
              <strong className="text-zinc-200">signed webhooks</strong> into Discord via Make.com
              or your own bot. Flat plans from Free / $19 — not pay-per-tweet.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=discord_alerts">
                <Button size="lg">Start free</Button>
              </Link>
              <Link href="/docs/integrations/make">
                <Button variant="outline" size="lg">
                  Make.com guide
                </Button>
              </Link>
              <Link href="/twitter-webhook">
                <Button variant="outline" size="lg">
                  Webhook overview
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {[
              {
                icon: Webhook,
                title: "Make.com path",
                text: "Custom Webhook trigger → Discord module. No bot code required.",
              },
              {
                icon: MessageSquare,
                title: "Your Discord bot",
                text: "POST to your HTTPS endpoint, verify HMAC, then channel.send.",
              },
              {
                icon: Zap,
                title: "Same monitors",
                text: "Keyword filters, 1s poll on Starter+, Dashboard hit history.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-indigo-400 mb-2" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
            <ol className="space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
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
            <h2 className="text-2xl font-bold text-white mb-4">Option A — Make.com</h2>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              Create a Make scenario with a <strong className="text-white">Custom Webhook</strong>{" "}
              trigger, map tweet text / username into a Discord “Send a Message” module, then paste
              the Make URL into XFlux. Full walkthrough:{" "}
              <Link href="/docs/integrations/make" className="text-sky-400 hover:underline">
                Connect XFlux to Make.com
              </Link>
              .
            </p>
            <CodeBlock>{`@handle posts (optional keyword match)
        ↓
XFlux monitor.hit (signed POST)
        ↓
Make.com Custom Webhook
        ↓
Discord channel message`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Option B — Your bot</h2>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              Expose an HTTPS route, verify{" "}
              <code className="text-zinc-300">X-XFlux-Signature</code>, then post to Discord with
              your bot token. Signature details:{" "}
              <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
                Webhook docs
              </Link>
              . Product overview:{" "}
              <Link href="/twitter-webhook" className="text-sky-400 hover:underline">
                /twitter-webhook
              </Link>
              .
            </p>
            <CodeBlock>{`// Pseudocode
app.post("/webhooks/xflux", rawBodyMiddleware, (req, res) => {
  if (!verifyHmac(secret, timestamp, rawBody, signature)) {
    return res.status(401).end();
  }
  const event = JSON.parse(rawBody);
  if (event.event === "monitor.hit") {
    discord.channels.send(\`@\${event.tweet.authorUsername}: \${event.tweet.text}\`);
  }
  res.status(200).send("ok");
});`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>
            <dl className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-white mb-2">{faq.question}</dt>
                  <dd className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Route alerts to Discord</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              Free for monitor history. Starter from $19/mo for live signed delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?src=discord_alerts_cta">
                <Button size="lg">Create free account</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  Pricing
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" size="lg">
                  Compare alternatives
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
