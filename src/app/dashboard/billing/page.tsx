import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLANS } from "@/lib/constants";
import { PlanSelector } from "@/components/billing/plan-selector";
import { Badge } from "@/components/ui/badge";
import { PLAN_LIMITS } from "@/lib/quota";
import { formatNumber } from "@/lib/utils";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  if (!user) return null;

  const limit = PLAN_LIMITS[user.planTier];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-zinc-400">Manage your subscription and upgrade your plan</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 py-4">
        <div>
          <p className="text-sm text-zinc-500">Current plan</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-semibold text-white">{user.planTier}</span>
            <Badge variant="sky">Active</Badge>
          </div>
        </div>
        <div className="h-8 w-px bg-zinc-800 hidden sm:block" />
        <div>
          <p className="text-sm text-zinc-500">Monthly quota</p>
          <p className="text-lg font-semibold text-white mt-1">
            {formatNumber(user.quotaUsed)} / {formatNumber(limit)} used
          </p>
        </div>
      </div>

      <PlanSelector plans={PLANS} currentPlanId={user.planTier} />
    </div>
  );
}
