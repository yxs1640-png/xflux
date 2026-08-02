/** Client-side onboarding progress — no DB migration for v1. */

export const ONBOARDING_STORAGE = {
  KEY_SAVED: "xflux_onboarding_key_saved",
  DISMISSED: "xflux_onboarding_dismissed",
  USAGE_VISITED: "xflux_onboarding_usage_visited",
} as const;

export const ONBOARDING_UPDATE_EVENT = "xflux-onboarding-update";

export function readOnboardingClientState() {
  if (typeof window === "undefined") {
    return { keySaved: false, dismissed: false, usageVisited: false };
  }
  return {
    keySaved: localStorage.getItem(ONBOARDING_STORAGE.KEY_SAVED) === "1",
    dismissed: localStorage.getItem(ONBOARDING_STORAGE.DISMISSED) === "1",
    usageVisited: localStorage.getItem(ONBOARDING_STORAGE.USAGE_VISITED) === "1",
  };
}

function notifyOnboardingUpdate() {
  window.dispatchEvent(new Event(ONBOARDING_UPDATE_EVENT));
}

export function markOnboardingKeySaved() {
  localStorage.setItem(ONBOARDING_STORAGE.KEY_SAVED, "1");
  notifyOnboardingUpdate();
}

export function markOnboardingUsageVisited() {
  localStorage.setItem(ONBOARDING_STORAGE.USAGE_VISITED, "1");
  notifyOnboardingUpdate();
}

export function markOnboardingDismissed() {
  localStorage.setItem(ONBOARDING_STORAGE.DISMISSED, "1");
  notifyOnboardingUpdate();
}
