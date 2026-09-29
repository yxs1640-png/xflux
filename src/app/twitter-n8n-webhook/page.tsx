import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const SLUG = "twitter-n8n-webhook" as const;

export const metadata = pageMetadata({
  title: "n8n Twitter Webhook — XFlux Monitor Hits",
  description: "Connect X/Twitter account monitors to n8n with XFlux webhooks. Receive monitor.hit events, verify HMAC, and automate Slack, email, or CRM — from $19/mo.",
  path: "/twitter-n8n-webhook",
  keywords: ["n8n twitter webhook","n8n twitter alerts","twitter webhook n8n","xflux n8n"],
});

export default function Page() {
  const landing = getLongTailLanding(SLUG);
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
