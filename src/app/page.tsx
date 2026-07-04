import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { Features } from "@/components/landing/features";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;
  const planHref = isLoggedIn ? "/dashboard/billing" : "/register";
  const pricingHref = isLoggedIn ? "/dashboard/billing" : "/pricing";
  const ctaHref = isLoggedIn ? "/dashboard" : "/register";

  return (
    <>
      <Header />
      <main>
        <Hero isLoggedIn={isLoggedIn} />
        <StatsBar />
        <Features />

        <section className="py-24 bg-zinc-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Simple, transparent pricing</h2>
              <p className="mt-4 text-zinc-400">Start free, scale as you grow</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={plan.highlighted ? "border-sky-500/50 ring-1 ring-sky-500/20" : ""}
                >
                  <CardHeader>
                    {plan.highlighted && (
                      <span className="text-xs font-medium text-sky-400 mb-2">Most Popular</span>
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-white">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && <span>/mo</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-400 mb-4">
                      {plan.quota} API calls/mo · {plan.monitors} monitors
                    </p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                          <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={planHref}>
                      <Button
                        variant={plan.highlighted ? "primary" : "outline"}
                        className="w-full"
                        size="sm"
                      >
                        {isLoggedIn ? "Upgrade" : plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href={pricingHref} className="text-sm text-sky-400 hover:text-sky-300">
                View full pricing details →
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to build with XFlux?
            </h2>
            <p className="text-zinc-400 mb-8">
              {isLoggedIn
                ? "Your API key is ready. Head to the dashboard to get started."
                : "Get your API key in under a minute. 1,000 free calls every month."}
            </p>
            <Link href={ctaHref}>
              <Button size="lg">
                {isLoggedIn ? "Open Dashboard" : "Create Free Account"}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
