import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { pageMetadata } from "@/lib/seo";
import { getAllSlugs, getBlogPost, getBlogPosts, getPost } from "@/lib/blog/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("blogUi");
  const post = getBlogPost(slug, locale);
  if (!post) notFound();

  const others = getBlogPosts(locale).filter((p) => p.slug !== post.slug).slice(0, 4);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        datePublished={post.datePublished}
      />
      <FaqJsonLd items={post.faqs} />
      <Header />
      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-sm text-zinc-500 mb-4">
            <Link href="/blog" className="text-sky-400 hover:underline">
              {t("breadcrumb")}
            </Link>
            <span className="mx-2">/</span>
            <time dateTime={post.datePublished}>{post.datePublished}</time>
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-10">{post.description}</p>

          <div className="space-y-10 mb-14">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)} className="text-zinc-400 text-sm leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
                {section.code ? (
                  <pre className="mt-4 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300 leading-relaxed">
                    <code>{section.code}</code>
                  </pre>
                ) : null}
              </section>
            ))}
          </div>

          {post.faqs.length > 0 && (
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-white mb-6">{t("faq")}</h2>
              <dl className="space-y-6">
                {post.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-semibold text-white mb-2">{faq.question}</dt>
                    <dd className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center mb-14">
            <h2 className="text-xl font-bold text-white mb-2">{t("buildTitle")}</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">{t("buildDesc")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?src=blog_post">
                <Button size="lg">{t("createAccount")}</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  {t("viewPricing")}
                </Button>
              </Link>
            </div>
          </section>

          {others.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">{t("moreFromBlog")}</h2>
              <ul className="space-y-3">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-sm text-sky-400 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
