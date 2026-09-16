import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PredictorLeaderboard } from "@/components/predictors/predictor-leaderboard";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { getTopPredictors } from "@/lib/predictor-discovery/queries";
import { nicheFromSlug, NICHE_META } from "@/lib/predictor-discovery/types";

export const revalidate = 300;

type PageProps = { params: Promise<{ niche: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { niche: slug } = await params;
  const niche = nicheFromSlug(slug);
  if (!niche) return {};

  const meta = NICHE_META[niche];
  return pageMetadata({
    title: `${meta.label} Predictors on X/Twitter`,
    description: `Discover ${meta.label.toLowerCase()} prediction accounts on X. Extracted claims, discovery scores, and accuracy tracking.`,
    path: `/predictors/${slug}`,
  });
}

export default async function PredictorNichePage({ params }: PageProps) {
  const { niche: slug } = await params;
  const niche = nicheFromSlug(slug);
  if (!niche) notFound();

  const meta = NICHE_META[niche];
  let predictors: Awaited<ReturnType<typeof getTopPredictors>> = [];

  try {
    predictors = await getTopPredictors({ niche, limit: 30 });
  } catch {
    // pre-migration
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <Link href="/predictors" className="text-sm text-sky-400 hover:underline">
              ← All predictors
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4">{meta.label} predictors</h1>
            <p className="text-zinc-400 mt-2 max-w-2xl">{meta.description}</p>
            <div className="mt-6 flex gap-3">
              <Link href="/docs/guides/trading-keywords">
                <Button variant="outline" size="sm">Keyword templates</Button>
              </Link>
              <Link href="/register?src=predictors_niche">
                <Button size="sm">Add monitors</Button>
              </Link>
            </div>
          </div>
          <PredictorLeaderboard predictors={predictors} showNiche={false} />
        </div>
      </main>
      <Footer />
    </>
  );
}
