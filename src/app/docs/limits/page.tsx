import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { DocHeading } from "@/components/docs/doc-blocks";
import { PLANS } from "@/lib/constants";

export const metadata = pageMetadata({
  title: "Plans & Limits",
  description:
    "XFlux plan tiers, API quotas, monitor limits, polling intervals, and webhook access by subscription level.",
  path: "/docs/limits",
});

export default function LimitsDocsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Plans & Limits</h1>
      <p className="text-zinc-400 mb-8">
        XFlux uses monthly subscriptions. API calls and monitors are metered separately.
      </p>

      <DocHeading id="plans">Subscription plans</DocHeading>
      <div className="overflow-x-auto rounded-lg border border-zinc-800 mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="p-3">Plan</th>
              <th className="p-3">Price</th>
              <th className="p-3">API / month</th>
              <th className="p-3">Monitors</th>
              <th className="p-3">Webhooks</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            {PLANS.map((p) => (
              <tr key={p.id} className="border-b border-zinc-800/50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">${p.price}{p.price > 0 ? "/mo" : ""}</td>
                <td className="p-3">{p.quota}</td>
                <td className="p-3">{p.monitors}</td>
                <td className="p-3">{p.id === "FREE" ? "No" : "Yes"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocHeading id="api-quota">API quota</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>Resets monthly from your account quota reset date</li>
        <li>Exceeded quota returns HTTP 429 with upgrade hint</li>
        <li>View usage in Dashboard → Usage</li>
      </ul>

      <DocHeading id="monitor-quota">Monitor quota</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>Monitor polling does not consume API quota</li>
        <li>Active monitor count limited by plan</li>
        <li>Minimum check interval enforced per plan (see Monitors doc)</li>
      </ul>

      <DocHeading id="errors">HTTP errors</DocHeading>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="p-3">Code</th>
              <th className="p-3">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            <tr className="border-b border-zinc-800/50">
              <td className="p-3 font-mono">401</td>
              <td className="p-3">Missing or invalid API key</td>
            </tr>
            <tr className="border-b border-zinc-800/50">
              <td className="p-3 font-mono">403</td>
              <td className="p-3">Plan limit (monitors, webhooks, interval)</td>
            </tr>
            <tr className="border-b border-zinc-800/50">
              <td className="p-3 font-mono">404</td>
              <td className="p-3">User or tweet not found</td>
            </tr>
            <tr className="border-b border-zinc-800/50">
              <td className="p-3 font-mono">429</td>
              <td className="p-3">Monthly API quota exceeded</td>
            </tr>
            <tr>
              <td className="p-3 font-mono">502/503</td>
              <td className="p-3">Upstream data source unavailable</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-zinc-500 text-sm mt-8">
        Upgrade anytime in{" "}
        <Link href="/dashboard/billing" className="text-sky-400 hover:underline">
          Dashboard → Billing
        </Link>
        . See also{" "}
        <Link href="/pricing" className="text-sky-400 hover:underline">
          Pricing
        </Link>
        .
      </p>
    </>
  );
}
