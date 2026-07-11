import { CodeBlock, Callout, DocHeading } from "@/components/docs/doc-blocks";
import { PLANS } from "@/lib/constants";
import { PLAN_MONITOR_MIN_INTERVAL, formatMonitorInterval } from "@/lib/quota";
import { PlanTier } from "@prisma/client";

export default function MonitorsDocsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Monitors</h1>
      <p className="text-zinc-400 mb-8">
        Monitors watch X accounts on a schedule and record new tweets as hits. They are a core
        product alongside the API — not billed against API quota.
      </p>

      <DocHeading id="concepts">Concepts</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm leading-relaxed">
        <li>
          <strong className="text-white">Monitor task</strong> — one @username (optional keyword
          filter)
        </li>
        <li>
          <strong className="text-white">Baseline</strong> — first successful poll stores{" "}
          <code className="text-zinc-300">lastTweetId</code> without creating hits
        </li>
        <li>
          <strong className="text-white">Hit</strong> — a tweet newer than the baseline, stored in
          Dashboard and optionally sent via webhook
        </li>
        <li>
          <strong className="text-white">Check interval</strong> — minimum seconds between polls
          (plan-dependent)
        </li>
      </ul>

      <DocHeading id="dashboard">Dashboard usage</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed">
        <li>Go to Dashboard → Monitors</li>
        <li>Enter <code className="text-zinc-300">@username</code> and optional keywords (comma-separated)</li>
        <li>Click <strong className="text-white">Check now</strong> to establish baseline</li>
        <li>New tweets appear under Recent hits; Dashboard shows cross-monitor activity</li>
      </ol>

      <DocHeading id="keywords">Keyword filter</DocHeading>
      <p className="text-zinc-400 text-sm leading-relaxed">
        If keywords are set (e.g. <code className="text-zinc-300">bitcoin, eth</code>), only tweets
        containing at least one keyword (case-insensitive) become hits. Leave empty to capture all
        new tweets.
      </p>

      <DocHeading id="intervals">Check intervals by plan</DocHeading>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="p-3">Plan</th>
              <th className="p-3">Monitors</th>
              <th className="p-3">Min interval</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            {PLANS.map((p) => (
              <tr key={p.id} className="border-b border-zinc-800/50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.monitors}</td>
                <td className="p-3">
                  {formatMonitorInterval(
                    PLAN_MONITOR_MIN_INTERVAL[p.id as PlanTier] ?? 300
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocHeading id="polling">How polling works</DocHeading>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
        XFlux checks your monitors automatically on your plan&apos;s schedule (see intervals
        below). You can also click <strong className="text-white">Check now</strong> on any monitor
        to poll immediately — useful right after creating a monitor or when testing.
      </p>
      <Callout title="First check = baseline">
        The first successful poll records the latest tweet ID without creating hits. Only tweets
        posted after that appear as hits in your Dashboard.
      </Callout>

      <Callout variant="warning" title="Account availability">
        Most public X accounts work reliably. A small number of restricted or high-profile accounts
        may fail to poll. If you see an error, try another account or contact support.
      </Callout>
    </>
  );
}
