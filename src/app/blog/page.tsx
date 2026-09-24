import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata = pageMetadata({
  title: "Blog — X/Twitter API Guides",
  description:
    "Practical guides on X/Twitter API pricing, alternatives, account monitor webhooks, trading alerts, MCP for Claude/Cursor, and Python/Node examples with XFlux.",
  path: "/blog",
  keywords: [
    "xflux blog",
    "twitter api guides",
    "x api pricing",
    "twitter webhook tutorial",
  ],
});

export default function BlogHubPage() {
  const posts = [...BLOG_POSTS].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Blog</h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              Pricing, alternatives, webhooks, trading alerts, MCP, and code samples — written for
              developers building on public X/Twitter data.
            </p>
          </div>

          <ul className="space-y-6 mb-16">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors"
              >
                <p className="text-xs text-zinc-500 mb-2">
                  <time dateTime={post.datePublished}>{post.datePublished}</time>
                </p>
                <h2 className="text-xl font-semibold text-white mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-sky-400 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{post.description}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-sky-400 hover:underline"
                >
                  Read article →
                </Link>
              </li>
            ))}
          </ul>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Try XFlux free</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              1,000 API calls/month and 1 account monitor — no credit card. Upgrade for signed
              webhooks from $19/mo.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?src=blog_hub">
                <Button size="lg">Create free account</Button>
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
