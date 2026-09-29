import { notFound } from "next/navigation";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { isAdminEmail } from "@/lib/admin";
import { getOpsMetrics } from "@/lib/ops-metrics";
import { OpsRefreshButton } from "@/components/dashboard/ops-refresh-button";

export const dynamic = "force-dynamic";

export default async function DashboardOpsPage() {
  const session = await requireDashboardSession();
  if (!isAdminEmail(session.user.email)) notFound();

  const metrics = await getOpsMetrics(14);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Ops stats</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Day buckets use Asia/Shanghai (CST). Admin only.
          </p>
        </div>
        <OpsRefreshButton generatedAt={metrics.generatedAt} />
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["Users", metrics.baselines.totalUsers],
            ["Paid", metrics.baselines.paidUsers],
            ["Active monitors", metrics.baselines.activeMonitors],
            ["Webhook monitors", metrics.baselines.webhookConfigured],
            ["Feedback rows", metrics.baselines.feedbackTotal],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
          >
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
              {value.toLocaleString()}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-200">Last 14 days (CST)</h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Signups</th>
                <th className="px-3 py-2 font-medium">API calls</th>
                <th className="px-3 py-2 font-medium">API users</th>
                <th className="px-3 py-2 font-medium">Monitor hits</th>
                <th className="px-3 py-2 font-medium">Webhook OK</th>
                <th className="px-3 py-2 font-medium">MCP</th>
                <th className="px-3 py-2 font-medium">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {metrics.days.map((row) => (
                <tr key={row.date} className="border-t border-zinc-800/80 text-zinc-300">
                  <td className="px-3 py-2 tabular-nums text-zinc-100">{row.date}</td>
                  <td className="px-3 py-2 tabular-nums">{row.signups}</td>
                  <td className="px-3 py-2 tabular-nums">{row.apiCalls.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums">{row.apiUsers}</td>
                  <td className="px-3 py-2 tabular-nums">{row.monitorHits}</td>
                  <td className="px-3 py-2 tabular-nums">{row.webhookOk}</td>
                  <td className="px-3 py-2 tabular-nums">{row.mcpCalls}</td>
                  <td className="px-3 py-2 tabular-nums">{row.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-200">Signup sources (7d)</h2>
          {metrics.signupSources7d.length === 0 ? (
            <p className="text-sm text-zinc-500">No signups in the last 7 days.</p>
          ) : (
            <ul className="space-y-1 rounded-lg border border-zinc-800 divide-y divide-zinc-800/80">
              {metrics.signupSources7d.map((s) => (
                <li
                  key={s.source}
                  className="flex items-center justify-between px-3 py-2 text-sm"
                >
                  <span className="text-zinc-300">{s.source}</span>
                  <span className="tabular-nums text-zinc-100">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-200">Recent signups (7d)</h2>
          {metrics.recentSignups.length === 0 ? (
            <p className="text-sm text-zinc-500">None.</p>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-zinc-800 divide-y divide-zinc-800/80">
              {metrics.recentSignups.map((u) => (
                <li key={`${u.email}-${u.createdAt}`} className="px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-zinc-100">{u.email}</span>
                    <span className="text-xs tabular-nums text-zinc-500">
                      {u.createdAt.replace("T", " ").slice(0, 16)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {u.planTier}
                    {u.signupSource ? ` · ${u.signupSource}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
