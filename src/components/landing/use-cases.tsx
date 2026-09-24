import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Coins,
  LineChart,
  Radar,
  Search,
  Sparkles,
  Target,
  Terminal,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CASE_META = [
  {
    icon: LineChart,
    key: "trading" as const,
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/use-cases/trading-alerts",
  },
  {
    icon: Bot,
    key: "ai" as const,
    capabilities: ["API", "MCP"],
    docHref: "/use-cases/ai-research",
  },
  {
    icon: Coins,
    key: "crypto" as const,
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/use-cases/crypto-alerts",
  },
  {
    icon: Terminal,
    key: "agents" as const,
    capabilities: ["MCP", "API"],
    docHref: "/docs/integrations/mcp",
  },
  {
    icon: Sparkles,
    key: "saas" as const,
    capabilities: ["API"],
    docHref: "/docs/api",
  },
  {
    icon: Target,
    key: "growth" as const,
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/docs/monitors",
  },
  {
    icon: Radar,
    key: "alerts" as const,
    capabilities: ["Monitor", "Webhooks"],
    docHref: "/docs/webhooks",
  },
  {
    icon: Search,
    key: "indie" as const,
    capabilities: ["API", "Monitor"],
    docHref: "/docs/quickstart",
  },
] as const;

function capabilityClass(cap: string) {
  if (cap === "API") return "border-sky-500/20 bg-sky-500/10 text-sky-300";
  if (cap === "Monitor") return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
  if (cap === "MCP") return "border-violet-500/20 bg-violet-500/10 text-violet-300";
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
}

export async function UseCases({
  registerHref = "/register?src=homepage_usecases",
}: {
  registerHref?: string;
}) {
  const t = await getTranslations("useCasesGrid");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-zinc-400 max-w-3xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASE_META.map((useCase) => {
            const k = useCase.key;
            const solutions = [t(`${k}S1`), t(`${k}S2`), t(`${k}S3`)];
            return (
              <Card
                key={k}
                className="flex flex-col hover:border-sky-500/30 transition-colors"
              >
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                      <useCase.icon className="h-5 w-5 text-sky-400" />
                    </div>
                    <Badge variant="default" className="shrink-0">
                      {t(`${k}Audience`)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-snug">{t(`${k}Title`)}</CardTitle>
                  <CardDescription className="text-zinc-400 leading-relaxed">
                    {t(`${k}Problem`)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="space-y-2 mb-4 flex-1">
                    {solutions.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{t(`${k}Unlike`)}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {useCase.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs",
                          capabilityClass(cap)
                        )}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={useCase.docHref}
                    className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    {t(`${k}Doc`)}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-8 text-center">
          <p className="text-zinc-300 mb-2 font-medium">{t("bottomTitle")}</p>
          <p className="text-sm text-zinc-500 mb-6 max-w-2xl mx-auto">{t("bottomDesc")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={registerHref}>
              <Button>
                {t("ctaStart")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs/compare/pricing">
              <Button variant="outline">{t("ctaCompare")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
