import { notFound } from "next/navigation";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { FeedbackReviewActions } from "@/components/feedback/feedback-review-actions";
import { FEEDBACK_REWARD_CALLS } from "@/lib/feedback-reward";

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
      capabilityRequest: true,
      notifyOnShip: true,
      capabilityNotifySentAt: true,
      message: true,
      pageUrl: true,
      userSource: true,
      userSourceDetail: true,
      coreNeeds: true,
      adoptionDrivers: true,
      emailSent: true,
      reviewStatus: true,
      rewardCalls: true,
      rewardGrantedAt: true,
      reviewedAt: true,
      reviewNote: true,
      createdAt: true,
    },
  });

  const pending = rows.filter((r) => r.reviewStatus === "PENDING").length;
  const notifyPending = rows.filter(
    (r) => r.notifyOnShip && r.capabilityRequest && !r.capabilityNotifySentAt
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Feedback inbox</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Latest {rows.length} rows · {pending} pending review · {notifyPending} wait for
          ship-notify. Approve grants +{FEEDBACK_REWARD_CALLS.toLocaleString()} API calls (once
          per account). When a capability ships, run{" "}
          <code className="text-zinc-400">scripts/send-feedback-capability-ready.mjs</code>.
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
                  <span
                    className={
                      row.reviewStatus === "APPROVED"
                        ? "ml-2 text-xs font-normal text-emerald-400"
                        : row.reviewStatus === "REJECTED"
                          ? "ml-2 text-xs font-normal text-zinc-500"
                          : "ml-2 text-xs font-normal text-amber-400"
                    }
                  >
                    {row.reviewStatus}
                    {row.rewardCalls
                      ? ` · +${row.rewardCalls.toLocaleString()} calls`
                      : ""}
                  </span>
                  {row.notifyOnShip ? (
                    <span
                      className={
                        row.capabilityNotifySentAt
                          ? "ml-2 text-xs font-normal text-emerald-500"
                          : "ml-2 text-xs font-normal text-sky-400"
                      }
                    >
                      {row.capabilityNotifySentAt
                        ? "ship-notified"
                        : "notify-on-ship"}
                    </span>
                  ) : (
                    <span className="ml-2 text-xs font-normal text-zinc-600">no ship notify</span>
                  )}
                </p>
                <time className="text-xs text-zinc-500" dateTime={row.createdAt.toISOString()}>
                  {row.createdAt.toISOString().replace("T", " ").slice(0, 19)} UTC
                </time>
              </div>
              {row.capabilityRequest ? (
                <p className="mt-2 whitespace-pre-wrap rounded-md border border-sky-500/20 bg-sky-500/5 px-3 py-2 text-sm text-zinc-100">
                  {row.capabilityRequest}
                </p>
              ) : null}
              {row.message ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-400">{row.message}</p>
              ) : !row.capabilityRequest ? (
                <p className="mt-2 text-sm italic text-zinc-600">No free-text request</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                <span className="font-mono text-zinc-600">{row.id}</span>
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
                <span>{row.emailSent ? "admin notify ok" : "admin notify pending/fail"}</span>
              </div>
              {row.reviewStatus === "PENDING" ? (
                <FeedbackReviewActions
                  feedbackId={row.id}
                  rewardCalls={FEEDBACK_REWARD_CALLS}
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
