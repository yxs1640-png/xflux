import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const SLUG = "twitter-slack-alerts" as const;

export const metadata = pageMetadata({
  title: "Twitter → Slack Alerts via Webhooks",
  description: "Send Twitter/X account alerts to Slack with XFlux monitors. Paste a Slack Incoming Webhook or route via Make — signed delivery from $19/mo.",
  path: "/twitter-slack-alerts",
  keywords: ["twitter slack alerts","twitter to slack webhook","x slack webhook","twitter slack integration"],
});

export default function Page() {
  const landing = getLongTailLanding(SLUG);
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
