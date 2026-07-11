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

export async function sendFeedbackNotification(
  payload: FeedbackEmailPayload
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(apiKey);
  const subject = `[XFlux Feedback] ${payload.email}${
    payload.coreNeeds.length > 0 ? ` — ${payload.coreNeeds.length} needs` : ""
  }`;

  try {
    const { error } = await resend.emails.send({
      from: FEEDBACK_FROM_EMAIL,
      to: FEEDBACK_NOTIFY_EMAIL,
      replyTo: payload.email,
      subject,
      html: buildFeedbackEmailHtml(payload),
    });

    if (error) {
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Failed to send email",
    };
  }
}
