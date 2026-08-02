import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  -H "Authorization: Bearer xflux_YOUR_KEY"`}
            </pre>
            <Link href="/docs/quickstart" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 mt-4">
              Quickstart guide <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Monitors — webhook on new tweets</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Watch @accounts in the Dashboard. Starter plans POST signed JSON to your HTTPS URL.
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
