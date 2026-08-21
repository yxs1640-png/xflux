import Link from "next/link";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LEGAL } from "@/lib/legal-config";
import { Bell, Database, Play, Radar, Search, User, Webhook } from "lucide-react";

const EXAMPLE_REQUEST = `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  ${LEGAL.website}/api/v1/users/elonmusk`;

const EXAMPLE_RESPONSE = `{
  "id": "44196397",
  "username": "elonmusk",
  "name": "Elon Musk",
  "description": "...",
  "followers_count": 220000000,
  "verified": true
}`;

const CAPABILITIES = [
  {
    icon: User,
    title: "User profiles",
    description: "Look up any public @handle — bio, followers, verification.",
    endpoint: "GET /api/v1/users/:username",
  },
  {
    icon: Search,
    title: "Search",
    description: "Keyword, hashtag, or from:username queries.",
    endpoint: "GET /api/v1/search?q=",
  },
  {
    icon: Database,
    title: "Timelines",
    description: "Latest tweets from a public account.",
    endpoint: "GET /api/v1/users/:username/tweets",
  },
  {
    icon: Radar,
    title: "Monitors",
    description: "Background polling — detect new posts automatically.",
    endpoint: "Dashboard → Monitors",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Signed HTTP POST when a monitor finds a new tweet (Starter+).",
    endpoint: "POST your-endpoint",
  },
  {
    icon: Bell,
    title: "Alerts without cron",
    description: "Skip building scrapers, proxies, and polling jobs yourself.",
    endpoint: "Free: 1 monitor",
  },
];

export default function DocsIntroPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">XFlux Documentation</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          XFlux gives you programmatic access to <strong className="text-white font-medium">public X (Twitter) data</strong>{" "}
          through a REST API, plus optional <strong className="text-white font-medium">account monitors</strong> that
          watch @handles and surface new tweets — with signed webhooks on paid plans.
        </p>
      </div>

      <Callout title="Try before you sign up">
        <p className="leading-relaxed mb-3">
          The homepage has a live API playground — run profile, search, and timeline demos with no API key.
        </p>
        <Link href="/#demo">
          <Button size="sm" variant="outline">
            <Play className="h-4 w-4" />
            Open live demo
          </Button>
        </Link>
      </Callout>

      <DocHeading id="example">Example API call</DocHeading>
      <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
        After signup you get a Bearer token. One request returns normalized JSON — no HTML parsing,
        no unofficial scraping code on your side.
      </p>
      <p className="text-xs text-zinc-500 mb-2 font-medium">Request</p>
      <CodeBlock>{EXAMPLE_REQUEST}</CodeBlock>
      <p className="text-xs text-zinc-500 mb-2 mt-4 font-medium">Response (truncated)</p>
      <CodeBlock>{EXAMPLE_RESPONSE}</CodeBlock>

      <DocHeading id="capabilities">What you can build</DocHeading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {CAPABILITIES.map((cap) => (
          <div
            key={cap.title}
            className="rounded-xl border border-zinc-800 p-4 hover:border-sky-500/30 transition-colors"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10">
              <cap.icon className="h-4 w-4 text-sky-400" />
            </div>
            <h3 className="font-semibold text-white text-sm">{cap.title}</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{cap.description}</p>
            <Badge variant="sky" className="mt-3 font-mono text-[10px]">
              {cap.endpoint}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        <Link
          href="/docs/api"
          className="rounded-xl border border-zinc-800 p-5 hover:border-sky-500/40 transition-colors group"
        >
          <Database className="h-5 w-5 text-sky-400 mb-3" />
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
        <li>Official X API Basic is $100+/mo with approval — XFlux starts free (1,000 calls/mo)</li>
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
