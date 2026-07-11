"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";

export function HeroActions({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
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
          {isLoggedIn ? "Go to Dashboard" : "Start Free"}
          <ArrowRight className="h-4 w-4" />
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
        <Button variant="outline" size="lg" className="min-w-[180px]">
          {isLoggedIn ? "Manage billing" : "See pricing"}
        </Button>
      </Link>
    </div>
  );
}
