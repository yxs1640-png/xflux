import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PLANS, PAID_PLAN_COMING_SOON_LABEL } from "@/lib/constants";
import { isBillingCheckoutEnabled } from "@/lib/billing-config";
import { pageMetadata } from "@/lib/seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Transparent X/Twitter API and monitor pricing. Free tier with 1,000 calls/month. Paid plans from $19/mo with webhooks, faster polling, and higher quotas.",
  path: "/pricing",
});

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const checkoutEnabled = isBillingCheckoutEnabled();

  if (session) {
    redirect("/dashboard/billing");
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white">Pricing</h1>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
              Monthly plans for read API access and account monitors. HTTP webhooks on Starter and
              above.
            </p>
            {!checkoutEnabled && (
              <p className="mt-3 text-sm text-amber-200/80">
                Paid plans are coming soon — start with the Free tier today (no credit card).
              </p>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={plan.highlighted ? "border-sky-500/50 ring-1 ring-sky-500/20 scale-105" : ""}
              >
                <CardHeader>
                  {plan.highlighted && (
                    <span className="text-xs font-medium text-sky-400 mb-2">Most Popular</span>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    {plan.price > 0 && <span className="text-zinc-500">/month</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 space-y-2 text-sm text-zinc-400">
                    <p>{plan.quota} API calls/month</p>
                    <p>{plan.monitors} monitor tasks</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                        <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.price === 0 || checkoutEnabled ? (
                    <Link href="/register">
                      <Button
                        variant={plan.highlighted ? "primary" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      {PAID_PLAN_COMING_SOON_LABEL}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
