import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";

export const metadata = pageMetadata({
  title: "Connect XFlux to Make.com — Twitter Account Webhooks",
  description:
    "Step-by-step guide: watch X/Twitter accounts in XFlux and push signed JSON webhooks to Make.com Custom Webhooks for Slack, Telegram, Sheets, and trading automations.",
  path: "/docs/integrations/make",
  keywords: [
    "twitter webhook make.com",
    "x monitor make automation",
    "twitter make integration",
    "xflux make webhook",
  ],
});

export default function MakeIntegrationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">
        Connect XFlux to Make.com
      </h1>
      <p className="text-zinc-400 mb-4 leading-relaxed">
        Use XFlux account monitors to watch public @handles on a schedule. When a new tweet matches
        your filters, XFlux POSTs signed JSON to your endpoint — no polling code on your side. This
        guide wires that into a <strong className="text-white">Make.com Custom Webhook</strong> so
        you can route alerts to Slack, Telegram, Google Sheets, or any API Make supports.
      </p>
      <p className="text-zinc-400 mb-6 text-sm">
        Works the same way with{" "}
        <a
          href="https://zapier.com"
          className="text-sky-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zapier
        </a>{" "}
        (Webhooks by Zapier) and{" "}
        <a
          href="https://n8n.io"
          className="text-sky-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          n8n
        </a>{" "}
        (Webhook node). Replace the Make steps with their webhook trigger.
      </p>

      <Callout title="Plan requirements">
        <p className="leading-relaxed">
          Free tier: configure a webhook URL and send <strong className="text-white">test pings</strong>.
          Live delivery on new monitor hits requires{" "}
          <Link href="/pricing" className="text-sky-400 hover:underline">
            Starter ($19/mo)
          </Link>{" "}
          or above (1s minimum poll interval, 3 monitors).
        </p>
      </Callout>

      <DocHeading id="overview">What you will build</DocHeading>
      <CodeBlock>{`@elonmusk posts a new tweet (optional keyword filter)
        ↓
XFlux monitor detects hit (1s–5min poll, plan-dependent)
        ↓
Signed HTTP POST → Make Custom Webhook URL
        ↓
Make scenario: filter → Slack / Telegram / Sheets / HTTP module`}</CodeBlock>

      <DocHeading id="make-webhook">1. Create a Make Custom Webhook</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed mb-4">
        <li>
          Log in to{" "}
          <a
            href="https://www.make.com"
            className="text-sky-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Make.com
          </a>{" "}
          and create a new <strong className="text-white">Scenario</strong>.
        </li>
        <li>
          Add the first module: <strong className="text-white">Webhooks → Custom webhook</strong>.
        </li>
        <li>
          Choose <strong className="text-white">Add</strong> to create a new webhook. Make shows a
          unique URL like{" "}
          <code className="text-zinc-300">https://hook.us2.make.com/xxxxxxxx</code>.
        </li>
        <li>Copy that URL — you will paste it into XFlux in the next step.</li>
        <li>
          Leave the scenario in <strong className="text-white">Instant</strong> or scheduling mode
          as you prefer; turn the scenario <strong className="text-white">ON</strong> before testing.
        </li>
      </ol>

      <DocHeading id="xflux-monitor">2. Add a monitor in XFlux</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed mb-4">
        <li>
          <Link href="/register?src=docs_make" className="text-sky-400 hover:underline">
            Create a free XFlux account
          </Link>{" "}
          if you do not have one.
        </li>
        <li>
          Dashboard → <strong className="text-white">Monitors</strong> → create a monitor for a
          public @username.
        </li>
        <li>
          Optional: add <strong className="text-white">keywords</strong> (comma-separated). A hit
          requires the tweet text to contain at least one keyword. Leave empty to alert on every new
          tweet from that account.
        </li>
        <li>
          Set <strong className="text-white">check interval</strong> (Starter+ supports 1s minimum).
        </li>
        <li>
          Expand the <strong className="text-white">Webhook</strong> section → paste your Make URL →
          Save.
        </li>
        <li>
          Copy the <strong className="text-white">signing secret</strong> shown once and store it
          securely (optional for Make, required if you add a verification step later).
        </li>
      </ol>

      <DocHeading id="test">3. Send a test webhook</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        In the monitor Webhook panel, click <strong className="text-white">Test webhook</strong>.
        Make should receive a POST with <code className="text-zinc-300">event: monitor.test</code>.
        In Make, open the webhook module execution history to confirm a <strong className="text-white">200</strong>{" "}
        response.
      </p>
      <CodeBlock>{`{
  "event": "monitor.test",
  "monitor": {
    "id": "clx...",
    "targetUsername": "elonmusk",
    "keywords": "launch, token"
  },
  "test": true
}`}</CodeBlock>

      <DocHeading id="live-hit">4. Live hits from Make</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        On Starter+, when a new tweet passes your keyword filter, XFlux POSTs:
      </p>
      <CodeBlock>{`{
  "event": "monitor.hit",
  "monitor": {
    "id": "clx...",
    "targetUsername": "blknoiz06",
    "keywords": "launch, CA, pump.fun"
  },
  "tweet": {
    "id": "1234567890",
    "text": "New token launch on Solana ...",
    "authorUsername": "blknoiz06",
    "createdAt": "2026-09-10T12:00:00.000Z"
  },
  "detectedAt": "2026-09-10T12:00:05.000Z"
}`}</CodeBlock>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        In Make, map fields from the webhook body into downstream modules — for example{" "}
        <code className="text-zinc-300">tweet.text</code>,{" "}
        <code className="text-zinc-300">tweet.authorUsername</code>,{" "}
        <code className="text-zinc-300">detectedAt</code>.
      </p>

      <DocHeading id="make-modules">5. Example Make follow-ups</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm leading-relaxed mb-4">
        <li>
          <strong className="text-white">Router</strong> — branch on{" "}
          <code className="text-zinc-300">event</code> (<code className="text-zinc-300">monitor.test</code> vs{" "}
          <code className="text-zinc-300">monitor.hit</code>) or keyword matches in{" "}
          <code className="text-zinc-300">tweet.text</code>
        </li>
        <li>
          <strong className="text-white">Telegram / Slack</strong> — send a formatted alert with tweet
          text and link{" "}
          <code className="text-zinc-300">{`https://x.com/{authorUsername}/status/{tweet.id}`}</code>
        </li>
        <li>
          <strong className="text-white">Google Sheets</strong> — append a row per hit for logging or
          manual review
        </li>
        <li>
          <strong className="text-white">HTTP</strong> — forward parsed fields to your trading bot or
          internal API
        </li>
      </ul>

      <DocHeading id="headers">Headers & verification</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Each delivery includes signed headers. Make ignores them by default; for custom verification
        middleware, see the full{" "}
        <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
          webhook reference
        </Link>
        .
      </p>
      <CodeBlock>{`Content-Type: application/json
X-XFlux-Event: monitor.hit
X-XFlux-Timestamp: 1710000000
X-XFlux-Signature: sha256=<hex>
User-Agent: XFlux-Webhook/1.0`}</CodeBlock>

      <DocHeading id="troubleshooting">Troubleshooting</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm leading-relaxed mb-8">
        <li>
          <strong className="text-white">Test returns 400 in Make</strong> — scenario may be off, or
          the webhook module expects a different structure. Re-run Test after turning the scenario ON.
        </li>
        <li>
          <strong className="text-white">Test works, no live hits</strong> — keywords may be too strict,
          or the account has not posted since the monitor baseline. Try clearing keywords temporarily
          or use Dashboard → Check now.
        </li>
        <li>
          <strong className="text-white">Free plan</strong> — live hit delivery requires Starter+. Test
          pings work on Free to validate the Make URL.
        </li>
      </ul>

      <div className="flex flex-wrap gap-3">
        <Link href="/register?src=docs_make">
          <Button>Start free</Button>
        </Link>
        <Link href="/docs/webhooks">
          <Button variant="outline">Webhook reference</Button>
        </Link>
        <Link href="/docs/monitors">
          <Button variant="ghost">Monitor docs</Button>
        </Link>
      </div>
    </>
  );
}
