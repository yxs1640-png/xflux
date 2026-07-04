import { CodeBlock, Callout, DocHeading } from "@/components/docs/doc-blocks";
import { PLANS } from "@/lib/constants";

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
                  {p.id === "FREE" && "300s (5 min)"}
                  {p.id === "BASIC" && "60s (1 min)"}
                  {p.id === "PRO" && "30s"}
                  {p.id === "ENTERPRISE" && "10s"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocHeading id="worker-local">Background worker (local)</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        For automatic polling during development, add to <code className="text-zinc-300">.env</code>:
      </p>
      <CodeBlock>{`MONITOR_WORKER_ENABLED="true"
MONITOR_WORKER_TICK_MS="30000"
MONITOR_WORKER_BATCH_SIZE="5"`}</CodeBlock>
      <p className="text-zinc-400 text-sm mt-4">
        Restart <code className="text-zinc-300">npm run dev</code>. The worker runs inside the
        Next.js server process via instrumentation.
      </p>

      <DocHeading id="worker-fly">Background worker (production)</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        Deploy the standalone worker to Fly.io (see deployment guide). It needs the same{" "}
        <code className="text-zinc-300">DATABASE_URL</code> and{" "}
        <code className="text-zinc-300">CONSUMER_API_KEY</code> as your backend.
      </p>
      <CodeBlock>{`# From project root
fly launch --config worker/fly.toml --no-deploy
fly secrets set DATABASE_URL="..." DIRECT_URL="..." CONSUMER_API_KEY="..." -c worker/fly.toml
fly deploy -c worker/fly.toml`}</CodeBlock>

      <Callout title="Manual checks">
        Use the refresh button on each monitor to poll immediately without waiting for the worker.
      </Callout>
    </>
  );
}
