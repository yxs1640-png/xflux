"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WelcomeFlow } from "@/components/dashboard/welcome-flow";

type WelcomeDashboardShellProps = {
  hasApiCalls: boolean;
  userName: string | null;
  children: React.ReactNode;
};

/** Wraps dashboard home: shows unified welcome flow and hides stats until onboarding starts. */
export function WelcomeDashboardShell({
  hasApiCalls,
  userName,
  children,
}: WelcomeDashboardShellProps) {
  const searchParams = useSearchParams();
  const isWelcomeParam = searchParams.get("welcome") === "1";
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  useEffect(() => {
    if (!isWelcomeParam) setWelcomeDismissed(false);
  }, [isWelcomeParam]);

  const showWelcome = isWelcomeParam && !welcomeDismissed && !hasApiCalls;

  return (
    <>
      {isWelcomeParam && !welcomeDismissed && (
        <WelcomeFlow
          hasApiCalls={hasApiCalls}
          userName={userName}
          onFinish={() => setWelcomeDismissed(true)}
        />
      )}
      {showWelcome ? null : children}
    </>
  );
}
