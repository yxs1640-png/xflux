import Link from "next/link";
import { ArrowRight, Check, Webhook } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import type { LongTailLanding } from "@/lib/seo-landings/long-tail";

export function LongTailLandingPage({ page }: { page: LongTailLanding }) {
  return (
    <>
      <FaqJsonLd items={page.faqs} />
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-400 mb-6">
              <Webhook className="h-4 w-4" />
              {page.badge}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              {page.h1}
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {page.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={`/register?src=${page.registerSrc}`}>
                <Button size="lg">Start free</Button>
              </Link>
              <Link href="/docs/webhooks">
                <Button variant="outline" size="lg">
                  Webhook docs
                </Button>
              </Link>
              <Link href="/twitter-webhook">
                <Button variant="outline" size="lg">
                  Webhook overview
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {page.cards.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <Check className="h-8 w-8 text-sky-400 mb-2" />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">{page.howTitle}</h2>
            <ol className="space-y-6">
              {page.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-400">
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

          {page.compareRows && page.compareCols && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-4">{page.compareTitle}</h2>
              {page.compareBlurb && (
                <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{page.compareBlurb}</p>
              )}
              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50">
                      <th className="px-4 py-3 text-left text-zinc-400 font-medium" />
                      <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                        {page.compareCols.left}
                      </th>
                      <th className="px-4 py-3 text-left text-sky-400 font-medium">
                        {page.compareCols.right}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.compareRows.map((row) => (
                      <tr key={row.label} className="border-b border-zinc-800 last:border-0">
                        <td className="px-4 py-3 text-zinc-300">{row.label}</td>
                        <td className="px-4 py-3 text-zinc-500">{row.left}</td>
                        <td className="px-4 py-3 text-zinc-200">{row.right}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {page.code && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-4">{page.codeTitle}</h2>
              {page.codeBlurb && (
                <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{page.codeBlurb}</p>
              )}
              <CodeBlock>{page.code}</CodeBlock>
            </section>
          )}

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>
            <dl className="space-y-6">
              {page.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-white mb-2">{faq.question}</dt>
                  <dd className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Related guides</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {page.related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300"
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Try account monitors free</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              Free includes 1 monitor and Dashboard hit history. Live webhook delivery starts on
              Starter ($19/mo).
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/register?src=${page.registerSrc}_cta`}>
                <Button size="lg">Create account</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  Pricing
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
