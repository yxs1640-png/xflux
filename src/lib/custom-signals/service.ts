import "server-only";

import { PlanTier } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  PLAN_CUSTOM_SIGNAL_ACCOUNT_LIMITS,
  PLAN_CUSTOM_SIGNAL_LIMITS,
  PLAN_MONITOR_LIMITS,
  PLAN_SIGNAL_SUBMISSION_LIMITS,
  getDefaultMonitorInterval,
} from "@/lib/quota";
import { MonitorStatus } from "@prisma/client";
import {
  buildSearchQueryFromAccounts,
  parseAccountList,
} from "./topic-config";

export async function getCustomSignalLimits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planTier: true },
  });
  const planTier = (user?.planTier ?? "FREE") as PlanTier;
  const [boardCount, activeMonitors] = await Promise.all([
    prisma.customSignal.count({ where: { userId } }),
    prisma.monitorTask.count({ where: { userId, isActive: true } }),
  ]);

  return {
    planTier,
    boardLimit: PLAN_CUSTOM_SIGNAL_LIMITS[planTier],
    accountLimit: PLAN_CUSTOM_SIGNAL_ACCOUNT_LIMITS[planTier],
    boardCount,
    monitorLimit: PLAN_MONITOR_LIMITS[planTier],
    activeMonitors,
    submissionLimit: PLAN_SIGNAL_SUBMISSION_LIMITS[planTier],
  };
}

export async function createMonitorsFromCustomSignal(
  userId: string,
  signalId: string
): Promise<{
  created: string[];
  skipped: string[];
  limitReached: boolean;
}> {
  const signal = await prisma.customSignal.findFirst({
    where: { id: signalId, userId },
  });
  if (!signal) {
    throw new Error("Signal board not found");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const planTier = user.planTier as PlanTier;
  const monitorLimit = PLAN_MONITOR_LIMITS[planTier];
  const activeCount = await prisma.monitorTask.count({
    where: { userId, isActive: true },
  });

  const accounts = parseAccountList(signal.watchAccounts.join(","));
  const keywords = signal.monitorKeywords?.trim() || null;
  const interval = getDefaultMonitorInterval(planTier);

  const created: string[] = [];
  const skipped: string[] = [];
  let slots = monitorLimit - activeCount;
  let limitReached = false;

  for (const username of accounts) {
    const existing = await prisma.monitorTask.findFirst({
      where: { userId, targetUsername: username },
    });
    if (existing) {
      skipped.push(username);
      continue;
    }
    if (slots <= 0) {
      skipped.push(username);
      limitReached = true;
      continue;
    }

    await prisma.monitorTask.create({
      data: {
        userId,
        targetUsername: username,
        keywords,
        checkInterval: interval,
        status: MonitorStatus.ACTIVE,
        isActive: true,
      },
    });
    created.push(username);
    slots--;
  }

  return {
    created,
    skipped,
    limitReached,
  };
}

export function validateCustomSignalInput(input: {
  name: string;
  watchAccountsRaw: string;
  searchQuery?: string;
  accountLimit: number;
}): { accounts: string[]; searchQuery: string | null; error?: string } {
  const name = input.name.trim();
  if (!name || name.length > 80) {
    return { accounts: [], searchQuery: null, error: "Name is required (max 80 characters)." };
  }

  const accounts = parseAccountList(input.watchAccountsRaw);
  if (accounts.length === 0) {
    return { accounts: [], searchQuery: null, error: "Add at least one @username." };
  }
  if (accounts.length > input.accountLimit) {
    return {
      accounts: [],
      searchQuery: null,
      error: `Your plan allows up to ${input.accountLimit} accounts per board.`,
    };
  }

  const searchQuery = input.searchQuery?.trim()
    ? input.searchQuery.trim()
    : buildSearchQueryFromAccounts(accounts);

  return { accounts, searchQuery };
}
