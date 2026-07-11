import {
  Search,
  Radar,
  Send,
  MessageSquare,
  BarChart3,
  Terminal,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Search,
    title: "Read API",
    description:
      "Fetch user profiles, timelines, tweet lookup, and search results via REST endpoints.",
    status: "available" as const,
  },
  {
    icon: Radar,
    title: "Account Monitors",
    description:
      "Poll public accounts on a schedule. View hits in the Dashboard; paid plans can POST signed webhooks to your URL.",
    status: "available" as const,
  },
  {
    icon: Send,
    title: "Auto Posting",
    description:
      "Schedule tweets, batch post, and manage content with template variables.",
    status: "coming_soon" as const,
  },
  {
    icon: MessageSquare,
    title: "DM Automation",
    description:
      "Send bulk DMs for outreach and notifications.",
    status: "coming_soon" as const,
  },
  {
    icon: BarChart3,
    title: "Usage Dashboard",
    description:
      "View API usage, monthly quota, and monitor task status from one dashboard.",
    status: "available" as const,
  },
  {
    icon: Terminal,
    title: "Developer First",
    description:
      "REST API and comprehensive docs. Integrate in minutes.",
    status: "available" as const,
  },
];

export function Features() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            What XFlux ships today
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Read endpoints and account monitors are live now. Posting and DM automation are on the
            roadmap.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="hover:border-sky-500/30 transition-colors">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                  <feature.icon className="h-5 w-5 text-sky-400" />
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle>{feature.title}</CardTitle>
                  {feature.status === "coming_soon" && (
                    <Badge variant="default">Coming soon</Badge>
                  )}
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
