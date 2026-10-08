#!/usr/bin/env node
/**
 * Invite registered users to leave product feedback for a quota reward.
 *
 * Dry-run (default):
 *   node scripts/send-feedback-reward-invites.mjs
 *
 * Send for real (requires verified Resend from-domain; onboarding@resend.dev
 * can usually only mail the Resend account owner):
 *   node scripts/send-feedback-reward-invites.mjs --send
 *   node scripts/send-feedback-reward-invites.mjs --send --limit=20
 *   node scripts/send-feedback-reward-invites.mjs --send --to=you@example.com
 */

import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

function loadEnv() {
  try {
    const raw = readFileSync(".env", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* ignore */
  }
}

loadEnv();

const REWARD_CALLS = 3000;
const args = new Set(process.argv.slice(2));
const send = args.has("--send");
const limitArg = [...args].find((a) => a.startsWith("--limit="));
const toArg = [...args].find((a) => a.startsWith("--to="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : 50;
const onlyTo = toArg ? toArg.split("=")[1].toLowerCase() : null;

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const from = process.env.FEEDBACK_FROM_EMAIL?.trim() || "XFlux <support@xfluxapi.com>";

function buildHtml(name) {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,";
  return `
    <p>${greeting}</p>
    <p>This is a note from the XFlux team. We're talking with people who have already tried
    the API or account monitors, and we'd value a short written evaluation from you.</p>
    <p>What helps most: your use case, what worked, what blocked you, and one change you'd
    prioritize. We read every submission. If the feedback is concrete and useful, we may add
    ${REWARD_CALLS.toLocaleString()} API calls to your account for the current period
    (one time per account; checkbox-only replies usually don't qualify).</p>
    <p><a href="https://xfluxapi.com/feedback?src=feedback_reward_invite">Open the feedback form</a></p>
    <p>Thanks,<br>XFlux</p>
    <p style="color:#888;font-size:12px">You're receiving this because you have an XFlux account.
    Questions: reply to this email or write support@xfluxapi.com.</p>
  `;
}

const rewardedEmails = new Set(
  (
    await prisma.userFeedback.findMany({
      where: { reviewStatus: "APPROVED", rewardGrantedAt: { not: null } },
      select: { email: true },
    })
  ).map((r) => r.email.toLowerCase())
);

const users = onlyTo
  ? await prisma.user.findMany({
      where: { email: onlyTo },
      select: { id: true, email: true, name: true, quotaUsed: true, createdAt: true },
      take: 1,
    })
  : await prisma.user.findMany({
      where: { quotaUsed: { gt: 0 } },
      orderBy: { quotaUsed: "desc" },
      take: Math.max(1, Math.min(limit, 200)),
      select: { id: true, email: true, name: true, quotaUsed: true, createdAt: true },
    });

const targets = users.filter((u) => !rewardedEmails.has(u.email.toLowerCase()));

console.log(`Mode: ${send ? "SEND" : "DRY-RUN"}`);
console.log(`From: ${from}`);
console.log(`Candidates: ${targets.length} (of ${users.length} queried)`);
for (const u of targets.slice(0, 30)) {
  console.log(`  - ${u.email} (quotaUsed=${u.quotaUsed})`);
}
if (targets.length > 30) console.log(`  … +${targets.length - 30} more`);

if (!send) {
  console.log("\nRe-run with --send to deliver. Prefer a verified domain from address.");
  await prisma.$disconnect();
  process.exit(0);
}

const apiKey = process.env.RESEND_API_KEY?.trim();
if (!apiKey) {
  console.error("RESEND_API_KEY missing");
  process.exit(1);
}

const resend = new Resend(apiKey);
let ok = 0;
let fail = 0;
for (const u of targets) {
  const { error } = await resend.emails.send({
    from,
    to: u.email,
    subject: "Quick request: product feedback for XFlux",
    html: buildHtml(u.name),
  });
  if (error) {
    fail += 1;
    console.error(`FAIL ${u.email}: ${error.message}`);
  } else {
    ok += 1;
    console.log(`OK   ${u.email}`);
  }
  await new Promise((r) => setTimeout(r, 400));
}

console.log(`\nDone. sent=${ok} failed=${fail}`);
await prisma.$disconnect();
