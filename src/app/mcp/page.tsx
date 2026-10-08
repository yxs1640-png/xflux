import Link from "next/link";
import { Bot, Check, KeyRound, MessageSquareText, Terminal } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "XFlux MCP — X/Twitter Data for Claude & Cursor",
  description:
    "Connect Claude Desktop or Cursor to XFlux with npx @xflux/xflux-mcp-server. Profiles, search, timelines, Smart Money — not the Figma xflux MCP. Agents: see /llms.txt.",
  path: "/mcp",
  keywords: [
    "xflux mcp",
    "twitter mcp server",
    "claude twitter mcp",
    "cursor mcp x api",
    "xflux mcp server",
    "twitter api for ai agents",
  ],
});

const MCP_CONFIG = `{
  "mcpServers": {
    "xflux": {
      "command": "npx",
      "args": ["-y", "@xflux/xflux-mcp-server"],
      "env": {
        "XFLUX_API_KEY": "xflux_your_key_here"
      }
    }
  }
}`;

export default async function McpMarketingPage() {
  const t = await getTranslations("mcpLanding");

  const faqs = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
    { question: t("faq4Q"), answer: t("faq4A") },
  ];

  const cards = [
    { icon: Terminal, title: t("card1Title"), text: t("card1Text") },
    { icon: Bot, title: t("card2Title"), text: t("card2Text") },
    { icon: Check, title: t("card3Title"), text: t("card3Text") },
  ];

  const steps = [
    { icon: KeyRound, title: t("step1Title"), text: t("step1Text") },
    { icon: Terminal, title: t("step2Title"), text: t("step2Text") },
    { icon: MessageSquareText, title: t("step3Title"), text: t("step3Text") },
  ];

  const prompts = [t("prompt1"), t("prompt2"), t("prompt3"), t("prompt4")];

  return (
    <>
      <FaqJsonLd items={faqs} />
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-300 mb-6">
              <Bot className="h-4 w-4" />
              {t("badge")}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {t("subtitleBefore")}{" "}
              <code className="text-zinc-200">@xflux/xflux-mcp-server</code>{" "}
              {t("subtitleAfter")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=mcp_landing">
                <Button size="lg">{t("ctaKey")}</Button>
              </Link>
              <Link href="/docs/integrations/mcp">
                <Button variant="outline" size="lg">
                  {t("ctaDocs")}
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  {t("ctaPricing")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-12 text-sm text-amber-100/90 leading-relaxed">
            <strong className="text-amber-200">{t("disambiguationTitle")}</strong>{" "}
            {t("disambiguationBefore")}{" "}
            <strong className="text-white">{t("disambiguationStrong")}</strong>{" "}
            {t("disambiguationAfter")}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">{t("stepsTitle")}</h2>
            <ol className="grid gap-4 sm:grid-cols-3">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li
                  key={title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/15 text-xs font-semibold text-sky-300">
                      {i + 1}
                    </span>
                    <Icon className="h-4 w-4 text-sky-400" />
                  </div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {cards.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-violet-400 mb-2" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">{t("configTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-4">{t("configBlurb")}</p>
            <CodeBlock>{MCP_CONFIG}</CodeBlock>
            <p className="mt-4 text-zinc-400 text-sm">
              {t("installPackage")}{" "}
              <a
                href="https://www.npmjs.com/package/@xflux/xflux-mcp-server"
                className="text-sky-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @xflux/xflux-mcp-server
              </a>
              . {t("installRegistry")}{" "}
              <code className="text-zinc-300">io.github.yxs1640-png/xflux</code>.
            </p>
            <CodeBlock>{`export XFLUX_API_KEY=xflux_your_key_here
npx -y @xflux/xflux-mcp-server`}</CodeBlock>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">{t("promptsTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-4">{t("promptsBlurb")}</p>
            <ul className="space-y-3">
              {prompts.map((prompt) => (
                <li
                  key={prompt}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-200 leading-relaxed"
                >
                  {prompt}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-16 rounded-xl border border-sky-500/25 bg-sky-500/5 p-6">
            <h2 className="text-xl font-bold text-white mb-2">{t("llmsTitle")}</h2>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{t("llmsBlurb")}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/llms.txt"
                className="rounded-lg border border-sky-500/40 bg-zinc-950/50 px-3 py-2 text-sm text-sky-300 hover:border-sky-400"
              >
                {t("llmsLink")}
              </Link>
              <Link
                href="/llms-full.txt"
                className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-500"
              >
                {t("llmsFullLink")}
              </Link>
            </div>
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
            <h2 className="text-xl font-bold text-white mb-2">{t("ctaBottomTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              {t("ctaBottomDesc")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?src=mcp_landing_cta">
                <Button size="lg">{t("createAccount")}</Button>
              </Link>
              <Link href="/docs/integrations/mcp">
                <Button variant="outline" size="lg">
                  {t("mcpDocs")}
                </Button>
              </Link>
              <Link href="/twitter-webhook">
                <Button variant="outline" size="lg">
                  {t("webhooks")}
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
