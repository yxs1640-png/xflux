"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Bell, Database, Radar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PATH_META = [
  { icon: Database, step: "1", href: "/docs/quickstart", key: "pull" as const },
  { icon: Radar, step: "2", href: "/docs/monitors", key: "watch" as const },
  { icon: Bell, step: "3", href: "/twitter-webhook", key: "webhook" as const },
] as const;

export function UseCaseStrip() {
  const t = useTranslations("useCases");
  const th = useTranslations("useCaseStrip");

  return (
    <section className="py-20 border-t border-zinc-800/50 bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{th("title")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{th("subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PATH_META.map((path) => {
            const examples = [0, 1, 2].map((i) => th(`${path.key}Ex${i + 1}` as "pullEx1"));
            return (
              <Card key={path.key} className="h-full border-zinc-800/80">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sm font-semibold text-sky-400">
                      {path.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900">
                      <path.icon className="h-5 w-5 text-sky-400" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{th(`${path.key}Title` as "pullTitle")}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {th(`${path.key}Desc` as "pullDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {examples.map((example) => (
                      <li
                        key={example}
                        className="text-sm text-zinc-500 before:content-['·'] before:mr-2 before:text-zinc-600"
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={path.href}
                    className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300"
                  >
                    {th(`${path.key}Link` as "pullLink")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">
          {t("sceneGuides")}{" "}
          <Link href="/use-cases/trading-alerts" className="text-sky-400 hover:text-sky-300">
            {t("tradingAlerts")}
          </Link>
          {" · "}
          <Link href="/use-cases/ai-research" className="text-sky-400 hover:text-sky-300">
            {t("aiResearch")}
          </Link>
          {" · "}
          <Link href="/use-cases/crypto-alerts" className="text-sky-400 hover:text-sky-300">
            {t("cryptoAlerts")}
          </Link>
          {" · "}
          <Link href="/docs/compare/pricing" className="text-sky-400 hover:text-sky-300">
            {t("vsOfficial")}
          </Link>
        </p>
      </div>
    </section>
  );
}
