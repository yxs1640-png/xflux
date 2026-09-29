import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const SLUG = "filtered-stream-alternative" as const;

export const metadata = pageMetadata({
  title: "Twitter Filtered Stream Alternative — Account Monitors",
  description: "Need a Twitter filtered stream alternative for watching accounts? XFlux monitors + signed webhooks from $19/mo — not the ~$5,000/mo official Pro stream.",
  path: "/filtered-stream-alternative",
  keywords: ["twitter filtered stream alternative","x api filtered stream alternative","filtered stream alternative","cheap twitter stream alternative"],
});

export default function Page() {
  const landing = getLongTailLanding(SLUG);
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
