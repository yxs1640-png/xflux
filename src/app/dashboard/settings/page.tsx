import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateOnly } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isBillingCheckoutEnabled } from "@/lib/billing-config";
import { PAID_PLAN_COMING_SOON_LABEL } from "@/lib/constants";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  if (!user) return null;

  const checkoutEnabled = isBillingCheckoutEnabled();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400">Manage your account and subscription</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-zinc-500">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-zinc-500">Name</label>
              <p className="text-white">{user.name || "—"}</p>
            </div>
            <div>
              <label className="text-sm text-zinc-500">Member since</label>
              <p className="text-white">{formatDateOnly(user.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Current plan and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Current Plan</p>
                <Badge variant="sky" className="mt-1">{user.planTier}</Badge>
              </div>
              {checkoutEnabled ? (
                <Link href="/dashboard/billing">
                  <Button variant="outline" size="sm">
                    Upgrade
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  {PAID_PLAN_COMING_SOON_LABEL}
                </Button>
              )}
            </div>
            <p className="text-sm text-zinc-500">
              {user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing"
                ? "Billed monthly via Stripe. Manage payment method or cancel anytime."
                : checkoutEnabled
                  ? "Upgrade on the billing page to unlock higher limits."
                  : "Paid plans are coming soon. The Free tier is fully available."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
