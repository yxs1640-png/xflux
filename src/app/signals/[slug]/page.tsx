import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SignalFeedContent } from "@/components/signals/signal-feed-content";
import { SignalFeedPage } from "@/components/signals/signal-feed-page";
import { SignalFeedSkeleton } from "@/components/signals/signal-feed-skeleton";
import {
  getAllSignalSlugs,
  getSignalTopic,
} from "@/lib/signals/topics";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ refresh?: string }>;
};

export function generateStaticParams() {
  return getAllSignalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const topic = getSignalTopic(slug);
  if (!topic) return {};

  return pageMetadata({
    title: topic.pageTitle,
    description: topic.description,
    path: `/signals/${topic.slug}`,
    keywords: topic.keywords,
  });
}

export default async function SignalTopicPage({ params, searchParams }: PageProps) {
  const [{ slug }, { refresh }] = await Promise.all([params, searchParams]);
  const topic = getSignalTopic(slug);
  if (!topic) notFound();

  return (
    <SignalFeedPage topic={topic}>
      <Suspense fallback={<SignalFeedSkeleton topic={topic} />}>
        <SignalFeedContent topic={topic} fresh={refresh === "1"} />
      </Suspense>
    </SignalFeedPage>
  );
}
