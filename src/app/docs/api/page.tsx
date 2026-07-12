import { pageMetadata } from "@/lib/seo";
import { CodeBlock, Callout, DocHeading } from "@/components/docs/doc-blocks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ENDPOINTS } from "@/lib/constants";
import { DOC_BASE_URL } from "@/lib/docs-nav";

export const metadata = pageMetadata({
  title: "API Reference",
  description:
    "XFlux REST API reference for X/Twitter user profiles, timelines, tweet lookup, and search. Bearer token authentication with monthly quotas.",
  path: "/docs/api",
});

export default function ApiDocsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
      <p className="text-zinc-400 mb-8">
        RESTful JSON API. All endpoints require authentication and count against your monthly API
        quota.
      </p>

      <DocHeading id="auth">Authentication</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Pass your API key via Bearer token or <code className="text-zinc-300">X-API-Key</code> header.
      </p>
      <CodeBlock>{`Authorization: Bearer xflux_YOUR_API_KEY
# or
X-API-Key: xflux_YOUR_API_KEY`}</CodeBlock>

      <DocHeading id="base-url">Base URL</DocHeading>
      <CodeBlock>{DOC_BASE_URL}</CodeBlock>

      <DocHeading id="endpoints">Endpoints</DocHeading>
      <div className="space-y-4">
        {API_ENDPOINTS.map((ep) => (
          <Card key={ep.path + ep.method}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={ep.method === "GET" ? "sky" : "success"}>{ep.method}</Badge>
                <CardTitle className="font-mono text-base">{ep.path}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm">{ep.description}</p>
              {"params" in ep && ep.params && (
                <p className="mt-2 text-sm text-zinc-500">
                  Query: <code className="text-zinc-300">{ep.params}</code>
                </p>
              )}
              {"body" in ep && ep.body && (
                <CodeBlock className="mt-3 text-xs">{ep.body}</CodeBlock>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <DocHeading id="responses">Response format</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Successful responses return JSON with a <code className="text-zinc-300">data</code> field.
        Errors return <code className="text-zinc-300">error</code> and HTTP 4xx/5xx.
      </p>
      <CodeBlock>{`{
  "data": {
    "id": "44196397",
    "username": "elonmusk",
    "name": "Elon Musk",
    "followers_count": 000000,
    "verified": true
  }
}`}</CodeBlock>

      <DocHeading id="examples">Examples</DocHeading>
      <CodeBlock>{`# User profile
curl "${DOC_BASE_URL}/users/elonmusk" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

# User timeline
curl "${DOC_BASE_URL}/users/elonmusk/tweets?limit=10" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

# Search
curl "${DOC_BASE_URL}/search?q=bitcoin&limit=20" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`}</CodeBlock>

      <Callout variant="warning" title="Quota">
        Each successful API call consumes 1 unit from your monthly plan quota. Monitor polling does
        not use API quota. See{" "}
        <a href="/docs/limits" className="text-sky-400 hover:underline">
          Plans & Limits
        </a>
        .
      </Callout>
    </>
  );
}
