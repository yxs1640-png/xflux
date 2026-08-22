import Link from "next/link";
import { Bell, Check, Shield, Webhook, Zap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Twitter Webhook Integration — X/Twitter Account Monitors",
  description:
    "Twitter webhook integration for X/Twitter account monitors. Receive signed HTTP POST alerts when tracked accounts publish new tweets. HMAC-SHA256 verified. Starter plan from $19/mo.",
  path: "/twitter-webhook",
});

const STEPS = [
  {
    title: "Add a monitor",
    description: "Pick any public @username in the XFlux Dashboard. Optional keyword filters included.",
  },
  {
    title: "Set your webhook URL",
    description: "Paste an HTTPS endpoint. Copy the signing secret once — we POST on every new hit.",
  },
  {
    title: "Handle events",
    description: "Verify X-XFlux-Signature, parse JSON, trigger alerts, trading bots, or workflows.",
  },
];

const COMPARE = [
  { label: "Background polling", diy: "You build & host cron", xflux: "Included" },
  { label: "Twitter webhook delivery", diy: "Not available from X API", xflux: "Signed HTTP POST" },
  { label: "Signature verification", diy: "Roll your own", xflux: "HMAC-SHA256 built-in" },
  { label: "Time to first alert", diy: "Days of engineering", xflux: "Minutes" },
];

export default function TwitterWebhookPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-400 mb-6">
              <Webhook className="h-4 w-4" />
              Twitter webhook integration
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              Twitter Webhook Integration for Account Monitors
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              X does not ship a public webhook for new tweets. XFlux monitors accounts on a schedule
              and delivers <strong className="text-zinc-200">signed HTTP webhooks</strong> to your
              server when new posts appear — no polling code required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=twitter_webhook_landing">
                <Button size="lg">Start free — set up in minutes</Button>
              </Link>
              <Link href="/docs/webhooks">
                <Button variant="outline" size="lg">Webhook docs</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {[
              { icon: Bell, title: "Real-time alerts", text: "Webhook fires within your plan poll interval." },
              { icon: Shield, title: "Signed payloads", text: "Verify HMAC-SHA256 before trusting any event." },
              { icon: Zap, title: "No official API tier", text: "Skip expensive X API tiers for read + notify use cases." },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-sky-400 mb-2" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How the integration works</h2>
            <ol className="space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-400">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Example webhook payload</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Each <code className="text-zinc-300">monitor.hit</code> event includes tweet text, author,
              and monitor metadata. See{" "}
              <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
                full webhook documentation
              </Link>{" "}
              for headers and signature verification.
            </p>
            <CodeBlock>{`POST https://your-server.com/webhooks/xflux
Content-Type: application/json
X-XFlux-Event: monitor.hit
X-XFlux-Signature: sha256=...

{
  "event": "monitor.hit",
  "monitor": { "targetUsername": "elonmusk" },
  "tweet": {
    "id": "1234567890",
    "text": "Hello world",
    "authorUsername": "elonmusk"
  },
  "detectedAt": "2026-07-31T12:00:05.000Z"
}`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Build it yourself vs XFlux</h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium" />
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">DIY polling</th>
                    <th className="px-4 py-3 text-left text-sky-400 font-medium">XFlux webhooks</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-800 last:border-0">
                      <td className="px-4 py-3 text-zinc-300">{row.label}</td>
                      <td className="px-4 py-3 text-zinc-500">{row.diy}</td>
                      <td className="px-4 py-3 text-zinc-200">{row.xflux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Pricing</h2>
            <Card className="border-sky-500/20">
              <CardHeader>
                <CardTitle>Signed webhooks on Starter and above</CardTitle>
                <CardDescription>
                  Free tier includes 1 monitor with Dashboard hit history. HTTP webhooks start on
                  Starter ($19/mo) with 3 monitors and 1s minimum poll interval.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Link href="/pricing">
                  <Button>View all plans</Button>
                </Link>
                <Link href="/docs/monitors">
                  <Button variant="outline">Monitor docs</Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Ready to integrate Twitter webhooks?</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              Create a free account, add a monitor, and upgrade to Starter when you need webhook
              delivery to your backend.
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-400 mb-6">
              {["1,000 free API calls/mo", "No credit card", "Docs + test webhook"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-sky-400" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register?src=twitter_webhook_landing">
              <Button size="lg">Create free account</Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
