import Link from "next/link";
import { getTranslations } from "next-intl/server";
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

export default async function NodejsGuidePage() {
  const t = await getTranslations("docsNode");

  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        {t("introBefore")} <code className="text-zinc-300">{DOC_BASE_URL}</code>.
      </p>

      <DocHeading id="setup">{t("setup")}</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed mb-4">
        <li>
          <Link href="/register" className="text-sky-400 hover:underline">
            {t("register")}
          </Link>{" "}
          {t("setup1After")} API key
        </li>
        <li>
          {t("setup2")} <code className="text-zinc-300">XFLUX_API_KEY</code>
        </li>
      </ol>
      <CodeBlock>{`export XFLUX_API_KEY=xflux_YOUR_KEY`}</CodeBlock>

      <DocHeading id="helper">{t("helper")}</DocHeading>
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

      <DocHeading id="profile">{t("profile")}</DocHeading>
      <CodeBlock>{`const { data: user } = await getJson("/users/elonmusk");
console.log(user.username, user.followers_count);`}</CodeBlock>

      <DocHeading id="timeline">{t("timeline")}</DocHeading>
      <CodeBlock>{`const { data: tweets } = await getJson("/users/OpenAI/tweets", {
  limit: 10,
});
for (const t of tweets) {
  console.log(t.id, (t.text || "").slice(0, 100));
}`}</CodeBlock>

      <DocHeading id="search">{t("search")}</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        {t("searchBlurbBefore")}{" "}
        <Link href="/docs/guides/search" className="text-sky-400 hover:underline">
          {t("searchLink")}
        </Link>{" "}
        {t("searchBlurbAfter")}
      </p>
      <CodeBlock>{`const { data: results } = await getJson("/search", {
  q: "from:OpenAI lang:en",
  limit: 10,
});
console.log(results.length, "results");`}</CodeBlock>

      <DocHeading id="tweet">{t("tweet")}</DocHeading>
      <CodeBlock>{`const tweetId = "1234567890";
const { data: tweet } = await getJson(\`/tweets/\${tweetId}\`);
console.log(tweet);`}</CodeBlock>

      <DocHeading id="webhook-verify">{t("verifyTitle")}</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{t("verifyBlurb")}</p>
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

      <Callout title={t("calloutTitle")}>{t("callout")}</Callout>

      <DocHeading id="related">{t("related")}</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>
          <Link href="/docs/guides/python" className="text-sky-400 hover:underline">
            {t("pythonGuide")}
          </Link>
        </li>
        <li>
          <Link href="/docs/api" className="text-sky-400 hover:underline">
            {t("apiRef")}
          </Link>
        </li>
        <li>
          <Link href="/docs/quickstart" className="text-sky-400 hover:underline">
            {t("quickstart")}
          </Link>
        </li>
        <li>
          <Link href="/blog/twitter-api-python-nodejs" className="text-sky-400 hover:underline">
            {t("blogLink")}
          </Link>
        </li>
      </ul>
    </>
  );
}
