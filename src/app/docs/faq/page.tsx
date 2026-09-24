import Link from "next/link";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import { DocHeading } from "@/components/docs/doc-blocks";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "XFlux FAQ: free vs paid webhooks, monitors vs API quota, MCP vs REST, and when to use the official X API.",
  path: "/docs/faq",
});

const FAQS: { q: string; answerText: string; a: ReactNode }[] = [
  {
    q: "Does Free include live webhooks?",
    answerText:
      "Free can save a webhook URL and send test pings. Live monitor.hit delivery requires Starter ($19/mo) or above.",
    a: (
      <>
        Free can save a webhook URL and send <strong className="text-white">test pings</strong>. Live{" "}
        <code className="text-zinc-300">monitor.hit</code> delivery requires Starter ($19/mo) or
        above. See{" "}
        <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
          Webhooks
        </Link>
        .
      </>
    ),
  },
  {
    q: "Do monitors use my API quota?",
    answerText:
      "No. Background polling does not consume monthly API call quota. Calling /api/v1/* (including list monitors / hits) does.",
    a: (
      <>
        No. Background polling does not consume monthly API call quota. Calling{" "}
        <code className="text-zinc-300">/api/v1/*</code> (including list monitors / hits) does.
      </>
    ),
  },
  {
    q: "MCP vs REST — which should I use?",
    answerText:
      "Use MCP inside Claude Desktop / Cursor for agent workflows. Use REST from your backend, scripts, or Make. Same API key and quotas.",
    a: (
      <>
        Use{" "}
        <Link href="/mcp" className="text-sky-400 hover:underline">
          MCP
        </Link>{" "}
        inside Claude Desktop / Cursor for agent workflows. Use REST from your backend, scripts, or
        Make. Same API key and quotas.
      </>
    ),
  },
  {
    q: "Can I create monitors via API?",
    answerText:
      "Create and edit monitors in the Dashboard. API/MCP support read-only list and hits (GET /api/v1/monitors).",
    a: (
      <>
        Create and edit monitors in the{" "}
        <Link href="/dashboard/monitors" className="text-sky-400 hover:underline">
          Dashboard
        </Link>
        . API/MCP support{" "}
        <strong className="text-white">read-only</strong> list and hits (
        <code className="text-zinc-300">GET /api/v1/monitors</code>).
      </>
    ),
  },
  {
    q: "When should I use the official X API instead?",
    answerText:
      "When you need write access (post/DM), full-archive search, compliance products, or official partnership.",
    a: (
      <>
        When you need write access (post/DM), full-archive search, compliance products, or official
        partnership. Compare costs on{" "}
        <Link href="/compare/x-api" className="text-sky-400 hover:underline">
          XFlux vs official X API
        </Link>
        .
      </>
    ),
  },
  {
    q: "Why did a monitor fail on a high-profile account?",
    answerText:
      "Most public accounts work; a small set of restricted accounts may not poll reliably. Try another handle.",
    a: (
      <>
        Most public accounts work; a small set of restricted accounts may not poll reliably. Try
        another handle or see{" "}
        <Link href="/docs/monitors" className="text-sky-400 hover:underline">
          Monitors
        </Link>
        .
      </>
    ),
  },
  {
    q: "Where do I see usage and rate limits?",
    answerText:
      "Dashboard → Usage for monthly quota. See Errors and Plans & Limits docs for rate-limit details.",
    a: (
      <>
        Dashboard → Usage for monthly quota. Error codes and per-minute caps:{" "}
        <Link href="/docs/errors" className="text-sky-400 hover:underline">
          Errors
        </Link>{" "}
        and{" "}
        <Link href="/docs/limits" className="text-sky-400 hover:underline">
          Plans &amp; Limits
        </Link>
        .
      </>
    ),
  },
];

export default function FaqDocsPage() {
  return (
    <>
      <FaqJsonLd
        items={FAQS.map((item) => ({ question: item.q, answer: item.answerText }))}
      />
      <h1 className="text-4xl font-bold text-white mb-4">FAQ</h1>
      <p className="text-zinc-400 mb-8">Common questions about quotas, monitors, MCP, and pricing.</p>

      <div className="space-y-8">
        {FAQS.map((item) => (
          <div key={item.q}>
            <DocHeading id={item.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}>
              {item.q}
            </DocHeading>
            <p className="text-zinc-400 text-sm leading-relaxed -mt-4">{item.a}</p>
          </div>
        ))}
      </div>
    </>
  );
}
