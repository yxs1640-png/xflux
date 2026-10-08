import "server-only";
import { Resend } from "resend";
import {
  ADOPTION_DRIVER_OPTIONS,
  CORE_NEED_OPTIONS,
  FEEDBACK_FROM_EMAIL,
  FEEDBACK_NOTIFY_EMAIL,
  type AdoptionDriverId,
  type CoreNeedId,
} from "./feedback-config";
import { getUserSourceLabel } from "./user-source-config";

export interface FeedbackEmailPayload {
  id: string;
  email: string;
  name?: string | null;
  planTier?: string | null;
  userSource?: string | null;
  userSourceDetail?: string | null;
  coreNeeds: CoreNeedId[];
  adoptionDrivers: AdoptionDriverId[];
  message?: string | null;
  pageUrl?: string | null;
  createdAt: Date;
}

function labelOptions<T extends { id: string; label: string }>(
  ids: string[],
  options: readonly T[]
): string[] {
  return ids.map((id) => options.find((o) => o.id === id)?.label ?? id);
}

function buildFeedbackEmailHtml(payload: FeedbackEmailPayload): string {
  const coreLabels = labelOptions(payload.coreNeeds, CORE_NEED_OPTIONS);
  const driverLabels = labelOptions(payload.adoptionDrivers, ADOPTION_DRIVER_OPTIONS);

  const list = (items: string[]) =>
    items.length > 0
      ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "<p><em>None selected</em></p>";

  return `
    <h2>New XFlux user feedback</h2>
    <p><strong>ID:</strong> ${escapeHtml(payload.id)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.name ? `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>` : ""}
    ${payload.planTier ? `<p><strong>Plan:</strong> ${escapeHtml(payload.planTier)}</p>` : ""}
    ${payload.userSource ? `<p><strong>Source:</strong> ${escapeHtml(getUserSourceLabel(payload.userSource))}${payload.userSourceDetail ? ` — ${escapeHtml(payload.userSourceDetail)}` : ""}</p>` : ""}
    ${payload.pageUrl ? `<p><strong>Page:</strong> ${escapeHtml(payload.pageUrl)}</p>` : ""}
    <p><strong>Submitted:</strong> ${payload.createdAt.toISOString()}</p>
    <h3>Core needs</h3>
    ${list(coreLabels)}
    <h3>Would use more if we shipped</h3>
    ${list(driverLabels)}
    <h3>Additional comments</h3>
    <p>${payload.message ? escapeHtml(payload.message).replace(/\n/g, "<br>") : "<em>None</em>"}</p>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendWithResend(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: FEEDBACK_FROM_EMAIL,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Failed to send email",
    };
  }
}

export async function sendFeedbackNotification(
  payload: FeedbackEmailPayload
): Promise<{ sent: boolean; error?: string }> {
  const subject = `[XFlux Feedback] ${payload.email}${
    payload.coreNeeds.length > 0 ? ` — ${payload.coreNeeds.length} needs` : ""
  }`;
  return sendWithResend({
    to: FEEDBACK_NOTIFY_EMAIL,
    replyTo: payload.email,
    subject,
    html: buildFeedbackEmailHtml(payload),
  });
}

export async function sendFeedbackRewardEmail(options: {
  to: string;
  name?: string | null;
  rewardCalls: number;
  newQuotaLimit: number;
}): Promise<{ sent: boolean; error?: string }> {
  const greeting = options.name?.trim() ? `Hi ${escapeHtml(options.name.trim())},` : "Hi,";
  const html = `
    <p>${greeting}</p>
    <p>Thanks for your product feedback on XFlux. We reviewed it and added
    <strong>${options.rewardCalls.toLocaleString()} API calls</strong> to your account
    this billing period (new monthly quota: <strong>${options.newQuotaLimit.toLocaleString()}</strong>).</p>
    <p>You can check usage anytime in
    <a href="https://xfluxapi.com/dashboard/usage">Dashboard → Usage</a>.</p>
    <p>— XFlux</p>
  `;
  return sendWithResend({
    to: options.to,
    subject: `Your XFlux feedback reward: +${options.rewardCalls.toLocaleString()} API calls`,
    html,
  });
}

export async function sendFeedbackInviteEmail(options: {
  to: string;
  name?: string | null;
  rewardCalls: number;
}): Promise<{ sent: boolean; error?: string }> {
  const greeting = options.name?.trim() ? `Hi ${escapeHtml(options.name.trim())},` : "Hi,";
  const html = `
    <p>${greeting}</p>
    <p>This is a note from the XFlux team. We're talking with people who have already tried
    the API or account monitors, and we'd value a short written evaluation from you.</p>
    <p>What helps most: your use case, what worked, what blocked you, and one change you'd
    prioritize. We read every submission. If the feedback is concrete and useful, we may add
    ${options.rewardCalls.toLocaleString()} API calls to your account for the current period
    (one time per account; checkbox-only replies usually don't qualify).</p>
    <p><a href="https://xfluxapi.com/feedback?src=feedback_reward_invite">Open the feedback form</a></p>
    <p>Thanks,<br>XFlux</p>
    <p style="color:#888;font-size:12px">You're receiving this because you have an XFlux account.
    Questions: reply to this email or write support@xfluxapi.com.</p>
  `;
  return sendWithResend({
    to: options.to,
    subject: "Quick request: product feedback for XFlux",
    html,
  });
}
