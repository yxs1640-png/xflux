import Link from "next/link";
import { Bot, Radar, Search, Terminal, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/docs/doc-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Research from X/Twitter — Timelines, Search & MCP",
  description:
    "Aggregate AI lab and researcher posts from X/Twitter. Poll timelines, search, and use the XFlux MCP server in Claude or Cursor — free tier to start.",
  path: "/use-cases/ai-research",
  keywords: [
    "ai twitter api",
    "openai anthropic twitter monitor",
    "llm research twitter",
    "twitter rag pipeline",
    "mcp twitter claude",
  ],
});

const EXAMPLE_ACCOUNTS = [
  {
    account: "OpenAI",
    why: "Product launches, research notes, and policy posts from the lab account.",
  },
  {
    account: "AnthropicAI",
    why: "Model releases and safety updates — useful for competitive intel digests.",
  },
  {
    account: "karpathy",
    why: "Practitioner commentary that often leads discussion in AI Twitter.",
  },
];

const WORKFLOW = [
  {
    title: "Pull on demand",
    text: "Use REST or MCP to fetch profiles, timelines, and search results into your notebook or agent.",
  },
  {
    title: "Watch the shortlist",
    text: "Add key @handles as monitors so new posts show up without writing cron jobs.",
  },
  {
    title: "Route digests",
    text: "On Starter+, webhook hits into Slack, email, or your RAG ingest worker.",
  },
];

export default async function AiResearchPage() {
  const t = await getTranslations("useCaseAi");

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-400 mb-6">
              <Bot className="h-4 w-4" />
              {t("badge")}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {t.rich("subtitle", {
                strong: (chunks) => <strong className="text-zinc-200">{chunks}</strong>,
              })}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register?src=ai_research">
                <Button size="lg">{t("ctaStart")}</Button>
              </Link>
              <Link href="/docs/integrations/mcp">
                <Button variant="outline" size="lg">
                  {t("ctaMcp")}
                </Button>
              </Link>
              <Link href="/signals/ai">
                <Button variant="outline" size="lg">
                  {t("ctaSignals")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {[
              {
                icon: Search,
                title: "Search + timelines",
                text: "REST endpoints for profiles, user tweets, and keyword search — Bearer key auth.",
              },
              {
                icon: Terminal,
                title: "MCP for agents",
                text: "npx @xflux/xflux-mcp-server — compact summaries built for agent context windows.",
              },
              {
                icon: Radar,
                title: "Optional monitors",
                text: "Watch a shortlist of lab accounts and review hits in the Dashboard.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-sky-400 mb-2" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Example accounts to poll</h2>
            <div className="space-y-4">
              {EXAMPLE_ACCOUNTS.map((ex) => (
                <div
                  key={ex.account}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
                >
                  <p className="font-medium text-white">@{ex.account}</p>
                  <p className="text-sm text-zinc-400 mt-1">{ex.why}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-500 mt-4">
              Browse what&apos;s posting now on the{" "}
              <Link href="/signals/ai" className="text-sky-400 hover:underline">
                AI &amp; LLM signal digest
              </Link>
              .
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Sample timeline call</h2>
            <CodeBlock>{`curl -G "https://www.xfluxapi.com/api/v1/users/OpenAI/tweets" \\
  -H "Authorization: Bearer xflux_YOUR_KEY" \\
  --data-urlencode "limit=10"`}</CodeBlock>
            <p className="text-sm text-zinc-500 mt-4">
              Or ask Claude/Cursor via MCP:{" "}
              <code className="text-zinc-300">xflux_get_user_tweets</code> with{" "}
              <code className="text-zinc-300">username=OpenAI</code>.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
            <ol className="space-y-6">
              {WORKFLOW.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-400">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <Zap className="h-8 w-8 text-sky-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Ready to build an AI digest?</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              Free tier includes 1,000 API calls/month. Add MCP for agent workflows or upgrade for
              more monitors and live webhooks.
            </p>
            <Link href="/register?src=ai_research_cta">
              <Button size="lg">Create free account</Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
