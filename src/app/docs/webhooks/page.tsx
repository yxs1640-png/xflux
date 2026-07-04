import { CodeBlock, Callout, DocHeading } from "@/components/docs/doc-blocks";

export default function WebhooksDocsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Webhooks</h1>
      <p className="text-zinc-400 mb-8">
        Receive signed HTTP POST requests when a monitor detects a new tweet. Available on Basic
        plan and above.
      </p>

      <DocHeading id="setup">Setup</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed">
        <li>Upgrade to Basic or higher</li>
        <li>Dashboard → Monitors → expand Webhook section on a monitor</li>
        <li>Enter your HTTPS endpoint URL and save</li>
        <li>Copy the signing secret shown once — store it securely</li>
        <li>Click <strong className="text-white">Test webhook</strong> to verify connectivity</li>
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
        using your webhook secret. Reject requests older than 5 minutes.
      </p>
      <CodeBlock>{`import crypto from "crypto";

function verify(secret, timestamp, rawBody, signatureHeader) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(\`\${timestamp}.\${rawBody}\`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader)
  );
}

// Express example
app.post("/webhooks/xflux", express.raw({ type: "application/json" }), (req, res) => {
  const timestamp = req.headers["x-xflux-timestamp"];
  const signature = req.headers["x-xflux-signature"];
  const rawBody = req.body.toString("utf8");

  if (!verify(WEBHOOK_SECRET, timestamp, rawBody, signature)) {
    return res.status(401).send("Invalid signature");
  }

  const event = JSON.parse(rawBody);
  // handle monitor.hit ...
  res.status(200).send("ok");
});`}</CodeBlock>

      <DocHeading id="retries">Retries & logs</DocHeading>
      <p className="text-zinc-400 text-sm leading-relaxed">
        Each delivery attempt is logged in Dashboard (status code, latency, error message). Failed
        deliveries are not automatically retried in the current version — use Test webhook after
        fixing your endpoint.
      </p>

      <Callout variant="warning" title="Security">
        Always verify <code className="text-zinc-300">X-XFlux-Signature</code> before processing.
        Use HTTPS endpoints only. Rotate the secret from the Dashboard if compromised.
      </Callout>
    </>
  );
}
