import { ArrowRight, Clock, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSignalFeed } from "@/lib/signals/fetch-signal-feed";
import type { SignalTopicConfig } from "@/lib/signals/topics";
import { SignalTopicJsonLd } from "@/components/seo/signals-json-ld";
import { SignalRefreshButton } from "@/components/signals/signal-refresh-button";

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

type SignalFeedContentProps = {
  topic: SignalTopicConfig;
  fresh?: boolean;
};

export async function SignalFeedContent({ topic, fresh }: SignalFeedContentProps) {
  const feed = await getSignalFeed(topic, { fresh });

  return (
    <>
      <SignalTopicJsonLd topic={topic} feed={feed} />

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
          <article aria-label="Signal summary">
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
          </article>
        </CardContent>
      </Card>

      <section aria-labelledby="live-feed-heading">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="live-feed-heading" className="text-xl font-bold text-white">
              Live feed
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Fetched {formatFetchedAt(feed.fetchedAt)} · auto-caches 2 min · post times are from X
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">{feed.items.length} posts</span>
            <SignalRefreshButton slug={topic.slug} />
          </div>
        </div>

        <div className="space-y-4 mb-12">
          {feed.items.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-zinc-500 text-sm">
                No posts returned this cycle — upstream may be rate-limited. Try Refresh now.
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
                      <span
                        className="text-xs text-zinc-600 inline-flex items-center gap-1"
                        title={`Posted on X ${formatFetchedAt(item.createdAt)}`}
                      >
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
      </section>
    </>
  );
}
