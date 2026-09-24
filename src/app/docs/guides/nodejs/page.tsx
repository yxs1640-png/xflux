import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";
import { DOC_BASE_URL } from "@/lib/docs-nav";

export const metadata = pageMetadata({
  title: "Node.js Guide — XFlux X/Twitter API",
  description:
    "Call the XFlux read API from Node.js with fetch: profiles, timelines, search, and Bearer auth against www.xfluxapi.com/api/v1.",
  path: "/docs/guides/nodejs",
  keywords: [
    "twitter api nodejs",
    "x api node example",
    "xflux nodejs",
    "twitter search javascript",
  ],
});

export default function NodejsGuidePage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Node.js guide</h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        Node 18+ includes global <code className="text-zinc-300">fetch</code>. Base URL:{" "}
        <code className="text-zinc-300">{DOC_BASE_URL}</code>. Pass{" "}
        <code className="text-zinc-300">Authorization: Bearer xflux_…</code>.
      </p>

      <DocHeading id="setup">Setup</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed mb-4">
        <li>
          <Link href="/register" className="text-sky-400 hover:underline">
            Register
          </Link>{" "}
          and copy your API key
        </li>
        <li>
          Export <code className="text-zinc-300">XFLUX_API_KEY</code>
        </li>
      </ol>
      <CodeBlock>{`export XFLUX_API_KEY=xflux_YOUR_KEY`}</CodeBlock>

      <DocHeading id="helper">Shared headers</DocHeading>
      <CodeBlock>{`const BASE = "${DOC_BASE_URL}";
const headers = {
  Authorization: \`Bearer \${process.env.XFLUX_API_KEY}\`,
};

async function getJson(path, query) {
  const url = new URL(BASE + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(\`\${res.status} \${await res.text()}\`);
  }
  return res.json();
}`}</CodeBlock>

      <DocHeading id="profile">Get a user profile</DocHeading>
      <CodeBlock>{`const { data: user } = await getJson("/users/elonmusk");
console.log(user.username, user.followers_count);`}</CodeBlock>

      <DocHeading id="timeline">User timeline</DocHeading>
      <CodeBlock>{`const { data: tweets } = await getJson("/users/OpenAI/tweets", {
  limit: 10,
});
for (const t of tweets) {
  console.log(t.id, (t.text || "").slice(0, 100));
}`}</CodeBlock>

      <DocHeading id="search">Search</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        See{" "}
        <Link href="/docs/guides/search" className="text-sky-400 hover:underline">
          Search operators
        </Link>{" "}
        for <code className="text-zinc-300">from:</code>, phrases, and{" "}
        <code className="text-zinc-300">lang:</code>.
      </p>
      <CodeBlock>{`const { data: results } = await getJson("/search", {
  q: "from:OpenAI lang:en",
  limit: 10,
});
console.log(results.length, "results");`}</CodeBlock>

      <DocHeading id="tweet">Tweet by ID</DocHeading>
      <CodeBlock>{`const tweetId = "1234567890";
const { data: tweet } = await getJson(\`/tweets/\${tweetId}\`);
console.log(tweet);`}</CodeBlock>

      <DocHeading id="webhook-verify">Verify monitor webhooks (Express)</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        Live <code className="text-zinc-300">monitor.hit</code> delivery requires Starter+. Always
        verify HMAC — full reference in{" "}
        <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
          Webhooks
        </Link>
        .
      </p>
      <CodeBlock>{`import crypto from "crypto";
import express from "express";

const app = express();
const SECRET = process.env.XFLUX_WEBHOOK_SECRET;

function verify(secret, timestamp, rawBody, signatureHeader) {
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(\`\${timestamp}.\${rawBody}\`).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader)
  );
}

app.post(
  "/webhooks/xflux",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const timestamp = req.headers["x-xflux-timestamp"];
    const signature = req.headers["x-xflux-signature"];
    const rawBody = req.body.toString("utf8");
    if (!verify(SECRET, timestamp, rawBody, signature)) {
      return res.status(401).send("Invalid signature");
    }
    const event = JSON.parse(rawBody);
    // handle monitor.hit ...
    res.status(200).send("ok");
  }
);`}</CodeBlock>

      <Callout title="MCP for agents">
        Prefer{" "}
        <Link href="/docs/integrations/mcp" className="text-sky-400 hover:underline">
          @xflux/xflux-mcp-server
        </Link>{" "}
        inside Claude or Cursor instead of hand-rolling tool wrappers. Marketing overview:{" "}
        <Link href="/mcp" className="text-sky-400 hover:underline">
          /mcp
        </Link>
        .
      </Callout>

      <DocHeading id="related">Related</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>
          <Link href="/docs/guides/python" className="text-sky-400 hover:underline">
            Python guide
          </Link>
        </li>
        <li>
          <Link href="/docs/api" className="text-sky-400 hover:underline">
            API Reference
          </Link>
        </li>
        <li>
          <Link href="/docs/quickstart" className="text-sky-400 hover:underline">
            Quickstart
          </Link>
        </li>
        <li>
          <Link href="/blog/twitter-api-python-nodejs" className="text-sky-400 hover:underline">
            Blog: Python + Node examples
          </Link>
        </li>
      </ul>
    </>
  );
}
