import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const SLUG = "twitter-account-activity-api" as const;

export const metadata = pageMetadata({
  title: "Twitter Account Activity API — Practical Alternative",
  description: "Need Twitter Account Activity API–style alerts without enterprise AAA? XFlux monitors watch public @handles and POST signed webhooks from $19/mo. Free tier to start.",
  path: "/twitter-account-activity-api",
  keywords: ["twitter account activity api","account activity api twitter","twitter aaa api","x account activity api"],
});

export default function Page() {
  const landing = getLongTailLanding(SLUG);
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
