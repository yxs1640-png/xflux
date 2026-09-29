import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const SLUG = "twitter-webhook-nodejs" as const;

export const metadata = pageMetadata({
  title: "Twitter Webhook in Node.js — Verify XFlux Signatures",
  description: "Handle Twitter/X account monitor webhooks in Node.js. Express example verifying XFlux HMAC-SHA256 signatures for monitor.hit events. Starter from $19/mo.",
  path: "/twitter-webhook-nodejs",
  keywords: ["twitter webhook nodejs","twitter webhook node.js","x webhook express","verify twitter webhook hmac node"],
});

export default function Page() {
  const landing = getLongTailLanding(SLUG);
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
