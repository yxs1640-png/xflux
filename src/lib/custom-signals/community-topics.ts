import "server-only";

import { prisma } from "@/lib/db";
import { getSignalTopic } from "@/lib/signals/topics";
import type { SignalTopicConfig } from "@/lib/signals/topics";
import { topicConfigFromCommunity } from "./topic-config";

export async function getCommunitySignalTopic(slug: string): Promise<SignalTopicConfig | undefined> {
  const row = await prisma.communitySignalTopic.findUnique({ where: { slug } });
  if (!row) return undefined;
  return topicConfigFromCommunity(row);
}

export async function resolvePublicSignalTopic(slug: string): Promise<SignalTopicConfig | undefined> {
  return getSignalTopic(slug) ?? (await getCommunitySignalTopic(slug));
}

export async function getAllCommunitySignalSlugs(): Promise<string[]> {
  const rows = await prisma.communitySignalTopic.findMany({
    select: { slug: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((r) => r.slug);
}

export async function isSlugTaken(slug: string): Promise<boolean> {
  if (getSignalTopic(slug)) return true;
  const community = await prisma.communitySignalTopic.findUnique({ where: { slug } });
  if (community) return true;
  const pending = await prisma.signalTopicSubmission.findFirst({
    where: {
      proposedSlug: slug,
      status: { in: ["PENDING", "APPROVED"] },
    },
  });
  return Boolean(pending);
}
