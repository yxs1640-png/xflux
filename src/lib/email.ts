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
  capabilityRequest?: string | null;
  notifyOnShip?: boolean;
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
    <h2>New XFlux capability / feedback request</h2>
    <p><strong>ID:</strong> ${escapeHtml(payload.id)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.name ? `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>` : ""}
    ${payload.planTier ? `<p><strong>Plan:</strong> ${escapeHtml(payload.planTier)}</p>` : ""}
    ${payload.userSource ? `<p><strong>Source:</strong> ${escapeHtml(getUserSourceLabel(payload.userSource))}${payload.userSourceDetail ? ` — ${escapeHtml(payload.userSourceDetail)}` : ""}</p>` : ""}
    ${payload.pageUrl ? `<p><strong>Page:</strong> ${escapeHtml(payload.pageUrl)}</p>` : ""}
    <p><strong>Notify on ship:</strong> ${payload.notifyOnShip === false ? "no" : "yes"}</p>
    <p><strong>Submitted:</strong> ${payload.createdAt.toISOString()}</p>
    <h3>Capability request</h3>
    <p>${
      payload.capabilityRequest
        ? escapeHtml(payload.capabilityRequest).replace(/\n/g, "<br>")
        : "<em>None</em>"
    }</p>
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
  const wishHint = payload.capabilityRequest?.trim()
    ? ` — wish: ${payload.capabilityRequest.trim().slice(0, 60)}${
        payload.capabilityRequest.trim().length > 60 ? "…" : ""
      }`
    : payload.coreNeeds.length > 0
      ? ` — ${payload.coreNeeds.length} needs`
      : "";
  const subject = `[XFlux Feedback] ${payload.email}${wishHint}`;
  return sendWithResend({
    to: FEEDBACK_NOTIFY_EMAIL,
    replyTo: payload.email,
    subject,
    html: buildFeedbackEmailHtml(payload),
  });
}

/** Immediate ack: we heard the wish and will email again when it ships. */
export async function sendFeedbackCapabilityAck(options: {
  to: string;
  name?: string | null;
  capabilityRequest: string;
}): Promise<{ sent: boolean; error?: string }> {
  const greeting = options.name?.trim() ? `Hi ${escapeHtml(options.name.trim())},` : "Hi,";
  const wish = escapeHtml(options.capabilityRequest.trim()).replace(/\n/g, "<br>");
  const html = `
    <p>${greeting}</p>
    <p>Thanks for telling us what you need from XFlux. We recorded your request:</p>
    <blockquote style="border-left:3px solid #38bdf8;padding-left:12px;color:#334155">
      ${wish}
    </blockquote>
    <p>If it relates to public X/Twitter content or workflows, we will do our best to
    build toward it — even when that capability is not on the site today. When a matching
    (or closely related) feature is ready, we will email you so you can start using it.</p>
    <p>Questions anytime: reply to this email or write support@xfluxapi.com.</p>
    <p>— XFlux</p>
  `;
  return sendWithResend({
    to: options.to,
    subject: "We received your XFlux request — we'll email you when it's ready",
    html,
  });
}

/** Ops: capability shipped — invite the requester to use it. */
export async function sendFeedbackCapabilityReadyEmail(options: {
  to: string;
  name?: string | null;
  capabilityRequest: string;
  productUrl?: string;
  note?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const greeting = options.name?.trim() ? `Hi ${escapeHtml(options.name.trim())},` : "Hi,";
  const wish = escapeHtml(options.capabilityRequest.trim()).replace(/\n/g, "<br>");
  const url = options.productUrl?.trim() || "https://xfluxapi.com/dashboard";
  const note = options.note?.trim()
    ? `<p>${escapeHtml(options.note.trim()).replace(/\n/g, "<br>")}</p>`
    : "";
  const html = `
    <p>${greeting}</p>
    <p>Good news — we have something ready that matches (or closely matches) the request
    you sent us:</p>
    <blockquote style="border-left:3px solid #38bdf8;padding-left:12px;color:#334155">
      ${wish}
    </blockquote>
    ${note}
    <p><a href="${escapeHtml(url)}">Open XFlux and try it</a></p>
    <p>If this is not quite what you meant, reply and tell us — we will keep iterating.</p>
    <p>— XFlux</p>
  `;
  return sendWithResend({
    to: options.to,
    subject: "Your requested XFlux capability is ready to use",
    html,
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
    the API or account monitors, and we'd value hearing what you still need.</p>
    <p>Tell us the X/Twitter capability or workflow you want — even if it is not on the site
    yet. If it relates to public Twitter/X content, we will try to make it real and email you
    when you can use it. Concrete write-ups may also earn
    ${options.rewardCalls.toLocaleString()} API calls for the current period
    (one time per account).</p>
    <p><a href="https://xfluxapi.com/feedback?src=feedback_reward_invite">Tell us what you need</a></p>
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
