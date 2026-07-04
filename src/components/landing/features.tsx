import {
  Search,
  Radar,
  Send,
  MessageSquare,
  BarChart3,
  Terminal,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Search,
    title: "Data Scraping",
    description:
      "Fetch user profiles, timelines, followers, and trending topics with simple REST endpoints.",
  },
  {
    icon: Radar,
    title: "Real-time Monitor",
    description:
      "Track KOL tweets in seconds. Get alerts via Telegram, Discord, Email, or Webhook.",
  },
  {
    icon: Send,
    title: "Auto Posting",
    description:
      "Schedule tweets, batch post, and manage content with template variables.",
  },
  {
    icon: MessageSquare,
    title: "DM Automation",
    description:
      "Send bulk DMs with 98% delivery rate. Perfect for outreach and notifications.",
  },
  {
    icon: BarChart3,
    title: "Usage Dashboard",
    description:
      "Track API calls, quota usage, and monitor task status in real-time.",
  },
  {
    icon: Terminal,
    title: "Developer First",
    description:
      "REST API, CLI tools, and comprehensive docs. Integrate in minutes.",
  },
];

export function Features() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need for X automation
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            From data extraction to real-time monitoring and bulk operations —
            XFlux covers the full Twitter/X API workflow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="hover:border-sky-500/30 transition-colors">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                  <feature.icon className="h-5 w-5 text-sky-400" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
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
