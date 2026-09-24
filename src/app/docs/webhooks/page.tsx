import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { CodeBlock, Callout, DocHeading } from "@/components/docs/doc-blocks";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";

export const metadata = pageMetadata({
  title: "Webhook API Reference — Events, Signatures & Verification",
  description:
    "XFlux webhook API docs: monitor.hit and monitor.test events, HMAC-SHA256 signature verification, retries, idempotency, JSON payload format, and HTTPS endpoint setup.",
  path: "/docs/webhooks",
  keywords: [
    "twitter webhook api",
    "xflux webhook signature",
    "hmac sha256 twitter monitor",
    "account monitor webhook",
  ],
});

const WEBHOOK_FAQS = [
  {
    question: "Which plans include live webhooks?",
    answer:
      "Starter ($19/mo) and above deliver live monitor.hit events. Free can save a URL and send test pings only.",
  },
  {
    question: "How do I verify X-XFlux-Signature?",
    answer:
      "Compute HMAC-SHA256 over `{timestamp}.{raw_body}` with your webhook secret and compare to the X-XFlux-Signature header using a timing-safe equality check. Reject timestamps older than five minutes.",
  },
  {
    question: "Are failed deliveries retried automatically?",
    answer:
      "Failed deliveries are logged in the Dashboard with status and latency. Automatic retries are not guaranteed in the current version — fix your endpoint and use Test webhook, or poll Dashboard hit history as a fallback.",
  },
  {
    question: "How do I route webhooks to Discord?",
    answer:
      "Point the monitor webhook at a Make.com Custom Webhook (or your bot), then post to Discord. See the Discord alerts landing and Make.com integration guide.",
  },
];

export default function WebhooksDocsPage() {
  return (
    <>
      <FaqJsonLd items={WEBHOOK_FAQS} />
      <h1 className="text-4xl font-bold text-white mb-4">Twitter Webhook Integration</h1>
      <p className="text-zinc-400 mb-4">
        Receive signed HTTP POST requests when a monitor detects a new tweet. Available on Starter
        plan and above. For a product overview, see{" "}
        <Link href="/twitter-webhook" className="text-sky-400 hover:underline">
          Twitter webhook integration
        </Link>
        . Discord routing:{" "}
        <Link href="/twitter-discord-alerts" className="text-sky-400 hover:underline">
          Discord alerts
        </Link>
        . Make.com setup:{" "}
        <Link href="/docs/integrations/make" className="text-sky-400 hover:underline">
          Connect XFlux to Make
        </Link>
        .
      </p>

      <DocHeading id="setup">Setup</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed">
        <li>Upgrade to Starter or higher</li>
        <li>Dashboard → Monitors → expand Webhook section on a monitor</li>
        <li>Enter your HTTPS endpoint URL and save</li>
        <li>Copy the signing secret shown once — store it securely</li>
        <li>
          Click <strong className="text-white">Test webhook</strong> to verify connectivity
        </li>
      </ol>

      <DocHeading id="delivery">Delivery</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        When a new hit is recorded, XFlux POSTs JSON to your URL with these headers:
      </p>
      <CodeBlock>{`Content-Type: application/json
X-XFlux-Event: monitor.hit
X-XFlux-Timestamp: 1710000000
X-XFlux-Signature: sha256=<hex>
User-Agent: XFlux-Webhook/1.0`}</CodeBlock>

      <DocHeading id="payload-hit">Hit payload</DocHeading>
      <CodeBlock>{`{
  "event": "monitor.hit",
  "monitor": {
    "id": "clx...",
    "targetUsername": "elonmusk",
    "keywords": null
  },
  "tweet": {
    "id": "1234567890",
    "text": "Hello world",
    "authorUsername": "elonmusk",
    "createdAt": "2026-06-14T12:00:00.000Z"
  },
  "detectedAt": "2026-06-14T12:00:05.000Z"
}`}</CodeBlock>

      <DocHeading id="payload-test">Test payload</DocHeading>
      <CodeBlock>{`{
  "event": "monitor.test",
  "monitor": {
    "id": "clx...",
    "targetUsername": "elonmusk",
    "keywords": null
  },
  "test": true
}`}</CodeBlock>

      <DocHeading id="verify">Verify signatures</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Compute HMAC-SHA256 over <code className="text-zinc-300">{`{timestamp}.{raw_body}`}</code>{" "}
        using your webhook secret. Reject requests older than 5 minutes. Always verify against the{" "}
        <strong className="text-white">raw request body</strong> before <code className="text-zinc-300">JSON.parse</code>.
      </p>
      <CodeBlock>{`import crypto from "crypto";

function verify(secret, timestamp, rawBody, signatureHeader) {
  const ageSec = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSec) || ageSec > 300) return false;

  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(\`\${timestamp}.\${rawBody}\`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signatureHeader)
    );
  } catch {
    return false;
  }
}

// Express example — must use raw body
app.post("/webhooks/xflux", express.raw({ type: "application/json" }), (req, res) => {
  const timestamp = req.headers["x-xflux-timestamp"];
  const signature = req.headers["x-xflux-signature"];
  const rawBody = req.body.toString("utf8");

  if (!verify(WEBHOOK_SECRET, timestamp, rawBody, signature)) {
    return res.status(401).send("Invalid signature");
  }

  const event = JSON.parse(rawBody);
  // Deduplicate on tweet.id + monitor.id if you may see replays
  res.status(200).send("ok");
});`}</CodeBlock>

      <DocHeading id="idempotency">Idempotency</DocHeading>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
        Treat <code className="text-zinc-300">tweet.id</code> +{" "}
        <code className="text-zinc-300">monitor.id</code> as a unique key. Store processed keys for
        at least 24 hours so accidental duplicate POSTs do not double-fire alerts or trades.
      </p>

      <DocHeading id="retries">Retries &amp; logs</DocHeading>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
        Each delivery attempt is logged in Dashboard (status code, latency, error message). Failed
        deliveries are not automatically retried in the current version — fix your endpoint, then use{" "}
        <strong className="text-white">Test webhook</strong>, or read hits from the Dashboard /{" "}
        <code className="text-zinc-300">GET /api/v1/monitors/:id/hits</code> as a fallback.
      </p>

      <DocHeading id="event-types">Event types</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm mb-4">
        <li>
          <code className="text-zinc-300">monitor.hit</code> — new tweet matched the monitor
          (optional keyword filter applied)
        </li>
        <li>
          <code className="text-zinc-300">monitor.test</code> — manual ping from Dashboard
        </li>
      </ul>

      <Callout variant="warning" title="Security">
        Always verify <code className="text-zinc-300">X-XFlux-Signature</code> before processing.
        Use HTTPS endpoints only. Rotate the secret from the Dashboard if compromised.
      </Callout>

      <DocHeading id="faq">FAQ</DocHeading>
      <div className="space-y-6 mt-4">
        {WEBHOOK_FAQS.map((item) => (
          <div key={item.question}>
            <h3 className="text-white font-semibold text-sm mb-1">{item.question}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </>
  );
}
