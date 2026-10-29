import { Suspense } from "react";
import { EmailVerifyBanner } from "@/components/dashboard/email-verify-banner";
import { getDashboardUserRecord } from "@/lib/dashboard-session";
import { emailVerifyResendWaitSec } from "@/lib/email-verification";

export async function EmailVerifyBannerSlot() {
  const user = await getDashboardUserRecord();
  if (!user || user.emailVerifiedAt || user.planTier !== "FREE") return null;

  const initialCooldownSec = emailVerifyResendWaitSec(user.emailVerifyExpiresAt);

  return (
    <Suspense fallback={null}>
      <EmailVerifyBanner email={user.email} initialCooldownSec={initialCooldownSec} />
    </Suspense>
  );
}
