import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { CodeBlock, Callout, DocHeading } from "@/components/docs/doc-blocks";
import { DOC_BASE_URL } from "@/lib/docs-nav";

export const metadata = pageMetadata({
  title: "Quickstart",
  description:
    "Get started with the XFlux X/Twitter API in minutes. Create an account, copy your API key, and make your first request.",
  path: "/docs/quickstart",
});

export default function QuickstartPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Quickstart</h1>
      <p className="text-zinc-400 mb-8">
        Get from zero to your first API response in a few minutes.
      </p>

      <DocHeading id="register">1. Create an account</DocHeading>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
        <Link href="/register" className="text-sky-400 hover:underline">
          Register
        </Link>{" "}
        for a free account. No credit card required on the Free plan.
      </p>

      <DocHeading id="api-key">2. Generate an API key</DocHeading>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
        Open Dashboard → API Keys → Create key. Keys are prefixed with{" "}
        <code className="text-zinc-300">xflux_</code>.
      </p>

      <DocHeading id="first-call">3. Make your first request</DocHeading>
      <CodeBlock>{`curl -X GET "${DOC_BASE_URL}/users/elonmusk" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`}</CodeBlock>

      <DocHeading id="monitor">4. (Optional) Add a monitor</DocHeading>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
        In Dashboard → Monitors, add <code className="text-zinc-300">@username</code>. Click{" "}
        <strong className="text-white">Check now</strong> to run the first poll (baseline only).
        New tweets after that appear as hits.
      </p>

      <DocHeading id="next">Next steps</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>
          <Link href="/docs/api" className="text-sky-400 hover:underline">
            API Reference
          </Link>{" "}
          — all endpoints and response shapes
        </li>
        <li>
          <Link href="/docs/monitors" className="text-sky-400 hover:underline">
            Monitors
          </Link>{" "}
          — intervals, keywords, and polling
        </li>
        <li>
          <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
            Webhooks
          </Link>{" "}
          — push notifications to your server
        </li>
      </ul>
    </>
  );
}
