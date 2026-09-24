import {
  Search,
  Radar,
  Send,
  MessageSquare,
  BarChart3,
  Terminal,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURE_META = [
  { icon: Search, titleKey: "readApiTitle", descKey: "readApiDesc", status: "available" as const },
  { icon: Radar, titleKey: "monitorsTitle", descKey: "monitorsDesc", status: "available" as const },
  { icon: Send, titleKey: "autoPostTitle", descKey: "autoPostDesc", status: "coming_soon" as const },
  {
    icon: MessageSquare,
    titleKey: "dmTitle",
    descKey: "dmDesc",
    status: "coming_soon" as const,
  },
  {
    icon: BarChart3,
    titleKey: "dashboardTitle",
    descKey: "dashboardDesc",
    status: "available" as const,
  },
  { icon: Terminal, titleKey: "mcpTitle", descKey: "mcpDesc", status: "available" as const },
] as const;

export async function Features() {
  const t = await getTranslations("features");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURE_META.map((feature) => (
            <Card key={feature.titleKey} className="hover:border-sky-500/30 transition-colors">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                  <feature.icon className="h-5 w-5 text-sky-400" />
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle>{t(feature.titleKey)}</CardTitle>
                  {feature.status === "coming_soon" && (
                    <Badge variant="default">{t("comingSoon")}</Badge>
                  )}
                </div>
                <CardDescription>{t(feature.descKey)}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
