import { Suspense } from "react";
import { PLANS, getPlanDisplayName } from "@/lib/constants";
import { PlanSelector } from "@/components/billing/plan-selector";
import { BillingStatusBanner } from "@/components/billing/billing-status-banner";
import { ManageBillingButton } from "@/components/billing/manage-billing-button";
import { Badge } from "@/components/ui/badge";
import { PLAN_LIMITS } from "@/lib/quota";
import { isActiveSubscriptionStatus } from "@/lib/billing";
import {
  getBillingPeriodDisplay,
  getSubscriptionBadgeDisplay,
  isCancelAtPeriodEnd,
} from "@/lib/billing-display";
import { BillingComingSoonBanner } from "@/components/billing/billing-coming-soon-banner";
import { BillingActivationHint } from "@/components/billing/billing-activation-hint";
import { PlanChangeBannerSlot } from "@/components/billing/plan-change-banner-slot";
import { isBillingCheckoutEnabled, isPaidBillingAvailable } from "@/lib/billing-config";
import { isStripeConfigured } from "@/lib/stripe";
import { formatNumber, formatDateOnly } from "@/lib/utils";
import { getDashboardUserRecord } from "@/lib/dashboard-session";

export default async function BillingPage() {
  const user = await getDashboardUserRecord();

  if (!user) return null;

  const limit = PLAN_LIMITS[user.planTier];
  const checkoutEnabled = isBillingCheckoutEnabled();
  const stripeEnabled = isPaidBillingAvailable();
  const hasActiveSubscription = isActiveSubscriptionStatus(user.subscriptionStatus);
  const cancelScheduled = isCancelAtPeriodEnd(user);
  const subscriptionBadge = getSubscriptionBadgeDisplay(user);
  const billingPeriod = getBillingPeriodDisplay(user);

  return (
    <div>
      <Suspense fallback={null}>
        <BillingStatusBanner />
      </Suspense>

      <PlanChangeBannerSlot />

      {!checkoutEnabled && <BillingComingSoonBanner />}

      <BillingActivationHint quotaUsed={user.quotaUsed} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-zinc-400">Manage your subscription and upgrade your plan</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 py-4">
        <div>
          <p className="text-sm text-zinc-500">Current plan</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-semibold text-white">
              {getPlanDisplayName(user.planTier)}
            </span>
            <Badge variant={subscriptionBadge.variant}>{subscriptionBadge.text}</Badge>
          </div>
          {cancelScheduled && billingPeriod && (
            <p className="mt-1 text-xs text-amber-400/90">
              Canceled — paid access continues until {formatDateOnly(billingPeriod.date)}.
            </p>
          )}
        </div>
        <div className="h-8 w-px bg-zinc-800 hidden sm:block" />
        <div>
          <p className="text-sm text-zinc-500">Monthly quota</p>
          <p className="text-lg font-semibold text-white mt-1">
            {formatNumber(user.quotaUsed)} / {formatNumber(limit)} used
          </p>
        </div>
        {billingPeriod && (
          <>
            <div className="h-8 w-px bg-zinc-800 hidden sm:block" />
            <div>
              <p className="text-sm text-zinc-500">{billingPeriod.label}</p>
              <p className="text-lg font-semibold text-white mt-1">
                {formatDateOnly(billingPeriod.date)}
              </p>
            </div>
          </>
        )}
        {user.stripeCustomerId && (stripeEnabled || hasActiveSubscription) && (
          <div className="ml-auto">
            <ManageBillingButton />
          </div>
        )}
      </div>

      <PlanSelector
        plans={PLANS}
        currentPlanId={user.planTier}
        checkoutEnabled={checkoutEnabled}
        stripeEnabled={stripeEnabled}
        stripeConfigured={isStripeConfigured()}
        hasActiveSubscription={hasActiveSubscription}
        cancelScheduled={cancelScheduled}
      />
    </div>
  );
}
