import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLANS, getPlanDisplayName } from "@/lib/constants";
import { PlanSelector } from "@/components/billing/plan-selector";
import { BillingStatusBanner } from "@/components/billing/billing-status-banner";
import { ManageBillingButton } from "@/components/billing/manage-billing-button";
import { Badge } from "@/components/ui/badge";
import { PLAN_LIMITS } from "@/lib/quota";
import { isActiveSubscriptionStatus } from "@/lib/billing";
import { BillingComingSoonBanner } from "@/components/billing/billing-coming-soon-banner";
import { isBillingCheckoutEnabled, isPaidBillingAvailable } from "@/lib/billing-config";
import { isStripeConfigured } from "@/lib/stripe";
import { formatNumber, formatDateOnly } from "@/lib/utils";

function subscriptionBadgeVariant(status: string | null | undefined) {
  if (status === "active" || status === "trialing") return "sky" as const;
  if (status === "past_due") return "warning" as const;
  return "default" as const;
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  if (!user) return null;

  const limit = PLAN_LIMITS[user.planTier];
  const checkoutEnabled = isBillingCheckoutEnabled();
  const stripeEnabled = isPaidBillingAvailable();
  const hasActiveSubscription = isActiveSubscriptionStatus(user.subscriptionStatus);

  return (
    <div>
      <Suspense fallback={null}>
        <BillingStatusBanner />
      </Suspense>

      {!checkoutEnabled && <BillingComingSoonBanner />}

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
            <Badge variant={subscriptionBadgeVariant(user.subscriptionStatus)}>
              {user.subscriptionStatus || (user.planTier === "FREE" ? "Free tier" : "Active")}
            </Badge>
          </div>
        </div>
        <div className="h-8 w-px bg-zinc-800 hidden sm:block" />
        <div>
          <p className="text-sm text-zinc-500">Monthly quota</p>
          <p className="text-lg font-semibold text-white mt-1">
            {formatNumber(user.quotaUsed)} / {formatNumber(limit)} used
          </p>
        </div>
        {user.subscriptionPeriodEnd && hasActiveSubscription && (
          <>
            <div className="h-8 w-px bg-zinc-800 hidden sm:block" />
            <div>
              <p className="text-sm text-zinc-500">Renews on</p>
              <p className="text-lg font-semibold text-white mt-1">
                {formatDateOnly(user.subscriptionPeriodEnd)}
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
      />
    </div>
  );
}
