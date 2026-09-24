import Link from "next/link";
import { ArrowRight, Webhook } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LEGAL } from "@/lib/legal-config";
import { Button } from "@/components/ui/button";

export async function ProductOverview() {
  const t = await getTranslations("productOverview");

  return (
    <section className="py-24 bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">{t("restTitle")}</h3>
            <p className="text-sm text-zinc-400 mb-4">{t("restDesc")}</p>
            <pre className="rounded-lg bg-zinc-900 border border-zinc-800 p-4 text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
{`# Profile lookup
curl ${LEGAL.website}/api/v1/users/elonmusk \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

# Search recent posts
curl "${LEGAL.website}/api/v1/search?q=from:elonmusk&limit=10" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"

# User timeline
curl "${LEGAL.website}/api/v1/users/elonmusk/tweets?limit=10" \\
  -H "Authorization: Bearer xflux_YOUR_KEY"`}
            </pre>
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 mt-4"
            >
              {t("restLink")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Webhook className="h-5 w-5 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">{t("monitorsTitle")}</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">{t("monitorsDesc")}</p>
            <pre className="rounded-lg bg-zinc-900 border border-zinc-800 p-4 text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
{`POST https://your-app.com/webhooks/xflux
X-XFlux-Event: monitor.hit
X-XFlux-Signature: sha256=...

{
  "event": "monitor.hit",
  "monitor": { "targetUsername": "elonmusk" },
  "tweet": { "id": "...", "text": "..." }
}`}
            </pre>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                href="/twitter-webhook"
                className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300"
              >
                {t("webhookLink")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/use-cases/trading-alerts"
                className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300"
              >
                {t("tradingLink")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950/80 p-6">
          <h3 className="text-base font-semibold text-white mb-4 text-center">{t("workflowTitle")}</h3>
          <ol className="grid gap-4 sm:grid-cols-3 text-sm">
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <span className="text-sky-400 font-medium">{t("step1Title")}</span>
              <p className="mt-2 text-zinc-400">{t("step1Desc")}</p>
            </li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <span className="text-sky-400 font-medium">{t("step2Title")}</span>
              <p className="mt-2 text-zinc-400">{t("step2Desc")}</p>
            </li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <span className="text-sky-400 font-medium">{t("step3Title")}</span>
              <p className="mt-2 text-zinc-400">{t("step3Desc")}</p>
            </li>
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/register?src=homepage_overview">
            <Button size="lg">{t("ctaKey")}</Button>
          </Link>
          <Link href="/docs/api">
            <Button variant="outline" size="lg">
              {t("ctaEndpoints")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
