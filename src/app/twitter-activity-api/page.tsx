import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const SLUG = "twitter-activity-api" as const;

export const metadata = pageMetadata({
  title: "Twitter Activity API — What It Means & a Practical Path",
  description: "Twitter Activity API usually refers to Account Activity (AAA). For account-level tweet alerts without enterprise AAA, use XFlux monitors and signed webhooks from $19/mo.",
  path: "/twitter-activity-api",
  keywords: ["twitter activity api","x activity api","twitter activity webhook","activity api twitter"],
});

export default function Page() {
  const landing = getLongTailLanding(SLUG);
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
