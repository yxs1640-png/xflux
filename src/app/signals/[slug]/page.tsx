import Link from "next/link";
import { notFound } from "next/navigation";
import { SignalFeedPage } from "@/components/signals/signal-feed-page";
import { fetchSignalFeed } from "@/lib/signals/fetch-signal-feed";
import {
  getAllSignalSlugs,
  getSignalTopic,
} from "@/lib/signals/topics";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  params: Promise<{ slug: string }>;
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
  });
}

export default async function SignalTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getSignalTopic(slug);
  if (!topic) notFound();

  const feed = await fetchSignalFeed(topic);

  return <SignalFeedPage feed={feed} topic={topic} />;
}
