import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { POPULAR_SIGNAL_SLUGS, resolveSignalTopics } from "@/lib/signals/internal-links";

const POPULAR_TOPICS = resolveSignalTopics(POPULAR_SIGNAL_SLUGS);

export function PopularSignals() {
  if (POPULAR_TOPICS.length === 0) return null;

  return (
    <section className="py-20 border-t border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-300 mb-4">
              <Radar className="h-4 w-4" />
              Live signal digests
            </div>
            <h2 className="text-3xl font-bold text-white">Popular X/Twitter signals</h2>
            <p className="mt-2 text-zinc-400 max-w-2xl">
              Free live digests by topic — who posted what, key themes, and accounts to monitor.
            </p>
          </div>
          <Link href="/signals">
            <Button variant="outline">
              Browse all topics
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_TOPICS.map((topic) => (
            <Link key={topic.slug} href={`/signals/${topic.slug}`}>
              <Card className="h-full hover:border-sky-500/30 transition-colors">
                <CardHeader className="pb-2">
                  <span
                    className={cn(
                      "inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs mb-2",
                      topic.badgeClass
                    )}
                  >
                    {topic.pulseLabel}
                  </span>
                  <CardTitle className="text-base leading-snug">{topic.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">{topic.intro}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-sm text-sky-400">
                    Open digest
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
