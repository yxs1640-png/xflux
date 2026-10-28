import { QuotaUpsellBanner } from "@/components/billing/quota-upsell-banner";
import { isPaidBillingAvailable } from "@/lib/billing-config";
import { getDashboardUserRecord } from "@/lib/dashboard-session";
import { getEffectiveApiQuotaLimit } from "@/lib/quota-constants";

export async function QuotaUpsellBannerSlot() {
  if (!isPaidBillingAvailable()) return null;

  const user = await getDashboardUserRecord();
  if (!user || user.planTier !== "FREE" || user.quotaUsed <= 0) return null;
  // Prefer email verify upsell while unverified — avoid double banners.
  if (!user.emailVerifiedAt) return null;

  const quotaLimit = getEffectiveApiQuotaLimit(user);
  return <QuotaUpsellBanner quotaUsed={user.quotaUsed} quotaLimit={quotaLimit} />;
}
