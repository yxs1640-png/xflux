import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const SLUG = "monitor-twitter-account-webhook" as const;

export const metadata = pageMetadata({
  title: "Monitor Twitter Account → Webhook Alerts",
  description: "Monitor a Twitter/X account and get webhook alerts when they post. XFlux scheduled monitors + signed HTTP webhooks from $19/mo. Free tier includes Dashboard hits.",
  path: "/monitor-twitter-account-webhook",
  keywords: ["monitor twitter account webhook","twitter account monitor webhook","watch twitter account webhook","x account monitor webhook"],
});

export default function Page() {
  const landing = getLongTailLanding(SLUG);
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
