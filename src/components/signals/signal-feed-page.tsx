import Link from "next/link";
import { ArrowRight, Clock, Lightbulb, Radar, RefreshCw, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SignalTopicConfig } from "@/lib/signals/topics";
import { SIGNAL_TOPICS } from "@/lib/signals/topics";
import type { SignalFeed } from "@/lib/signals/types";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatFetchedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

type SignalPageProps = {
  feed: SignalFeed;
  topic: SignalTopicConfig;
};

export function SignalFeedPage({ feed, topic }: SignalPageProps) {
  const otherTopics = SIGNAL_TOPICS.filter((t) => t.slug !== topic.slug);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-10">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm mb-6",
                topic.badgeClass
              )}
            >
              <Sparkles className="h-4 w-4" />
              Live signal digest · refreshed every 2 min
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
                Updated {formatFetchedAt(feed.fetchedAt)}
              </span>
              <span>·</span>
              <span>{feed.accountCount} accounts + live search</span>
              <span>·</span>
              <Link href="/signals" className="text-sky-400 hover:text-sky-300">
                All topics
              </Link>
            </div>
          </div>

          <Card className="mb-8 border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                Brief
              </CardTitle>
              <CardDescription className="text-base text-zinc-300 font-medium">
                {feed.brief.headline}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {feed.brief.themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {feed.brief.themes.map((theme) => (
                    <Badge key={theme.label} variant="sky">
                      {theme.label} · {theme.count}
                    </Badge>
                  ))}
                </div>
              )}

              {feed.brief.highlights.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wide">
                    Who said what
                  </h3>
                  <ul className="space-y-3">
                    {feed.brief.highlights.map((line) => (
                      <li
                        key={line}
                        className="text-sm text-zinc-300 border-l-2 border-sky-500/40 pl-4 leading-relaxed"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-2 uppercase tracking-wide">
                  What it means
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feed.brief.synthesis}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wide">
                  What to do
                </h3>
                <ul className="space-y-2">
                  {feed.brief.guidance.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-zinc-400">
                      <ArrowRight className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">Live feed</h2>
            <span className="text-xs text-zinc-500">{feed.items.length} posts</span>
          </div>

          <div className="space-y-4 mb-12">
            {feed.items.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-zinc-500 text-sm">
                  No posts returned this cycle — upstream may be rate-limited. Page auto-refreshes.
                </CardContent>
              </Card>
            ) : (
              feed.items.map((item) => (
                <Card key={item.id} className="hover:border-zinc-700 transition-colors">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-sky-400 font-medium">@{item.username}</span>
                        <span className="text-zinc-600 mx-2">·</span>
                        <span className="text-zinc-500 text-sm">{item.displayName}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="default" className="text-[10px]">
                          {item.source}
                        </Badge>
                        <span className="text-xs text-zinc-600 inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line line-clamp-6">
                      {item.text}
                    </p>
                    <a
                      href={item.tweetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-xs text-sky-400 hover:text-sky-300"
                    >
                      View on X →
                    </a>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {otherTopics.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {otherTopics.map((t) => (
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
            </div>
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
