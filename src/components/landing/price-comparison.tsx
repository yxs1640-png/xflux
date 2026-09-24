import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export async function PriceComparison({
  registerHref = "/register?src=homepage_compare",
}: {
  registerHref?: string;
}) {
  const t = await getTranslations("priceComparison");
  const rows = [
    {
      feature: t("rowPriceFeature"),
      official: t("rowPriceOfficial"),
      xflux: t("rowPriceXflux"),
    },
    {
      feature: t("rowApprovalFeature"),
      official: t("rowApprovalOfficial"),
      xflux: t("rowApprovalXflux"),
    },
    {
      feature: t("rowMonitorsFeature"),
      official: t("rowMonitorsOfficial"),
      xflux: t("rowMonitorsXflux"),
    },
    {
      feature: t("rowFreeFeature"),
      official: t("rowFreeOfficial"),
      xflux: t("rowFreeXflux"),
    },
    {
      feature: t("rowCardFeature"),
      official: t("rowCardOfficial"),
      xflux: t("rowCardXflux"),
    },
  ];

  return (
    <section className="py-24 border-y border-zinc-800 bg-zinc-900/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-3 bg-zinc-900/60 text-sm font-medium">
            <div className="px-4 py-3 text-zinc-500" />
            <div className="px-4 py-3 text-center text-zinc-400 border-l border-zinc-800">
              {t("colOfficial")}
            </div>
            <div className="px-4 py-3 text-center text-sky-400 border-l border-zinc-800">
              {t("colXflux")}
            </div>
          </div>
          {rows.map((row) => (
            <div key={row.feature} className="grid grid-cols-3 border-t border-zinc-800 text-sm">
              <div className="px-4 py-4 text-zinc-300">{row.feature}</div>
              <div className="px-4 py-4 text-center text-zinc-500 border-l border-zinc-800 flex items-center justify-center gap-2">
                <X className="h-4 w-4 shrink-0 text-zinc-600" />
                {row.official}
              </div>
              <div className="px-4 py-4 text-center text-zinc-200 border-l border-zinc-800 flex items-center justify-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-sky-400" />
                {row.xflux}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center space-y-4">
          <Link href={registerHref}>
            <Button size="lg">
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-zinc-500">
            {t("fullBreakdown")}{" "}
            <Link href="/docs/compare/pricing" className="text-sky-400 hover:text-sky-300">
              {t("linkCompare")}
            </Link>
            {" · "}
            <Link href="/use-cases/trading-alerts" className="text-sky-400 hover:text-sky-300">
              {t("linkTrading")}
            </Link>
            {" · "}
            <Link href="/use-cases/ai-research" className="text-sky-400 hover:text-sky-300">
              {t("linkAi")}
            </Link>
            {" · "}
            <Link href="/use-cases/crypto-alerts" className="text-sky-400 hover:text-sky-300">
              {t("linkCrypto")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
