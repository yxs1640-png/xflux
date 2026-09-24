import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";
import { DOC_BASE_URL } from "@/lib/docs-nav";

export const metadata = pageMetadata({
  title: "Python Guide — XFlux X/Twitter API",
  description:
    "Call the XFlux read API from Python with requests: profiles, timelines, search, and Bearer auth against www.xfluxapi.com/api/v1.",
  path: "/docs/guides/python",
  keywords: [
    "twitter api python",
    "x api python example",
    "xflux python",
    "twitter search python",
  ],
});

export default function PythonGuidePage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Python guide</h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        Use any HTTP client with a Bearer API key. Examples below use{" "}
        <code className="text-zinc-300">requests</code>. Base URL:{" "}
        <code className="text-zinc-300">{DOC_BASE_URL}</code>.
      </p>

      <DocHeading id="setup">Setup</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed mb-4">
        <li>
          <Link href="/register" className="text-sky-400 hover:underline">
            Register
          </Link>{" "}
          and copy your <code className="text-zinc-300">xflux_</code> key
        </li>
        <li>
          <code className="text-zinc-300">pip install requests</code>
        </li>
        <li>
          Export <code className="text-zinc-300">XFLUX_API_KEY</code> (never commit secrets)
        </li>
      </ol>
      <CodeBlock>{`export XFLUX_API_KEY=xflux_YOUR_KEY`}</CodeBlock>

      <DocHeading id="auth">Authentication</DocHeading>
      <CodeBlock>{`import os
import requests

BASE = "${DOC_BASE_URL}"
headers = {"Authorization": f"Bearer {os.environ['XFLUX_API_KEY']}"}
# or: headers = {"X-API-Key": os.environ["XFLUX_API_KEY"]}`}</CodeBlock>

      <DocHeading id="profile">Get a user profile</DocHeading>
      <CodeBlock>{`r = requests.get(f"{BASE}/users/elonmusk", headers=headers, timeout=30)
r.raise_for_status()
user = r.json()["data"]
print(user["username"], user.get("followers_count"))`}</CodeBlock>

      <DocHeading id="timeline">User timeline</DocHeading>
      <CodeBlock>{`r = requests.get(
    f"{BASE}/users/OpenAI/tweets",
    headers=headers,
    params={"limit": 10},
    timeout=30,
)
r.raise_for_status()
for tweet in r.json()["data"]:
    print(tweet["id"], (tweet.get("text") or "")[:100])`}</CodeBlock>

      <DocHeading id="search">Search</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Operators like <code className="text-zinc-300">from:</code> and{" "}
        <code className="text-zinc-300">lang:</code> work as documented in{" "}
        <Link href="/docs/guides/search" className="text-sky-400 hover:underline">
          Search operators
        </Link>
        .
      </p>
      <CodeBlock>{`r = requests.get(
    f"{BASE}/search",
    headers=headers,
    params={"q": "fed rate", "limit": 20},
    timeout=30,
)
r.raise_for_status()
print(len(r.json()["data"]), "hits")`}</CodeBlock>

      <DocHeading id="tweet">Tweet by ID</DocHeading>
      <CodeBlock>{`tweet_id = "1234567890"
r = requests.get(f"{BASE}/tweets/{tweet_id}", headers=headers, timeout=30)
r.raise_for_status()
print(r.json()["data"])`}</CodeBlock>

      <Callout title="Monitors & webhooks">
        Always-on account watches are configured in the{" "}
        <Link href="/docs/monitors" className="text-sky-400 hover:underline">
          Dashboard
        </Link>
        . Polling does not use REST quota. Live signed delivery needs{" "}
        <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
          Starter+
        </Link>
        . For agents, see{" "}
        <Link href="/docs/integrations/mcp" className="text-sky-400 hover:underline">
          MCP
        </Link>
        .
      </Callout>

      <DocHeading id="errors">Errors</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        Non-2xx responses include an <code className="text-zinc-300">error</code> field. See{" "}
        <Link href="/docs/errors" className="text-sky-400 hover:underline">
          Errors
        </Link>{" "}
        and{" "}
        <Link href="/docs/limits" className="text-sky-400 hover:underline">
          Plans &amp; Limits
        </Link>
        .
      </p>

      <DocHeading id="related">Related</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>
          <Link href="/docs/guides/nodejs" className="text-sky-400 hover:underline">
            Node.js guide
          </Link>
        </li>
        <li>
          <Link href="/docs/api" className="text-sky-400 hover:underline">
            API Reference
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
