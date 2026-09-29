import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const SLUG = "account-activity-api-alternative" as const;

export const metadata = pageMetadata({
  title: "Account Activity API Alternative — XFlux Monitors",
  description: "Looking for an Account Activity API alternative? XFlux watches public X/Twitter accounts and delivers signed webhooks from $19/mo — self-serve, no enterprise AAA.",
  path: "/account-activity-api-alternative",
  keywords: ["account activity api alternative","twitter aaa alternative","x account activity alternative","account activity webhook alternative"],
});

export default function Page() {
  const landing = getLongTailLanding(SLUG);
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
