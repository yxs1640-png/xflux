#!/usr/bin/env node
/**
 * Restore paid entitlements for a user wrongly downgraded after cancel_at_period_end.
 *
 * Sets planTier back to the active subscription tier, re-schedules pending FREE at
 * period end, and restores monitor checkInterval to the paid minimum (1s for BASIC+).
 *
 * Usage:
 *   node scripts/restore-cancel-at-period-end.mjs <email>
 *   node scripts/restore-cancel-at-period-end.mjs 19437adyan@gmail.com
 *   node scripts/restore-cancel-at-period-end.mjs 19437adyan@gmail.com --dry-run
 */

import { PrismaClient, PlanTier } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const PLAN_LIMITS = {
  FREE: 1_000,
  BASIC: 150_000,
  GROWTH: 500_000,
  PRO: 1_200_000,
  SCALE: 4_000_000,
  ENTERPRISE: 4_000_000,
};

const PAID_MIN_INTERVAL = {
  BASIC: 1,
  GROWTH: 1,
  PRO: 1,
  SCALE: 1,
  ENTERPRISE: 1,
};

const email = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (!email) {
  console.error("Usage: node scripts/restore-cancel-at-period-end.mjs <email> [--dry-run]");
  process.exit(1);
}

const user = await prisma.user.findUnique({
  where: { email: email.toLowerCase().trim() },
  include: {
    monitorTasks: {
      select: {
        id: true,
        targetUsername: true,
        checkInterval: true,
      },
    },
  },
});

if (!user) {
  console.error(`User not found: ${email}`);
  process.exit(1);
}

if (!user.stripeSubscriptionId || !["active", "trialing"].includes(user.subscriptionStatus ?? "")) {
  console.error(
    "User has no active Stripe subscription — nothing to restore (status:",
    user.subscriptionStatus,
    ")"
  );
  process.exit(1);
}

const restoreTier =
  user.stripePriceId?.includes("GROWTH") ? PlanTier.GROWTH
  : user.stripePriceId?.includes("PRO") ? PlanTier.PRO
  : user.stripePriceId?.includes("SCALE") ? PlanTier.SCALE
  : PlanTier.BASIC;

const effectiveAt = user.subscriptionPeriodEnd ?? user.planChangeEffectiveAt;
const minInterval = PAID_MIN_INTERVAL[restoreTier] ?? 1;

console.log("\nRestore cancel-at-period-end entitlements\n");
console.log(`  Email:              ${user.email}`);
console.log(`  Current planTier:   ${user.planTier}`);
console.log(`  Restore planTier:   ${restoreTier}`);
console.log(`  pendingPlanTier:    FREE @ ${effectiveAt?.toISOString() ?? "(missing period end)"}`);
console.log(`  Monitor interval:   → ${minInterval}s for ${user.monitorTasks.length} monitor(s)`);
console.log(`  Dry run:            ${dryRun}\n`);

if (!effectiveAt) {
  console.error("Missing subscriptionPeriodEnd — set it from Stripe before running.");
  process.exit(1);
}

if (dryRun) {
  await prisma.$disconnect();
  process.exit(0);
}

await prisma.user.update({
  where: { id: user.id },
  data: {
    planTier: restoreTier,
    quotaLimit: PLAN_LIMITS[restoreTier],
    pendingPlanTier: PlanTier.FREE,
    planChangeEffectiveAt: effectiveAt,
    lastPlanChangeSummary: null,
    planChangeBannerDismissedAt: null,
  },
});

if (user.monitorTasks.length > 0) {
  await prisma.monitorTask.updateMany({
    where: { userId: user.id },
    data: { checkInterval: minInterval },
  });
}

const updated = await prisma.user.findUnique({
  where: { id: user.id },
  include: {
    monitorTasks: { select: { targetUsername: true, checkInterval: true } },
  },
});

console.log("Done.\n");
console.log(JSON.stringify({
  planTier: updated?.planTier,
  quotaLimit: updated?.quotaLimit,
  pendingPlanTier: updated?.pendingPlanTier,
  planChangeEffectiveAt: updated?.planChangeEffectiveAt?.toISOString(),
  monitors: updated?.monitorTasks.map((m) => ({
    target: m.targetUsername,
    checkInterval: m.checkInterval,
  })),
}, null, 2));

await prisma.$disconnect();
