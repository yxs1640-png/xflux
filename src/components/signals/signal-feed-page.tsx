import Link from "next/link";
import { ArrowRight, Radar, RefreshCw, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SignalTopicConfig } from "@/lib/signals/topics";
import { getRelatedSignalTopics, getSignalCategoryLabel } from "@/lib/signals/topics";
import { Breadcrumbs, SignalFaqSection } from "@/components/signals/signal-seo-blocks";
import {
  SIGNAL_FRESHNESS_BADGE,
  SIGNAL_FRESHNESS_PAGE_HINT,
} from "@/lib/signals/freshness-copy";

type SignalFeedPageProps = {
  topic: SignalTopicConfig;
  children: React.ReactNode;
};

export function SignalFeedPage({ topic, children }: SignalFeedPageProps) {
  const relatedTopics = getRelatedSignalTopics(topic, 5);
  const categoryLabel = getSignalCategoryLabel(topic.category);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Signals", href: "/signals" },
              { label: topic.title },
            ]}
          />
          <div className="mb-10">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm mb-6",
                topic.badgeClass
              )}
            >
              <Sparkles className="h-4 w-4" />
              {SIGNAL_FRESHNESS_BADGE}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              {topic.title} Signals from X/Twitter
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl leading-relaxed">
              {topic.intro} Powered by the same API and monitors you can use in XFlux.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                {SIGNAL_FRESHNESS_PAGE_HINT}
              </span>
              <span>·</span>
              <span>{topic.watchAccounts.length} accounts + live search</span>
              <span>·</span>
              <Link href="/signals" className="text-sky-400 hover:text-sky-300">
                All topics
              </Link>
            </div>
          </div>

          {children}

          {relatedTopics.length > 0 && (
            <section className="mb-8" aria-label="Related signal digests">
              <h2 className="text-sm font-medium text-zinc-500 mb-3">
                Related {categoryLabel} signals
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedTopics.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/signals/${t.slug}`}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors hover:border-zinc-600",
                      t.badgeClass
                    )}
                  >
                    {t.title}
                  </Link>
                ))}
                <Link
                  href={`/signals#${topic.category}`}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-sky-500/40 hover:text-sky-300 transition-colors"
                >
                  All {categoryLabel} topics →
                </Link>
              </div>
            </section>
          )}

          <Card className="border-sky-500/30 bg-sky-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Radar className="h-5 w-5 text-sky-400" />
                Stop refreshing — monitor these accounts
              </CardTitle>
              <CardDescription>
                We poll{" "}
                {topic.watchAccounts.map((a) => `@${a}`).join(", ")} on a schedule. Get Dashboard
                alerts or signed webhooks when they post.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href={`/register?src=${topic.registerSrc}`}>
                <Button>Start free — add a monitor</Button>
              </Link>
              <Link href="/docs/monitors">
                <Button variant="outline">How monitors work</Button>
              </Link>
            </CardContent>
          </Card>

          <SignalFaqSection items={topic.faq} />

          <p className="mt-8 text-xs text-zinc-600 leading-relaxed">
            Analysis is rule-based for now; a future version will use an AI pipeline on the same
            XFlux data. Posts link to original authors on X. Not financial advice.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
