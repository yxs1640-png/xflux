import Link from "next/link";
import { Radar, Search, User, Webhook, MessageSquare, List } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CAP_META = [
  {
    icon: User,
    titleKey: "profilesTitle" as const,
    descKey: "profilesDesc" as const,
    useKey: "profilesUse" as const,
    endpoints: ["GET /api/v1/users/:username"],
    href: "/docs/api",
  },
  {
    icon: MessageSquare,
    titleKey: "timelinesTitle" as const,
    descKey: "timelinesDesc" as const,
    useKey: "timelinesUse" as const,
    endpoints: ["GET /api/v1/users/:username/tweets"],
    href: "/docs/api",
  },
  {
    icon: Search,
    titleKey: "searchTitle" as const,
    descKey: "searchDesc" as const,
    useKey: "searchUse" as const,
    endpoints: ["GET /api/v1/search?q="],
    href: "/docs/api",
  },
  {
    icon: List,
    titleKey: "tweetTitle" as const,
    descKey: "tweetDesc" as const,
    useKey: "tweetUse" as const,
    endpoints: ["GET /api/v1/tweets/:id"],
    href: "/docs/api",
  },
  {
    icon: Radar,
    titleKey: "monitorsTitle" as const,
    descKey: "monitorsDesc" as const,
    useKey: "monitorsUse" as const,
    endpoints: ["Dashboard → Monitors"],
    href: "/docs/monitors",
  },
  {
    icon: Webhook,
    titleKey: "webhooksTitle" as const,
    descKey: "webhooksDesc" as const,
    useKey: "webhooksUse" as const,
    endpoints: ["POST your-endpoint (Starter+)"],
    href: "/twitter-webhook",
  },
] as const;

export async function ApiCapabilities() {
  const t = await getTranslations("apiCapabilities");

  return (
    <section className="py-24 border-t border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAP_META.map((cap) => (
            <Link key={cap.titleKey} href={cap.href} className="group block h-full">
              <Card className="h-full transition-colors group-hover:border-sky-500/30">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                    <cap.icon className="h-5 w-5 text-sky-400" />
                  </div>
                  <CardTitle className="text-lg">{t(cap.titleKey)}</CardTitle>
                  <CardDescription>{t(cap.descKey)}</CardDescription>
                  <p className="text-xs text-zinc-500 mt-2">
                    <span className="text-zinc-600">{t("useFor")}</span> {t(cap.useKey)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cap.endpoints.map((ep) => (
                      <Badge key={ep} variant="sky" className="font-mono text-xs">
                        {ep}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
