import Link from "next/link";
import { Bot, Check, Terminal } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "XFlux MCP — X/Twitter Data for Claude & Cursor",
  description:
    "Connect Claude Desktop or Cursor to XFlux with npx @xflux/xflux-mcp-server. Profiles, search, timelines, Smart Money — not the Figma xflux MCP.",
  path: "/mcp",
  keywords: [
    "xflux mcp",
    "twitter mcp server",
    "claude twitter mcp",
    "cursor mcp x api",
    "xflux mcp server",
  ],
});

const FAQS = [
  {
    question: "Is this the same as other “xflux” MCP packages?",
    answer:
      "No. @xflux/xflux-mcp-server is for the XFlux X/Twitter API at xfluxapi.com. Unrelated Figma or design MCPs that share the name are different products.",
  },
  {
    question: "What can agents do with MCP?",
    answer:
      "Read profiles, search tweets, pull timelines, look up tweets, list monitors/hits (read-only), and discover Smart Money accounts. Create monitors and webhooks in the Dashboard.",
  },
  {
    question: "Does MCP use my API quota?",
    answer:
      "Yes — each tool call counts like a REST request against your plan quota.",
  },
];

export default function McpMarketingPage() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-300 mb-6">
              <Bot className="h-4 w-4" />
              Model Context Protocol
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              X/Twitter data for Claude &amp; Cursor
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Run{" "}
              <code className="text-zinc-200">@xflux/xflux-mcp-server</code> with your XFlux API
              key. Agents get search, profiles, timelines, and Smart Money discovery — monitors stay
              in the Dashboard.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=mcp_landing">
                <Button size="lg">Get an API key</Button>
              </Link>
              <Link href="/docs/integrations/mcp">
                <Button variant="outline" size="lg">
                  Full MCP docs
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  Pricing
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-12 text-sm text-amber-100/90 leading-relaxed">
            <strong className="text-amber-200">Name disambiguation:</strong> This page is for XFlux
            (xfluxapi.com) — the X/Twitter read API. It is{" "}
            <strong className="text-white">not</strong> related to other products or Figma MCP
            servers that also use the word “xflux.”
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {[
              {
                icon: Terminal,
                title: "One npx command",
                text: "npx @xflux/xflux-mcp-server with XFLUX_API_KEY — Node 18+.",
              },
              {
                icon: Bot,
                title: "Claude + Cursor",
                text: "Same JSON config block for both MCP clients.",
              },
              {
                icon: Check,
                title: "Read + Smart Money",
                text: "Lookups plus ranked forward-looking accounts for research agents.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-violet-400 mb-2" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Install</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Package:{" "}
              <a
                href="https://www.npmjs.com/package/@xflux/xflux-mcp-server"
                className="text-sky-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @xflux/xflux-mcp-server
              </a>
              . Registry: <code className="text-zinc-300">io.github.yxs1640-png/xflux</code>.
            </p>
            <CodeBlock>{`export XFLUX_API_KEY=xflux_your_key_here
npx @xflux/xflux-mcp-server`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Cursor / Claude config</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Add to Cursor MCP settings or Claude Desktop{" "}
              <code className="text-zinc-300">claude_desktop_config.json</code>, then restart.
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
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>
            <dl className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-white mb-2">{faq.question}</dt>
                  <dd className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Ready for agents?</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              Free tier includes 1,000 API calls/month. Full tool reference lives in the docs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?src=mcp_landing_cta">
                <Button size="lg">Create free account</Button>
              </Link>
              <Link href="/docs/integrations/mcp">
                <Button variant="outline" size="lg">
                  MCP documentation
                </Button>
              </Link>
              <Link href="/twitter-webhook">
                <Button variant="outline" size="lg">
                  Webhooks
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
