#!/usr/bin/env node
/**
 * Approve or reject a signal topic submission from CLI.
 *
 * Usage:
 *   node scripts/approve-signal-submission.mjs <submissionId> approve
 *   node scripts/approve-signal-submission.mjs <submissionId> reject [note]
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const [submissionId, action, ...noteParts] = process.argv.slice(2);
const adminNote = noteParts.join(" ").trim() || null;

if (!submissionId || !["approve", "reject"].includes(action)) {
  console.error("Usage: node scripts/approve-signal-submission.mjs <id> approve|reject [note]");
  process.exit(1);
}

const submission = await prisma.signalTopicSubmission.findUnique({ where: { id: submissionId } });
if (!submission) {
  console.error("Submission not found");
  process.exit(1);
}
if (submission.status !== "PENDING") {
  console.error(`Already ${submission.status}`);
  process.exit(1);
}

if (action === "reject") {
  await prisma.signalTopicSubmission.update({
    where: { id: submissionId },
    data: { status: "REJECTED", adminNote, reviewedAt: new Date() },
  });
  console.log("Rejected.");
  await prisma.$disconnect();
  process.exit(0);
}

const pageTitle = `${submission.title} Signals on X/Twitter — Community Digest`;
const pulseLabel = submission.pulseLabel ?? submission.title;

await prisma.$transaction(async (tx) => {
  await tx.communitySignalTopic.create({
    data: {
      slug: submission.proposedSlug,
      submissionId: submission.id,
      submittedById: submission.userId,
      category: submission.category,
      title: submission.title,
      pageTitle,
      description: submission.description,
      keywords: [
        `${submission.title} Twitter signals`,
        `${submission.title} X monitor`,
        pulseLabel,
      ],
      intro: submission.intro,
      watchAccounts: submission.watchAccounts,
      searchQuery: submission.searchQuery,
      pulseLabel,
    },
  });
  await tx.signalTopicSubmission.update({
    where: { id: submissionId },
    data: { status: "APPROVED", adminNote, reviewedAt: new Date() },
  });
});

console.log(`Approved → /signals/${submission.proposedSlug}`);
await prisma.$disconnect();
