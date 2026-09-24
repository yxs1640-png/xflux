"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";

export function HeroActions({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  function trackCta(cta: string, destination: string) {
    trackClientEvent(AnalyticsEvents.CTA_CLICKED, {
      cta,
      location: "hero",
      destination,
    });
  }

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link
        href={isLoggedIn ? "/dashboard" : "/register?src=homepage_hero"}
        onClick={() =>
          trackCta(
            isLoggedIn ? "go_dashboard" : "start_free",
            isLoggedIn ? "/dashboard" : "/register?src=homepage_hero"
          )
        }
      >
        <Button size="lg" className="min-w-[180px]">
          {isLoggedIn ? t("ctaGoDashboard") : t("ctaStartFree")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      <Link
        href="/docs/quickstart"
        onClick={() => trackCta("see_api", "/docs/quickstart")}
      >
        <Button variant="outline" size="lg" className="min-w-[180px]">
          {t("ctaSeeApi")}
        </Button>
      </Link>
      <Link
        href={isLoggedIn ? "/dashboard/billing" : "/pricing"}
        onClick={() =>
          trackCta(
            isLoggedIn ? "view_billing" : "see_pricing",
            isLoggedIn ? "/dashboard/billing" : "/pricing"
          )
        }
      >
        <Button variant="ghost" size="lg" className="min-w-[140px] text-zinc-400">
          {isLoggedIn ? tc("billing") : t("ctaPricing")}
        </Button>
      </Link>
    </div>
  );
}
