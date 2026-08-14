import { QuotaUpsellBanner } from "@/components/billing/quota-upsell-banner";
import { isPaidBillingAvailable } from "@/lib/billing-config";
import { getDashboardUserRecord } from "@/lib/dashboard-session";

export async function QuotaUpsellBannerSlot() {
  if (!isPaidBillingAvailable()) return null;

  const user = await getDashboardUserRecord();
  if (!user || user.planTier !== "FREE" || user.quotaUsed <= 0) return null;

  return <QuotaUpsellBanner quotaUsed={user.quotaUsed} quotaLimit={user.quotaLimit} />;
}
