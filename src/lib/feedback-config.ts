export const CORE_NEED_OPTIONS = [
  { id: "cheaper_pricing", label: "Lower pricing" },
  { id: "more_endpoints", label: "More API endpoints (post, DM, media)" },
  { id: "faster_monitoring", label: "Faster or more reliable account monitors" },
  { id: "better_docs", label: "Better documentation and code examples" },
  { id: "webhook_integrations", label: "Slack, email, or Discord alert integrations" },
  { id: "higher_quotas", label: "Higher API quotas on existing plans" },
  { id: "pay_as_you_go", label: "Pay-as-you-go or top-up credits" },
  { id: "enterprise_features", label: "Teams, SSO, or SLA options" },
] as const;

export const ADOPTION_DRIVER_OPTIONS = [
  { id: "lower_prices", label: "Lower plan prices" },
  { id: "tweet_posting", label: "Tweet posting API" },
  { id: "dm_automation", label: "DM automation" },
  { id: "more_monitors", label: "More monitor slots per plan" },
  { id: "faster_polling", label: "Shorter minimum poll intervals" },
  { id: "multi_channel_alerts", label: "Email, Slack, or Telegram notifications" },
  { id: "better_search", label: "Advanced search and filters" },
  { id: "official_sdks", label: "Official SDKs (Python, Node, etc.)" },
  { id: "custom_domain", label: "Custom API domain" },
  { id: "usage_analytics", label: "Richer usage analytics in the dashboard" },
] as const;

export type CoreNeedId = (typeof CORE_NEED_OPTIONS)[number]["id"];
export type AdoptionDriverId = (typeof ADOPTION_DRIVER_OPTIONS)[number]["id"];

export const CORE_NEED_IDS = CORE_NEED_OPTIONS.map((o) => o.id);
export const ADOPTION_DRIVER_IDS = ADOPTION_DRIVER_OPTIONS.map((o) => o.id);

export const FEEDBACK_NOTIFY_EMAIL =
  process.env.FEEDBACK_NOTIFY_EMAIL?.trim() || "yxs1640@gmail.com";

export const FEEDBACK_FROM_EMAIL =
  process.env.FEEDBACK_FROM_EMAIL?.trim() || "XFlux Feedback <onboarding@resend.dev>";
