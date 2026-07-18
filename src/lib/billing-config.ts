import "server-only";

import { isStripeConfigured } from "./stripe";
import { stripePlansConfigured } from "./stripe-plans";

/** Self-serve paid checkout (Stripe). Default off in production until explicitly enabled. */
export function isBillingCheckoutEnabled(): boolean {
  const flag = process.env.BILLING_CHECKOUT_ENABLED?.trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export function isPaidBillingAvailable(): boolean {
  return (
    isBillingCheckoutEnabled() &&
    isStripeConfigured() &&
    stripePlansConfigured()
  );
}
