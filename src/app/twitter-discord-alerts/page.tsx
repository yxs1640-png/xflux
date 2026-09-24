import Link from "next/link";
import { MessageSquare, Webhook, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Twitter → Discord Alerts via Webhooks",
  description:
    "Send X/Twitter account alerts to Discord with XFlux monitors: Make.com Custom Webhook → Discord, or your bot verifying HMAC-signed webhooks. From $19/mo.",
  path: "/twitter-discord-alerts",
  keywords: [
    "twitter discord alerts",
    "x discord webhook",
    "twitter to discord bot",
    "make.com discord twitter",
    "xflux discord",
  ],
});

export default async function TwitterDiscordAlertsPage() {
  const t = await getTranslations("discordLanding");

  const faqs = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
  ];

  const steps = [
    { title: t("step1Title"), text: t("step1Text") },
    { title: t("step2Title"), text: t("step2Text") },
    { title: t("step3Title"), text: t("step3Text") },
  ];

  const cards = [
    { icon: Webhook, title: t("card1Title"), text: t("card1Text") },
    { icon: MessageSquare, title: t("card2Title"), text: t("card2Text") },
    { icon: Zap, title: t("card3Title"), text: t("card3Text") },
  ];

  return (
    <>
      <FaqJsonLd items={faqs} />
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300 mb-6">
              <MessageSquare className="h-4 w-4" />
              {t("badge")}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {t("subtitleBefore")}{" "}
              <strong className="text-zinc-200">{t("subtitleStrong")}</strong>{" "}
              {t("subtitleAfter")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=discord_alerts">
                <Button size="lg">{t("ctaStart")}</Button>
              </Link>
              <Link href="/docs/integrations/make">
                <Button variant="outline" size="lg">
                  {t("ctaMake")}
                </Button>
              </Link>
              <Link href="/twitter-webhook">
                <Button variant="outline" size="lg">
                  {t("ctaWebhooks")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {cards.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-indigo-400 mb-2" />
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
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">{t("optionATitle")}</h2>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              {t("optionABlurbBefore")}{" "}
              <strong className="text-white">{t("optionAStrong")}</strong>{" "}
              {t("optionABlurbAfter")}{" "}
              <Link href="/docs/integrations/make" className="text-sky-400 hover:underline">
                {t("optionALink")}
              </Link>
              .
            </p>
            <CodeBlock>{`@handle posts (optional keyword match)
        ↓
XFlux monitor.hit (signed POST)
        ↓
Make.com Custom Webhook
        ↓
Discord channel message`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">{t("optionBTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              {t("optionBBlurbBefore")}{" "}
              <code className="text-zinc-300">X-XFlux-Signature</code>
              {t("optionBBlurbMid")}{" "}
              <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
                {t("optionBWebhooks")}
              </Link>
              . {t("optionBOverview")}{" "}
              <Link href="/twitter-webhook" className="text-sky-400 hover:underline">
                /twitter-webhook
              </Link>
              .
            </p>
            <CodeBlock>{`// Pseudocode
app.post("/webhooks/xflux", rawBodyMiddleware, (req, res) => {
  if (!verifyHmac(secret, timestamp, rawBody, signature)) {
    return res.status(401).end();
  }
  const event = JSON.parse(rawBody);
  if (event.event === "monitor.hit") {
    discord.channels.send(\`@\${event.tweet.authorUsername}: \${event.tweet.text}\`);
  }
  res.status(200).send("ok");
});`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">{t("faqTitle")}</h2>
            <dl className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-white mb-2">{faq.question}</dt>
                  <dd className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">{t("readyTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              {t("readyDesc")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?src=discord_alerts_cta">
                <Button size="lg">{t("createAccount")}</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  {t("pricing")}
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" size="lg">
                  {t("compare")}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
