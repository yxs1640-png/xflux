/**
 * Limited-time Starter (BASIC) first-month trial.
 * Flip STARTER_TRIAL_OFFER_ACTIVE to false and redeploy to end the offer
 * (no Vercel env change required). Optional server override:
 * STARTER_TRIAL_ENABLED=false kills Checkout trials immediately.
 */

/** Master switch — set false when ending the promotional trial. */
export const STARTER_TRIAL_OFFER_ACTIVE = true;

export const STARTER_TRIAL_DAYS = 30;

export const STARTER_TRIAL_CTA = "Start free Starter trial";
export const STARTER_PLAN_CTA = "Start Starter";

/** Shown on pricing cards while the offer is live. */
export const STARTER_TRIAL_FEATURE_LINE = `Limited-time: ${STARTER_TRIAL_DAYS}-day free trial (card required)`;

/**
 * Whether new Checkouts may attach a Starter trial.
 * Client: follows the code constant. Server: also honors STARTER_TRIAL_ENABLED.
 */
export function isStarterTrialOfferActive(): boolean {
  if (!STARTER_TRIAL_OFFER_ACTIVE) return false;
  if (typeof process !== "undefined") {
    const flag = process.env.STARTER_TRIAL_ENABLED?.trim().toLowerCase();
    if (flag === "false") return false;
    if (flag === "true") return true;
  }
  return true;
}

export function starterPlanCta(offerActive = isStarterTrialOfferActive()): string {
  return offerActive ? STARTER_TRIAL_CTA : STARTER_PLAN_CTA;
}
