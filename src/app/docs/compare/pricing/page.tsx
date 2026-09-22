import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, DocHeading } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/constants";

export const metadata = pageMetadata({
  title: "XFlux vs Official X API Pricing",
  description:
    "Compare XFlux monthly plans to the official X API: access friction, read costs, account monitors, webhooks, and filtered streaming. When to use which.",
  path: "/docs/compare/pricing",
  keywords: [
    "x api pricing alternative",
    "twitter api cost comparison",
    "xflux vs twitter api",
    "cheap twitter api",
  ],
});

const starter = PLANS.find((p) => p.id === "BASIC")!;
const free = PLANS.find((p) => p.id === "FREE")!;

export default function PricingComparePage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Pricing vs official X API</h1>
      <p className="text-zinc-400 mb-6 leading-relaxed">
        XFlux is a <strong className="text-white">read-focused</strong> developer API with built-in
        account monitors. The official X API is the right choice when you need write access,
        user-delegated OAuth, or enterprise firehose — but many teams only need public reads and
        alerts.
      </p>

      <Callout variant="warning" title="Official prices change">
        Official X API packaging and rates change over time. Treat the official column as a
        directional comparison and verify current numbers on{" "}
        <a
          href="https://docs.x.com/x-api/getting-started/pricing"
          className="text-sky-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          docs.x.com
        </a>
        .
      </Callout>

      <DocHeading id="side-by-side">Side-by-side</DocHeading>
      <div className="overflow-x-auto rounded-lg border border-zinc-800 mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-500">
              <th className="p-3 font-medium" />
              <th className="p-3 font-medium">Official X API</th>
              <th className="p-3 font-medium text-sky-400">XFlux</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            {[
              {
                label: "Access",
                official: "Developer portal + app setup; tiers vary",
                xflux: "Instant signup — API key in under a minute",
              },
              {
                label: "Pricing model",
                official: "Pay-per-use and/or high monthly tiers",
                xflux: "Flat monthly plans (API quota + monitors)",
              },
              {
                label: "Starter cost (approx.)",
                official: "Historically $100+/mo Basic; PPU ~$0.005/read resource",
                xflux: `Free: ${free.quota} calls + ${free.monitors} monitor. Starter: $${starter.price}/mo (${starter.quota} calls, ${starter.monitors} monitors)`,
              },
              {
                label: "Profiles / timelines / search",
                official: "Yes",
                xflux: "Yes — REST + MCP",
              },
              {
                label: "Account monitors + webhooks",
                official: "DIY polling, or expensive streaming products",
                xflux: "Built-in monitors; live webhooks on Starter+",
              },
              {
                label: "Filtered / realtime stream",
                official: "Pro filtered stream often cited ~$5,000/mo",
                xflux: "Account-level monitors as a practical alternative",
              },
              {
                label: "Post / like / DM (write)",
                official: "Yes (with credentials)",
                xflux: "No — read & monitor focus",
              },
              {
                label: "MCP for AI agents",
                official: "Community wrappers using your X keys",
                xflux: "Official Registry package @xflux/xflux-mcp-server",
              },
            ].map((row) => (
              <tr key={row.label} className="border-b border-zinc-800/50 align-top">
                <td className="p-3 text-zinc-400 whitespace-nowrap">{row.label}</td>
                <td className="p-3 text-zinc-500">{row.official}</td>
                <td className="p-3">{row.xflux}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocHeading id="vs-proxies">Vs other third-party read APIs</DocHeading>
      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
        Many third-party proxies also sell cheaper public reads. XFlux differentiates with{" "}
        <strong className="text-white">scheduled account monitors</strong>,{" "}
        <strong className="text-white">signed webhooks</strong>, live Signals digests, and an{" "}
        <Link href="/docs/integrations/mcp" className="text-sky-400 hover:underline">
          MCP server
        </Link>{" "}
        aimed at research and alerting — not just raw lookup endpoints.
      </p>

      <DocHeading id="when-official">When to use the official X API</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm mb-8">
        <li>You need to post, reply, DM, or manage follows as a user</li>
        <li>You need full-archive search, compliance streams, or enterprise firehose</li>
        <li>You require official partnership / regulated vendor status</li>
      </ul>

      <DocHeading id="when-xflux">When XFlux fits</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm mb-8">
        <li>Public profile, timeline, and search reads for a product or agent</li>
        <li>KOL / trading / crypto alerts without a $5k streaming tier</li>
        <li>Self-serve pricing from free → Scale without a sales process</li>
      </ul>

      <div className="flex flex-wrap gap-3">
        <Link href="/pricing">
          <Button>See XFlux plans</Button>
        </Link>
        <Link href="/docs/limits">
          <Button variant="outline">Plans &amp; limits</Button>
        </Link>
        <Link href="/register?src=compare_pricing">
          <Button variant="ghost">Start free</Button>
        </Link>
      </div>
    </>
  );
}
