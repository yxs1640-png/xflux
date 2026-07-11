import { MonitorStatus, type MonitorHit, type MonitorTask } from "@prisma/client";
import { prisma } from "./db";
import { getUserTweets, isTwitterDataSourceConfigured } from "./twitter-proxy";

export interface PollMonitorResult {
  taskId: string;
  checked: boolean;
  newHits: number;
  baselined: boolean;
  error?: string;
}

function matchesKeywords(text: string, keywords: string | null): boolean {
  if (!keywords?.trim()) return true;
  const lower = text.toLowerCase();
  return keywords
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
    .some((k) => lower.includes(k));
}

function tweetIdCompare(a: string, b: string): number {
  try {
    const diff = BigInt(a) - BigInt(b);
    if (diff > BigInt(0)) return 1;
    if (diff < BigInt(0)) return -1;
    return 0;
  } catch {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
}

function sortTweetsNewestFirst<T extends { id: string; created_at: string }>(tweets: T[]): T[] {
  return [...tweets].sort((a, b) => {
    const byId = tweetIdCompare(b.id, a.id);
    if (byId !== 0) return byId;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function pollMonitorTask(taskId: string): Promise<PollMonitorResult> {
  const task = await prisma.monitorTask.findUnique({ where: { id: taskId } });
  if (!task) {
    return { taskId, checked: false, newHits: 0, baselined: false, error: "Monitor not found" };
  }

  if (!task.isActive || task.status === MonitorStatus.PAUSED) {
    return { taskId, checked: false, newHits: 0, baselined: false, error: "Monitor is paused" };
  }

  if (!isTwitterDataSourceConfigured()) {
    const message = "Twitter data source not configured";
    await prisma.monitorTask.update({
      where: { id: taskId },
      data: { status: MonitorStatus.ERROR, lastError: message, lastCheckAt: new Date() },
    });
    return { taskId, checked: false, newHits: 0, baselined: false, error: message };
  }

  try {
    const rawTweets = await getUserTweets(task.targetUsername, 20);
    const tweets = sortTweetsNewestFirst(rawTweets);

    if (tweets.length === 0) {
      await prisma.monitorTask.update({
        where: { id: taskId },
        data: {
          status: MonitorStatus.ACTIVE,
          lastError: null,
          lastCheckAt: new Date(),
        },
      });
      return { taskId, checked: true, newHits: 0, baselined: false };
    }

    const newestId = tweets[0]!.id;

    if (!task.lastTweetId) {
      await prisma.monitorTask.update({
        where: { id: taskId },
        data: {
          lastTweetId: newestId,
          status: MonitorStatus.ACTIVE,
          lastError: null,
          lastCheckAt: new Date(),
        },
      });
      return { taskId, checked: true, newHits: 0, baselined: true };
    }

    const newTweets = tweets.filter((t) => tweetIdCompare(t.id, task.lastTweetId!) > 0);
    let newHits = 0;
    const newHitRecords: MonitorHit[] = [];

    for (const tweet of newTweets.reverse()) {
      if (!matchesKeywords(tweet.text, task.keywords)) continue;

      const existing = await prisma.monitorHit.findUnique({
        where: { taskId_tweetId: { taskId: task.id, tweetId: tweet.id } },
      });
      if (existing) continue;

      const hit = await prisma.monitorHit.create({
        data: {
          taskId: task.id,
          tweetId: tweet.id,
          text: tweet.text,
          authorUsername: tweet.author?.username ?? task.targetUsername,
          tweetCreatedAt: tweet.created_at ? new Date(tweet.created_at) : null,
        },
      });
      newHitRecords.push(hit);
      newHits++;
    }

    for (const hit of newHitRecords) {
      void import("./monitor-webhook")
        .then(({ deliverHitWebhook }) => deliverHitWebhook(task, hit))
        .catch((err) => {
          console.error(`[monitor-poll] webhook delivery failed for hit ${hit.id}:`, err);
        });
    }

    await prisma.monitorTask.update({
      where: { id: taskId },
      data: {
        lastTweetId: newestId,
        status: MonitorStatus.ACTIVE,
        lastError: null,
        lastCheckAt: new Date(),
      },
    });

    return { taskId, checked: true, newHits, baselined: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Poll failed";
    await prisma.monitorTask.update({
      where: { id: taskId },
      data: {
        status: MonitorStatus.ERROR,
        lastError: message,
        lastCheckAt: new Date(),
      },
    });
    return { taskId, checked: false, newHits: 0, baselined: false, error: message };
  }
}

export function isMonitorDue(task: Pick<MonitorTask, "lastCheckAt" | "checkInterval">): boolean {
  if (!task.lastCheckAt) return true;
  const elapsed = Date.now() - task.lastCheckAt.getTime();
  return elapsed >= task.checkInterval * 1000;
}

export async function pollDueMonitors(limit = 10): Promise<PollMonitorResult[]> {
  const tasks = await prisma.monitorTask.findMany({
    where: { isActive: true, status: { not: MonitorStatus.PAUSED } },
    orderBy: { lastCheckAt: "asc" },
    take: 50,
  });

  const due = tasks.filter(isMonitorDue).slice(0, limit);
  const results: PollMonitorResult[] = [];

  for (const task of due) {
    results.push(await pollMonitorTask(task.id));
  }

  return results;
}
