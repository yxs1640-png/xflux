"use client";

import { useEffect } from "react";
import { markOnboardingUsageVisited } from "@/lib/onboarding-client";

/** Marks onboarding step 4 complete when the user opens the Usage page. */
export function OnboardingUsageTracker() {
  useEffect(() => {
    markOnboardingUsageVisited();
  }, []);

  return null;
}
