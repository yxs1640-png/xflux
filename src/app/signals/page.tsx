import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SIGNAL_TOPICS } from "@/lib/signals/topics";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Live X/Twitter Signal Digests by Topic",
  description:
    "Real-time signal digests for AI, crypto, trading, and startups — who posted what on X/Twitter, key themes, and monitors to set up. Powered by XFlux.",
  path: "/signals",
});

export default function SignalsHubPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-300 mb-6">
              <Radar className="h-4 w-4" />
              Live signal digests
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              X/Twitter signals by topic
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              Curated feeds for hot verticals — refreshed every 2 minutes from real accounts and
              search. Each page shows who posted what, what it means, and how to monitor it with
              XFlux.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SIGNAL_TOPICS.map((topic) => (
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
                    <CardDescription className="leading-relaxed">
                      {topic.intro}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-zinc-500 mb-3">
                      Watching {topic.watchAccounts.map((a) => `@${a}`).slice(0, 3).join(", ")}
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
        </div>
      </main>
      <Footer />
    </>
  );
}
