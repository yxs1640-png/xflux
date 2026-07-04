import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PLANS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

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
              Pay only for what you use. All plans include API access, documentation, and dashboard.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                  <Link href="/register">
                    <Button
                      variant={plan.highlighted ? "primary" : "outline"}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
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
