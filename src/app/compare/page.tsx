import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { getComparePages } from "@/lib/compare/competitors";

export const metadata = pageMetadata({
  title: "Compare XFlux — vs X API & Alternatives",
  description:
    "Side-by-side comparisons: XFlux vs official X API, Sorsa, and SocialData. Flat plans, monitors, webhooks, and MCP.",
  path: "/compare",
  keywords: [
    "xflux comparison",
    "twitter api alternatives compared",
    "xflux vs x api",
  ],
});

export default async function CompareHubPage() {
  const locale = await getLocale();
  const t = await getTranslations("compareUi");
  const pages = getComparePages(locale);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">{t("title")}</h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          <ul className="space-y-6 mb-16">
            {pages.map((page) => (
              <li
                key={page.slug}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors"
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  <Link
                    href={`/compare/${page.slug}`}
                    className="hover:text-sky-400 transition-colors"
                  >
                    {page.title}
                  </Link>
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{page.description}</p>
                <Link
                  href={`/compare/${page.slug}`}
                  className="text-sm text-sky-400 hover:underline"
                >
                  {t("viewComparison")}
                </Link>
              </li>
            ))}
          </ul>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">{t("startTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">{t("startDesc")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?src=compare_hub">
                <Button size="lg">{t("createAccount")}</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  {t("pricing")}
                </Button>
              </Link>
              <Link href="/docs/compare/pricing">
                <Button variant="outline" size="lg">
                  {t("docsVsOfficial")}
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
