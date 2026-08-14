import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

type QuotaUpsellBannerProps = {
  quotaUsed: number;
  quotaLimit: number;
};

function usageTier(
  percent: number,
  quotaUsed: number
): "soft" | "warn" | "critical" | null {
  if (percent >= 100) return "critical";
  if (percent >= 80) return "warn";
  // Show early for engaged free users (e.g. 30+ calls or 20%+ of quota)
  if (percent >= 20 || quotaUsed >= 30) return "soft";
  return null;
}

export function QuotaUpsellBanner({ quotaUsed, quotaLimit }: QuotaUpsellBannerProps) {
  const percent = Math.round((quotaUsed / quotaLimit) * 100);
  const tier = usageTier(percent, quotaUsed);
  if (!tier) return null;

  const remaining = Math.max(0, quotaLimit - quotaUsed);

  const copy =
    tier === "critical"
      ? {
          title: "Monthly quota reached",
          body: `You've used all ${formatNumber(quotaLimit)} free API calls this month. Upgrade to keep building without interruption.`,
          cta: "Upgrade plan",
          className: "border-red-500/30 bg-red-500/10 text-red-100",
          ctaClass: "bg-red-500 hover:bg-red-400 text-white",
        }
      : tier === "warn"
        ? {
            title: `${percent}% of monthly quota used`,
            body: `Only ${formatNumber(remaining)} calls left on Free. Starter gives you 150K calls/mo plus webhooks from $19/mo.`,
            cta: "View plans",
            className: "border-amber-500/30 bg-amber-500/10 text-amber-100",
            ctaClass: "bg-amber-500 hover:bg-amber-400 text-zinc-950",
          }
        : {
            title: "You're actively using the API",
            body: `${formatNumber(quotaUsed)} calls used this month. Paid plans scale to 4M calls/mo with faster monitor polling.`,
            cta: "Compare plans",
            className: "border-sky-500/30 bg-sky-500/10 text-sky-100",
            ctaClass: "bg-sky-500 hover:bg-sky-400 text-white",
          };

  return (
    <div className={cn("mb-6 rounded-lg border px-4 py-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", copy.className)}>
      <div>
        <p className="font-medium">{copy.title}</p>
        <p className="mt-0.5 opacity-90">{copy.body}</p>
      </div>
      <Link
        href="/dashboard/billing?src=quota_upsell"
        className={cn("inline-flex shrink-0 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors", copy.ctaClass)}
      >
        {copy.cta}
      </Link>
    </div>
  );
}
