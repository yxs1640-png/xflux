import Link from "next/link";
import { Bell, Check, Shield, Webhook, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Twitter Webhook Integration — X/Twitter Account Monitors",
  description:
    "Twitter webhook integration for X/Twitter account monitors. Receive signed HTTP POST alerts when tracked accounts publish new tweets. HMAC-SHA256 verified. Starter plan from $19/mo.",
  path: "/twitter-webhook",
});

export default async function TwitterWebhookPage() {
  const t = await getTranslations("twitterWebhook");

  const steps = [
    { title: t("step1Title"), description: t("step1Desc") },
    { title: t("step2Title"), description: t("step2Desc") },
    { title: t("step3Title"), description: t("step3Desc") },
  ];

  const compare = [
    { label: t("diyRow1Label"), diy: t("diyRow1Diy"), xflux: t("diyRow1Xflux") },
    { label: t("diyRow2Label"), diy: t("diyRow2Diy"), xflux: t("diyRow2Xflux") },
    { label: t("diyRow3Label"), diy: t("diyRow3Diy"), xflux: t("diyRow3Xflux") },
    { label: t("diyRow4Label"), diy: t("diyRow4Diy"), xflux: t("diyRow4Xflux") },
  ];

  const streamCompare = [
    { label: t("streamRow1Label"), official: t("streamRow1Official"), xflux: t("streamRow1Xflux") },
    { label: t("streamRow2Label"), official: t("streamRow2Official"), xflux: t("streamRow2Xflux") },
    { label: t("streamRow3Label"), official: t("streamRow3Official"), xflux: t("streamRow3Xflux") },
    { label: t("streamRow4Label"), official: t("streamRow4Official"), xflux: t("streamRow4Xflux") },
  ];

  const benefits = [
    { icon: Bell, title: t("benefitAlertsTitle"), text: t("benefitAlertsText") },
    { icon: Shield, title: t("benefitSignedTitle"), text: t("benefitSignedText") },
    { icon: Zap, title: t("benefitNoTierTitle"), text: t("benefitNoTierText") },
  ];

  const trustItems = [t("trustCalls"), t("trustCard"), t("trustDocs")];

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-400 mb-6">
              <Webhook className="h-4 w-4" />
              {t("badge")}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {t.rich("subtitle", {
                strong: (chunks) => <strong className="text-zinc-200">{chunks}</strong>,
              })}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=twitter_webhook_landing">
                <Button size="lg">{t("ctaStart")}</Button>
              </Link>
              <Link href="/docs/webhooks">
                <Button variant="outline" size="lg">
                  {t("ctaDocs")}
                </Button>
              </Link>
              <Link href="/docs/integrations/make">
                <Button variant="outline" size="lg">
                  {t("ctaMake")}
                </Button>
              </Link>
              <Link href="/use-cases/trading-alerts">
                <Button variant="outline" size="lg">
                  {t("ctaTrading")}
                </Button>
              </Link>
              <Link href="/signals">
                <Button variant="outline" size="lg">
                  {t("ctaSignals")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {benefits.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-sky-400 mb-2" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">{t("howTitle")}</h2>
            <ol className="space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-400">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">{t("payloadTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-4">
              {t("payloadBlurbBefore")}{" "}
              <code className="text-zinc-300">monitor.hit</code> {t("payloadBlurbAfter")}{" "}
              <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
                {t("payloadDocsLink")}
              </Link>{" "}
              {t("payloadBlurbEnd")}
            </p>
            <CodeBlock>{`POST https://your-server.com/webhooks/xflux
Content-Type: application/json
X-XFlux-Event: monitor.hit
X-XFlux-Signature: sha256=...

{
  "event": "monitor.hit",
  "monitor": { "targetUsername": "elonmusk" },
  "tweet": {
    "id": "1234567890",
    "text": "Hello world",
    "authorUsername": "elonmusk"
  },
  "detectedAt": "2026-07-31T12:00:05.000Z"
}`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">{t("diyTitle")}</h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium" />
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">{t("diyColDiy")}</th>
                    <th className="px-4 py-3 text-left text-sky-400 font-medium">{t("diyColXflux")}</th>
                  </tr>
                </thead>
                <tbody>
                  {compare.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-800 last:border-0">
                      <td className="px-4 py-3 text-zinc-300">{row.label}</td>
                      <td className="px-4 py-3 text-zinc-500">{row.diy}</td>
                      <td className="px-4 py-3 text-zinc-200">{row.xflux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">{t("streamTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-4">{t("streamBlurb")}</p>
            <div className="overflow-x-auto rounded-xl border border-zinc-800 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium" />
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                      {t("streamColOfficial")}
                    </th>
                    <th className="px-4 py-3 text-left text-sky-400 font-medium">
                      {t("streamColXflux")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {streamCompare.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-800 last:border-0">
                      <td className="px-4 py-3 text-zinc-300">{row.label}</td>
                      <td className="px-4 py-3 text-zinc-500">{row.official}</td>
                      <td className="px-4 py-3 text-zinc-200">{row.xflux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-zinc-500">
              {t("tradingWorkflows")}{" "}
              <Link href="/use-cases/trading-alerts" className="text-sky-400 hover:underline">
                {t("macroFlowLink")}
              </Link>{" "}
              ·{" "}
              <Link href="/docs/guides/trading-keywords" className="text-sky-400 hover:underline">
                {t("keywordTemplatesLink")}
              </Link>
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">{t("pricingTitle")}</h2>
            <Card className="border-sky-500/20">
              <CardHeader>
                <CardTitle>{t("pricingCardTitle")}</CardTitle>
                <CardDescription>{t("pricingCardDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Link href="/pricing">
                  <Button>{t("viewPlans")}</Button>
                </Link>
                <Link href="/docs/monitors">
                  <Button variant="outline">{t("monitorDocs")}</Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">{t("readyTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">{t("readyDesc")}</p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-400 mb-6">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-sky-400" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register?src=twitter_webhook_landing">
              <Button size="lg">{t("createAccount")}</Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
