import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Zap } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-5">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">XFlux</span>
            </div>
            <p className="text-sm text-zinc-500">
              {t.rich("tagline", {
                mcp: (chunks) => (
                  <Link href="/docs/integrations/mcp" className="hover:text-white transition-colors">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">{t("product")}</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/signals" className="hover:text-white transition-colors">{t("liveSignals")}</Link></li>
              <li><Link href="/use-cases" className="hover:text-white transition-colors">{t("useCases")}</Link></li>
              <li><Link href="/use-cases/trading-alerts" className="hover:text-white transition-colors">{t("tradingAlerts")}</Link></li>
              <li><Link href="/use-cases/ai-research" className="hover:text-white transition-colors">{t("aiResearch")}</Link></li>
              <li><Link href="/use-cases/crypto-alerts" className="hover:text-white transition-colors">{t("cryptoAlerts")}</Link></li>
              <li><Link href="/predictors" className="hover:text-white transition-colors">{t("smartMoney")}</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">{t("apiDocs")}</Link></li>
              <li><Link href="/twitter-webhook" className="hover:text-white transition-colors">{t("twitterWebhooks")}</Link></li>
              <li><Link href="/docs/integrations/make" className="hover:text-white transition-colors">{t("makeIntegration")}</Link></li>
              <li><Link href="/docs/integrations/mcp" className="hover:text-white transition-colors">{t("mcpServer")}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">{t("pricing")}</Link></li>
              <li><Link href="/feedback" className="hover:text-white transition-colors">{t("feedback")}</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">{t("dashboard")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">{t("signalDigests")}</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/signals/ai" className="hover:text-white transition-colors">{t("aiSignals")}</Link></li>
              <li><Link href="/signals/crypto" className="hover:text-white transition-colors">{t("cryptoSignals")}</Link></li>
              <li><Link href="/signals/trading" className="hover:text-white transition-colors">{t("tradingSignals")}</Link></li>
              <li><Link href="/signals/startups" className="hover:text-white transition-colors">{t("startupSignals")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">{t("features")}</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/twitter-webhook" className="hover:text-white transition-colors">{t("twitterWebhookIntegration")}</Link></li>
              <li>{t("userTweetLookup")}</li>
              <li>{t("searchApi")}</li>
              <li>{t("accountMonitors")}</li>
              <li>
                <Link href="/docs/integrations/mcp" className="hover:text-white transition-colors">
                  {t("mcpForClaude")}
                </Link>
              </li>
              <li>{t("httpWebhooksPaid")}</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">{t("legal")}</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/terms" className="hover:text-white transition-colors">{t("terms")}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t("privacy")}</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">{t("refund")}</Link></li>
              <li><Link href="/acceptable-use" className="hover:text-white transition-colors">{t("acceptableUse")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-600">
          <span suppressHydrationWarning>{t("copyright", { year })}</span>
        </div>
      </div>
    </footer>
  );
}
