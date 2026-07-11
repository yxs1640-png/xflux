/** Canonical analytics event names — keep in sync with docs/ANALYTICS.md */
export const AnalyticsEvents = {
  // Acquisition
  CTA_CLICKED: "cta_clicked",

  // Auth
  SIGNUP_COMPLETED: "signup_completed",
  LOGIN_COMPLETED: "login_completed",

  // Feedback
  FEEDBACK_SUBMITTED: "feedback_submitted",

  // Billing
  PLAN_SELECTED: "plan_selected",
  CHECKOUT_STARTED: "checkout_started",
  CHECKOUT_COMPLETED: "checkout_completed",
  CHECKOUT_CANCELED: "checkout_canceled",
  SUBSCRIPTION_UPDATED: "subscription_updated",
  SUBSCRIPTION_CANCELED: "subscription_canceled",

  // Product activation
  API_KEY_CREATED: "api_key_created",
  API_KEY_REVOKED: "api_key_revoked",
  MONITOR_CREATED: "monitor_created",
  MONITOR_CHECKED: "monitor_checked",
  WEBHOOK_CONFIGURED: "webhook_configured",
  WEBHOOK_TESTED: "webhook_tested",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

/** Person properties stored on the PostHog user profile */
export interface AnalyticsPersonProperties {
  email?: string;
  name?: string;
  plan_tier?: string;
  signup_source?: string;
  signup_source_detail?: string;
}

export type AnalyticsEventProperties = Record<string, string | number | boolean | string[] | null | undefined>;
