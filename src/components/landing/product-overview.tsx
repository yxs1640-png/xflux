import Link from "next/link";
import { ArrowRight, Webhook } from "lucide-react";
import { LEGAL } from "@/lib/legal-config";
import { Button } from "@/components/ui/button";

export function ProductOverview() {
  return (
    <section className="py-24 bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Pull with REST — or get pushed when accounts post
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Use the read API in your app, bot, or data pipeline. Add monitors when you need alerts
            without writing polling infrastructure.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">REST API — on-demand reads</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Bearer token auth. Normalized JSON. 1,000 free calls per month.
            </p>
            <pre className="rounded-lg bg-zinc-900 border border-zinc-800 p-4 text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
{`# Profile lookup
curl ${LEGAL.website}/api/v1/users/elonmusk \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

# Search recent posts
curl "${LEGAL.website}/api/v1/search?q=from:elonmusk&limit=10" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

# User timeline
curl "${LEGAL.website}/api/v1/users/elonmusk/tweets?limit=10" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`}
            </pre>
            <Link href="/docs/quickstart" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 mt-4">
              Quickstart guide <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Webhook className="h-5 w-5 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">Monitors — webhook on new tweets</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              Watch @accounts in the Dashboard. Starter plans POST signed JSON to your HTTPS URL when
              a new tweet is detected — no polling code on your side.
            </p>
            <pre className="rounded-lg bg-zinc-900 border border-zinc-800 p-4 text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
{`POST https://your-app.com/webhooks/xflux
X-XFlux-Event: monitor.hit
X-XFlux-Signature: sha256=...

{
  "event": "monitor.hit",
  "monitor": { "targetUsername": "elonmusk" },
  "tweet": { "id": "...", "text": "..." }
}`}
            </pre>
            <Link href="/twitter-webhook" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 mt-4">
              Twitter webhook integration <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950/80 p-6">
          <h3 className="text-base font-semibold text-white mb-4 text-center">
            Typical workflow
          </h3>
          <ol className="grid gap-4 sm:grid-cols-3 text-sm">
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <span className="text-sky-400 font-medium">① Register</span>
              <p className="mt-2 text-zinc-400">
                Create a free account and copy your API key from the Dashboard — under 60 seconds.
              </p>
            </li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <span className="text-sky-400 font-medium">② Integrate</span>
              <p className="mt-2 text-zinc-400">
                Call REST for profiles, search, and timelines — or add a monitor for accounts you
                want to watch continuously.
              </p>
            </li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <span className="text-sky-400 font-medium">③ Automate</span>
              <p className="mt-2 text-zinc-400">
                On paid plans, route monitor hits to your webhook for Slack alerts, trading bots,
                or AI summarization pipelines.
              </p>
            </li>
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/register?src=homepage_overview">
            <Button size="lg">Get your API key — free</Button>
          </Link>
          <Link href="/docs/api">
            <Button variant="outline" size="lg">See all endpoints</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
