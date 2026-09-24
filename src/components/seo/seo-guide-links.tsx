"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const LINK_KEYS = [
  { href: "/compare", labelKey: "comparePricing" as const },
  { href: "/use-cases/trading-alerts", labelKey: "tradingAlerts" as const },
  { href: "/use-cases/ai-research", labelKey: "aiResearch" as const },
  { href: "/use-cases/crypto-alerts", labelKey: "cryptoAlerts" as const },
  { href: "/blog", labelKey: "blog" as const },
  { href: "/mcp", labelKey: "mcp" as const },
] as const;

export function SeoGuideLinks({
  className = "",
  heading,
}: {
  className?: string;
  heading?: string;
}) {
  const t = useTranslations("seoGuides");
  const resolvedHeading = heading ?? t("explore");

  return (
    <nav aria-label={resolvedHeading} className={className}>
      <p className="text-sm font-medium text-zinc-400 mb-3">{resolvedHeading}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {LINK_KEYS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
