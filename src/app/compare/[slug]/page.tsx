import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  getAllCompareSlugs,
  getComparePage,
  getComparePages,
} from "@/lib/compare/competitors";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getComparePage(slug, "en");
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: `/compare/${page.slug}`,
    keywords: page.keywords,
  });
}

export default async function CompareSlugPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("compareUi");
  const page = getComparePage(slug, locale);
  if (!page) notFound();

  const others = getComparePages(locale).filter((p) => p.slug !== page.slug);

  return (
    <>
      <FaqJsonLd items={page.faqs} />
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm text-zinc-500 mb-4">
            <Link href="/compare" className="text-sky-400 hover:underline">
              {t("breadcrumb")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-400">{page.competitorName}</span>
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl leading-tight mb-4">
            {page.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-10">{page.description}</p>

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-6">{t("sideBySide")}</h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium" />
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                      {page.competitorName}
                    </th>
                    <th className="px-4 py-3 text-left text-sky-400 font-medium">
                      {t("colXflux")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page.rows.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-800 last:border-0 align-top">
                      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{row.label}</td>
                      <td className="px-4 py-3 text-zinc-500">{row.them}</td>
                      <td className="px-4 py-3 text-zinc-200">{row.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-8 sm:grid-cols-2 mb-14">
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {t("chooseThem", { name: page.competitorName })}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
                {page.whenThem.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">{t("chooseUs")}</h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-zinc-300">
                {page.whenUs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          {page.faqs.length > 0 && (
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-white mb-6">{t("faq")}</h2>
              <dl className="space-y-6">
                {page.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-semibold text-white mb-2">{faq.question}</dt>
                    <dd className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="mb-14">
            <h2 className="text-lg font-semibold text-white mb-4">{t("related")}</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {page.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sky-400 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center mb-14">
            <h2 className="text-xl font-bold text-white mb-2">{t("tryTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">{t("tryDesc")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?src=compare_page">
                <Button size="lg">{t("createAccount")}</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  {t("pricing")}
                </Button>
              </Link>
              <Link href="/twitter-webhook">
                <Button variant="outline" size="lg">
                  {t("webhooks")}
                </Button>
              </Link>
              <Link href="/mcp">
                <Button variant="outline" size="lg">
                  {t("mcp")}
                </Button>
              </Link>
            </div>
          </section>

          {others.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">{t("otherComparisons")}</h2>
              <ul className="space-y-2">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/compare/${p.slug}`}
                      className="text-sm text-sky-400 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
