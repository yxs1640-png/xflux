"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WelcomeFlow } from "@/components/dashboard/welcome-flow";

type WelcomeDashboardShellProps = {
  hasApiCalls: boolean;
  hasMonitors: boolean;
  userName: string | null;
  children: React.ReactNode;
};

/** Wraps dashboard home: monitor-first welcome flow hides stats until onboarding starts. */
export function WelcomeDashboardShell({
  hasApiCalls,
  hasMonitors,
  userName,
  children,
}: WelcomeDashboardShellProps) {
  const searchParams = useSearchParams();
  const isWelcomeParam = searchParams.get("welcome") === "1";
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  useEffect(() => {
    if (!isWelcomeParam) setWelcomeDismissed(false);
  }, [isWelcomeParam]);

  const showWelcome = isWelcomeParam && !welcomeDismissed && !hasMonitors;

  return (
    <>
      {isWelcomeParam && !welcomeDismissed && (
        <WelcomeFlow
          hasApiCalls={hasApiCalls}
          hasMonitors={hasMonitors}
          userName={userName}
          onFinish={() => setWelcomeDismissed(true)}
        />
      )}
      {showWelcome ? null : children}
    </>
  );
}
