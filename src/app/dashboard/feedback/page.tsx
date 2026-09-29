import { notFound } from "next/navigation";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardFeedbackPage() {
  const session = await requireDashboardSession();
  if (!isAdminEmail(session.user.email)) notFound();

  const rows = await prisma.userFeedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 150,
    select: {
      id: true,
      email: true,
      name: true,
      planTier: true,
      message: true,
      pageUrl: true,
      userSource: true,
      userSourceDetail: true,
      coreNeeds: true,
      adoptionDrivers: true,
      emailSent: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Feedback inbox</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Latest {rows.length} rows from <code className="text-zinc-400">UserFeedback</code>.
          Admin only.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-500">
          No feedback yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-zinc-100">
                  {row.name ? `${row.name} · ` : ""}
                  {row.email}
                  {row.planTier ? (
                    <span className="ml-2 text-xs font-normal text-zinc-500">
                      {row.planTier}
                    </span>
                  ) : null}
                </p>
                <time className="text-xs text-zinc-500" dateTime={row.createdAt.toISOString()}>
                  {row.createdAt.toISOString().replace("T", " ").slice(0, 19)} UTC
                </time>
              </div>
              {row.message ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">{row.message}</p>
              ) : (
                <p className="mt-2 text-sm italic text-zinc-600">No free-text message</p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                {row.pageUrl ? (
                  <a
                    href={row.pageUrl}
                    className="truncate text-sky-500 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {row.pageUrl}
                  </a>
                ) : null}
                {row.userSource ? <span>source: {row.userSource}</span> : null}
                {Array.isArray(row.coreNeeds) && row.coreNeeds.length > 0 ? (
                  <span>needs: {(row.coreNeeds as string[]).join(", ")}</span>
                ) : null}
                {Array.isArray(row.adoptionDrivers) && row.adoptionDrivers.length > 0 ? (
                  <span>drivers: {(row.adoptionDrivers as string[]).join(", ")}</span>
                ) : null}
                <span>{row.emailSent ? "notify ok" : "notify pending/fail"}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
