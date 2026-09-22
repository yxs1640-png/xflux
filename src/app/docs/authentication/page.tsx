import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";
import { DOC_BASE_URL } from "@/lib/docs-nav";

export const metadata = pageMetadata({
  title: "Authentication",
  description:
    "Authenticate to the XFlux REST API with a Bearer token or X-API-Key header. Create keys in the Dashboard.",
  path: "/docs/authentication",
});

export default function AuthenticationDocsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Authentication</h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        Every <code className="text-zinc-300">/api/v1/*</code> request requires an API key. Keys are
        prefixed with <code className="text-zinc-300">xflux_</code> and created in the Dashboard.
      </p>

      <DocHeading id="create-key">Create an API key</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm mb-6">
        <li>
          <Link href="/register" className="text-sky-400 hover:underline">
            Register
          </Link>{" "}
          or sign in
        </li>
        <li>
          Open{" "}
          <Link href="/dashboard/api-keys" className="text-sky-400 hover:underline">
            Dashboard → API Keys
          </Link>
        </li>
        <li>Copy the key once — treat it like a password</li>
      </ol>

      <DocHeading id="headers">Request headers</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">Use either header (not both required):</p>
      <CodeBlock>{`Authorization: Bearer xflux_YOUR_API_KEY

# or
X-API-Key: xflux_YOUR_API_KEY`}</CodeBlock>

      <DocHeading id="example">Example</DocHeading>
      <CodeBlock>{`curl "${DOC_BASE_URL}/users/elonmusk" \\
  -H "Authorization: Bearer xflux_YOUR_API_KEY"`}</CodeBlock>

      <Callout title="Quota">
        Authenticated calls count against your monthly plan quota and per-minute rate limit. See{" "}
        <Link href="/docs/limits" className="text-sky-400 hover:underline">
          Plans &amp; Limits
        </Link>
        . Monitor polling does not consume API quota.
      </Callout>

      <DocHeading id="mcp">MCP / agents</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        Set <code className="text-zinc-300">XFLUX_API_KEY</code> in your MCP client env. Details:{" "}
        <Link href="/docs/integrations/mcp" className="text-sky-400 hover:underline">
          MCP server
        </Link>
        .
      </p>

      <DocHeading id="errors">Auth errors</DocHeading>
      <p className="text-zinc-400 text-sm">
        Missing or invalid keys return HTTP 401 with code{" "}
        <code className="text-zinc-300">UNAUTHORIZED</code>. Full table:{" "}
        <Link href="/docs/errors" className="text-sky-400 hover:underline">
          Errors
        </Link>
        .
      </p>
    </>
  );
}
