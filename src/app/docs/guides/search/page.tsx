import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";
import { DOC_BASE_URL } from "@/lib/docs-nav";

export const metadata = pageMetadata({
  title: "Search Operators",
  description:
    "XFlux tweet search query tips: from:username, lang:, quoted phrases, and example curl requests.",
  path: "/docs/guides/search",
  keywords: ["twitter search api operators", "from:username search", "xflux search"],
});

export default function SearchGuidePage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Search operators</h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        <code className="text-zinc-300">GET /api/v1/search</code> accepts a{" "}
        <code className="text-zinc-300">q</code> parameter using common X/Twitter search syntax for{" "}
        <strong className="text-white">recent public posts</strong>.
      </p>

      <DocHeading id="endpoint">Endpoint</DocHeading>
      <CodeBlock>{`GET ${DOC_BASE_URL}/search?q=KEYWORD&limit=20`}</CodeBlock>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm mb-8">
        <li>
          <code className="text-zinc-300">q</code> (required) — search query
        </li>
        <li>
          <code className="text-zinc-300">limit</code> — max results (default 20, max 100)
        </li>
      </ul>

      <DocHeading id="operators">Useful operators</DocHeading>
      <div className="overflow-x-auto rounded-lg border border-zinc-800 mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="p-3">Operator</th>
              <th className="p-3">Example</th>
              <th className="p-3">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            {[
              { op: "keywords", ex: "fed rate", meaning: "Match posts containing terms" },
              { op: "exact phrase", ex: '"open source"', meaning: "Quoted phrase match" },
              { op: "from:", ex: "from:OpenAI", meaning: "Posts from a specific account" },
              { op: "lang:", ex: "AI lang:en", meaning: "Language filter" },
              { op: "OR", ex: "bitcoin OR ethereum", meaning: "Either term" },
            ].map((row) => (
              <tr key={row.op} className="border-b border-zinc-800/50">
                <td className="p-3 font-mono text-sky-300 whitespace-nowrap">{row.op}</td>
                <td className="p-3 font-mono text-zinc-400">{row.ex}</td>
                <td className="p-3 text-zinc-400">{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocHeading id="examples">Examples</DocHeading>
      <CodeBlock>{`# Keyword search
curl -G "${DOC_BASE_URL}/search" \\
  -H "Authorization: Bearer xflux_YOUR_KEY" \\
  --data-urlencode "q=fed rate" \\
  --data-urlencode "limit=10"

# Posts from one account
curl -G "${DOC_BASE_URL}/search" \\
  -H "Authorization: Bearer xflux_YOUR_KEY" \\
  --data-urlencode "q=from:OpenAI lang:en"`}</CodeBlock>

      <Callout title="Monitors vs search">
        Search is on-demand and uses API quota. For always-on watches of specific @handles, use{" "}
        <Link href="/docs/monitors" className="text-sky-400 hover:underline">
          account monitors
        </Link>{" "}
        (polling does not consume API quota).
      </Callout>

      <DocHeading id="related">Related</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>
          <Link href="/docs/api" className="text-sky-400 hover:underline">
            API Reference
          </Link>
        </li>
        <li>
          <Link href="/use-cases/ai-research" className="text-sky-400 hover:underline">
            AI research use case
          </Link>
        </li>
      </ul>
    </>
  );
}
