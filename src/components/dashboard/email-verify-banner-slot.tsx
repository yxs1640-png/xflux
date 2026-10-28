import { EmailVerifyBanner } from "@/components/dashboard/email-verify-banner";
import { getDashboardUserRecord } from "@/lib/dashboard-session";

export async function EmailVerifyBannerSlot() {
  const user = await getDashboardUserRecord();
  if (!user || user.emailVerifiedAt || user.planTier !== "FREE") return null;
  return <EmailVerifyBanner email={user.email} />;
}
