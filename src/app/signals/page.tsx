import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getSignalTopicCount,
  getTopicsByCategory,
  SIGNAL_CATEGORIES,
  SIGNAL_HUB_KEYWORDS,
} from "@/lib/signals/topics";
import {
  HUB_CATEGORY_FEATURED_SLUGS,
  resolveSignalTopics,
} from "@/lib/signals/internal-links";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs, SignalFaqSection } from "@/components/signals/signal-seo-blocks";
import { SignalsHubJsonLd } from "@/components/seo/signals-json-ld";

const TOPIC_COUNT = getSignalTopicCount();

export const metadata = pageMetadata({
  title: `X/Twitter Signal Digests — ${TOPIC_COUNT}+ Live Topics`,
  description:
    "Free live X/Twitter signal digests across AI, crypto, trading, startups, dev, security, and more. See who posted what, dominant themes, and set up account monitors with webhooks.",
  path: "/signals",
  keywords: SIGNAL_HUB_KEYWORDS,
});

const HUB_FAQ = [
  {
    question: "What are XFlux signal digests?",
    answer:
      "Live pages that poll public X/Twitter accounts and search, then summarize who posted what, key themes, and which @handles to monitor — powered by the same API and monitors you can use in XFlux.",
  },
  {
    question: "How is this different from scrolling X?",
    answer:
      "Digests aggregate multiple accounts and search in one view with brief analysis. Monitors go further: they alert you automatically when a specific @username posts, via Dashboard or webhooks.",
  },
  {
    question: "Which topics are available?",
    answer: `${TOPIC_COUNT}+ topics across AI, crypto, markets, startups, developers, security, policy, science, culture, and Twitter API monitoring — each with curated accounts plus live search.`,
  },
  {
    question: "How do I get alerts for an account?",
    answer:
      "Create a free XFlux account, add a monitor for any public @username, and receive hits in the Dashboard. Paid plans from $19/mo add signed HTTP webhooks and faster polling.",
  },
];

export default function SignalsHubPage() {
  return (
    <>
      <SignalsHubJsonLd />
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Signals" }]} />

          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-300 mb-6">
              <Radar className="h-4 w-4" />
              {TOPIC_COUNT} live signal digests
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              X/Twitter signals by topic
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Curated live feeds across {TOPIC_COUNT} verticals — AI, crypto, trading, startups,
              dev, security, and more. Each digest shows who posted what, what it means, and how to
              monitor accounts with XFlux.
            </p>
          </div>

          <nav
            aria-label="Signal categories"
            className="mb-10 flex flex-wrap justify-center gap-2"
          >
            {SIGNAL_CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400 hover:border-sky-500/40 hover:text-sky-300 transition-colors"
              >
                {cat.label}
              </a>
            ))}
          </nav>

          <div className="space-y-14">
            {SIGNAL_CATEGORIES.map((category) => {
              const topics = getTopicsByCategory(category.id);
              if (topics.length === 0) return null;

              const [featuredA, featuredB] = resolveSignalTopics(
                HUB_CATEGORY_FEATURED_SLUGS[category.id]
              );

              return (
                <section key={category.id} id={category.id} aria-labelledby={`${category.id}-heading`}>
                  <div className="mb-6">
                    <h2 id={`${category.id}-heading`} className="text-2xl font-bold text-white">
                      {category.label}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">{category.description}</p>
                    {featuredA && featuredB && (
                      <p className="mt-2 text-sm text-zinc-400">
                        Start with{" "}
                        <Link href={`/signals/${featuredA.slug}`} className="text-sky-400 hover:text-sky-300">
                          {featuredA.title}
                        </Link>{" "}
                        or{" "}
                        <Link href={`/signals/${featuredB.slug}`} className="text-sky-400 hover:text-sky-300">
                          {featuredB.title}
                        </Link>
                        .
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((topic) => (
                      <Link key={topic.slug} href={`/signals/${topic.slug}`}>
                        <Card className="h-full hover:border-sky-500/30 transition-colors cursor-pointer">
                          <CardHeader>
                            <span
                              className={cn(
                                "inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs mb-2",
                                topic.badgeClass
                              )}
                            >
                              {topic.pulseLabel}
                            </span>
                            <CardTitle className="text-lg">{topic.title}</CardTitle>
                            <CardDescription className="leading-relaxed line-clamp-2">
                              {topic.intro}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-zinc-500 mb-3">
                              Watching{" "}
                              {topic.watchAccounts
                                .map((a) => `@${a}`)
                                .slice(0, 3)
                                .join(", ")}
                              {topic.watchAccounts.length > 3 ? "…" : ""}
                            </p>
                            <span className="inline-flex items-center gap-1 text-sm text-sky-400">
                              Open digest
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <SignalFaqSection items={HUB_FAQ} />
        </div>
      </main>
      <Footer />
    </>
  );
}
