import Link from "next/link";
import { Callout, DocHeading } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Radar, Webhook, Zap } from "lucide-react";

export default function DocsIntroPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">XFlux Documentation</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          XFlux is a focused X/Twitter platform with two core products: a{" "}
          <strong className="text-white font-medium">Data API</strong> for on-demand requests, and{" "}
          <strong className="text-white font-medium">Monitors</strong> that watch accounts and
          deliver new tweets to your Dashboard. Paid plans can also POST signed webhooks to your URL.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        <Link
          href="/docs/api"
          className="rounded-xl border border-zinc-800 p-5 hover:border-sky-500/40 transition-colors group"
        >
          <Zap className="h-5 w-5 text-sky-400 mb-3" />
          <h2 className="font-semibold text-white group-hover:text-sky-400">XFlux API</h2>
          <p className="text-sm text-zinc-500 mt-1">
            REST endpoints for users, tweets, and search. Bearer key auth, monthly quota by plan.
          </p>
        </Link>
        <Link
          href="/docs/monitors"
          className="rounded-xl border border-zinc-800 p-5 hover:border-sky-500/40 transition-colors group"
        >
          <Radar className="h-5 w-5 text-sky-400 mb-3" />
          <h2 className="font-semibold text-white group-hover:text-sky-400">XFlux Monitor</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Poll @accounts on a schedule, detect new tweets, optional keyword filter + webhooks.
          </p>
        </Link>
      </div>

      <DocHeading id="why-xflux">Why XFlux?</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm leading-relaxed">
        <li>Monthly plans for read API access and built-in account monitors</li>
        <li>Built-in KOL monitoring — no cron jobs or polling code required</li>
        <li>Dashboard for API keys, usage, monitors, and billing</li>
        <li>Webhook delivery with HMAC signatures (Starter plan and above)</li>
      </ul>

      <DocHeading id="how-it-works">How it works</DocHeading>
      <Callout title="Two products, one platform">
        <p className="leading-relaxed">
          Call <code className="text-sky-400">/api/v1/*</code> with your API key for on-demand data.
          Monitors watch accounts on a schedule and surface new tweets in your Dashboard. On paid
          plans, you can also receive signed webhook POSTs when a monitor detects a new tweet.
        </p>
      </Callout>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/docs/quickstart">
          <Button>Quickstart</Button>
        </Link>
        <Link href="/docs/webhooks">
          <Button variant="outline">
            <Webhook className="h-4 w-4" />
            Webhook guide
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="ghost">Get API Key</Button>
        </Link>
      </div>
    </>
  );
}
