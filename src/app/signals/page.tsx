import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SIGNAL_HUB_KEYWORDS, SIGNAL_TOPICS } from "@/lib/signals/topics";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs, SignalFaqSection } from "@/components/signals/signal-seo-blocks";
import { SignalsHubJsonLd } from "@/components/seo/signals-json-ld";

export const metadata = pageMetadata({
  title: "X/Twitter Signal Digests — AI, Crypto, Trading & Startups",
  description:
    "Free live X/Twitter signal digests by topic: AI, crypto, trading, and startups. See who posted what, dominant themes, and set up account monitors with webhooks.",
  path: "/signals",
  keywords: SIGNAL_HUB_KEYWORDS,
});

const HUB_FAQ = [
  {
    question: "What are XFlux signal digests?",
    answer:
      "Live pages that poll public X/Twitter accounts and search every two minutes, then summarize who posted what, key themes, and which @handles to monitor — powered by the same API and monitors you can use in XFlux.",
  },
  {
    question: "How is this different from scrolling X?",
    answer:
      "Digests aggregate multiple accounts and search in one view with brief analysis. Monitors go further: they alert you automatically when a specific @username posts, via Dashboard or webhooks.",
  },
  {
    question: "Which topics are available?",
    answer:
      "AI & LLM, crypto & Bitcoin, trading & markets, and startups & founders. Each tracks leading voices plus live search for that vertical.",
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Signals" }]} />

          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-300 mb-6">
              <Radar className="h-4 w-4" />
              Live signal digests
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              X/Twitter signals by topic
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Curated live feeds for AI, crypto, trading, and startups — refreshed every 2 minutes
              from real accounts and search. Each digest shows who posted what, what it means, and
              how to monitor accounts with XFlux.
            </p>
          </div>

          <section aria-labelledby="topics-heading">
            <h2 id="topics-heading" className="sr-only">
              Signal topics
            </h2>
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
                        Open {topic.pulseLabel.toLowerCase()} digest
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <SignalFaqSection items={HUB_FAQ} />
        </div>
      </main>
      <Footer />
    </>
  );
}
