import { notFound } from "next/navigation";
import { LongTailLandingPage } from "@/components/seo/long-tail-landing";
import { getLongTailLanding } from "@/lib/seo-landings/long-tail";
import { pageMetadata } from "@/lib/seo";

const landing = getLongTailLanding("twitter-search-api");
if (!landing) throw new Error("missing long-tail landing: twitter-search-api");

export const metadata = pageMetadata({
  title: landing.title,
  description: landing.description,
  path: landing.path,
  keywords: landing.keywords,
});

export default function Page() {
  if (!landing) notFound();
  return <LongTailLandingPage page={landing} />;
}
