import { PlanTier } from "@prisma/client";
import { isActiveSubscriptionStatus } from "./billing";
import { formatDateOnly } from "./utils";

type BillingUserFields = {
  planTier: PlanTier;
  pendingPlanTier: PlanTier | null;
  subscriptionStatus: string | null;
  subscriptionPeriodEnd: Date | null;
  planChangeEffectiveAt: Date | null;
};

export function isCancelAtPeriodEnd(user: BillingUserFields): boolean {
  return (
    user.pendingPlanTier === PlanTier.FREE &&
    isActiveSubscriptionStatus(user.subscriptionStatus)
  );
}

export function getBillingPeriodDisplay(
  user: BillingUserFields
): { label: string; date: Date } | null {
  const end = user.planChangeEffectiveAt ?? user.subscriptionPeriodEnd;
  if (!end || !isActiveSubscriptionStatus(user.subscriptionStatus)) return null;

  if (isCancelAtPeriodEnd(user)) {
    return { label: "Access until", date: end };
  }

  return { label: "Renews on", date: end };
}

export function getSubscriptionBadgeDisplay(user: BillingUserFields): {
  text: string;
  variant: "default" | "success" | "warning" | "sky";
} {
  if (isCancelAtPeriodEnd(user)) {
    const end = user.planChangeEffectiveAt ?? user.subscriptionPeriodEnd;
    const dateStr = end ? formatDateOnly(end) : "period end";
    return { text: `Cancels ${dateStr}`, variant: "warning" };
  }

  const status = user.subscriptionStatus;
  if (status === "active") return { text: "Active", variant: "sky" };
  if (status === "trialing") return { text: "Trial", variant: "sky" };
  if (status === "past_due") return { text: "Past due", variant: "warning" };
  if (status === "canceled") return { text: "Canceled", variant: "default" };
  if (user.planTier === PlanTier.FREE) return { text: "Free tier", variant: "default" };

  return { text: status ?? "Active", variant: "default" };
}
