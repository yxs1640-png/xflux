import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";

export const metadata = pageMetadata({
  title: "XFlux MCP Server — X/Twitter Data for AI Agents",
  description:
    "Connect Claude Desktop or Cursor to the XFlux read API via MCP. Search tweets, look up profiles, and pull timelines with your API key.",
  path: "/docs/integrations/mcp",
  keywords: [
    "xflux mcp",
    "twitter mcp server",
    "claude x api",
    "cursor mcp twitter",
  ],
});

export default function McpIntegrationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">XFlux MCP server</h1>
      <p className="text-zinc-400 mb-6 leading-relaxed">
        Use the{" "}
        <a
          href="https://modelcontextprotocol.io"
          className="text-sky-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Model Context Protocol
        </a>{" "}
        to give AI agents access to the XFlux <strong className="text-white">read API</strong> —
        search, profiles, and timelines. Monitors and webhooks are still configured in the{" "}
        <Link href="/dashboard/monitors" className="text-sky-400 hover:underline">
          Dashboard
        </Link>
        ; the MCP layer is intentionally thin.
      </p>

      <Callout title="What this is (and isn&apos;t)">
        <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
          <li>
            <strong className="text-white">Is:</strong> on-demand tweet/user lookups plus{" "}
            <strong className="text-white">read-only</strong> access to your monitor list and hits.
          </li>
          <li>
            <strong className="text-white">Isn&apos;t:</strong> a replacement for creating monitors,
            streaming, or webhook delivery — configure those in the{" "}
            <Link href="/docs/monitors" className="text-sky-400 hover:underline">
              Dashboard
            </Link>
            .
          </li>
        </ul>
      </Callout>

      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
        <strong className="text-white">Install:</strong>{" "}
        <a
          href="https://www.npmjs.com/package/@xflux/xflux-mcp-server"
          className="text-sky-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          @xflux/xflux-mcp-server
        </a>
        {" · "}
        <strong className="text-white">Registry:</strong>{" "}
        <code className="text-zinc-300">io.github.yxs1640-png/xflux</code>
      </p>

      <DocHeading id="tools">Available tools</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm mb-6">
        <li>
          <code className="text-zinc-300">xflux_get_user</code> — profile by @username (compact)
        </li>
        <li>
          <code className="text-zinc-300">xflux_search_tweets</code> — search recent posts (compact)
        </li>
        <li>
          <code className="text-zinc-300">xflux_get_user_tweets</code> — user timeline (compact)
        </li>
        <li>
          <code className="text-zinc-300">xflux_get_tweet</code> — single tweet by ID (compact)
        </li>
        <li>
          <code className="text-zinc-300">xflux_list_monitors</code> — your monitors (read-only;
          optional recent hits)
        </li>
        <li>
          <code className="text-zinc-300">xflux_get_monitor_hits</code> — hits for one monitor
          (read-only)
        </li>
      </ul>

      <DocHeading id="install">Install & run</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Install via npm as{" "}
        <code className="text-zinc-300">@xflux/xflux-mcp-server</code> (Registry name{" "}
        <code className="text-zinc-300">io.github.yxs1640-png/xflux</code>). You need Node 18+ and
        an API key from the Dashboard.
      </p>
      <CodeBlock>{`export XFLUX_API_KEY=xflux_your_key_here
npx @xflux/xflux-mcp-server`}</CodeBlock>

      <DocHeading id="cursor">Cursor configuration</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Add to Cursor MCP settings (Settings → MCP → Edit config):
      </p>
      <CodeBlock>{`{
  "mcpServers": {
    "xflux": {
      "command": "npx",
      "args": ["-y", "@xflux/xflux-mcp-server"],
      "env": {
        "XFLUX_API_KEY": "xflux_your_key_here"
      }
    }
  }
}`}</CodeBlock>

      <DocHeading id="claude">Claude Desktop</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Same JSON block in Claude Desktop config (
        <code className="text-zinc-300">claude_desktop_config.json</code>). Restart the app after
        saving.
      </p>

      <DocHeading id="monitors">Monitors + MCP together</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        Typical pattern: use MCP during development to explore accounts and craft keyword filters,
        create monitors in the Dashboard, then inspect hits with{" "}
        <code className="text-zinc-300">xflux_list_monitors</code> /{" "}
        <code className="text-zinc-300">xflux_get_monitor_hits</code>. For production alerts, use{" "}
        <Link href="/docs/guides/trading-keywords" className="text-sky-400 hover:underline">
          trading keyword templates
        </Link>{" "}
        and route webhooks to Make.com per the{" "}
        <Link href="/docs/integrations/make" className="text-sky-400 hover:underline">
          Make guide
        </Link>
        .
      </p>

      <DocHeading id="limits">API limits</DocHeading>
      <p className="text-zinc-400 text-sm">
        MCP calls count against your plan quota like any REST request. See{" "}
        <Link href="/docs/limits" className="text-sky-400 hover:underline">
          Plans &amp; Limits
        </Link>
        .
      </p>
    </>
  );
}
