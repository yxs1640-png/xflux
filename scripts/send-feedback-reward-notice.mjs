#!/usr/bin/env node
/**
 * Send reward notification after an admin Approve (not from Vercel).
 *
 *   node scripts/send-feedback-reward-notice.mjs <feedbackId>
 *   node scripts/send-feedback-reward-notice.mjs --latest
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

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: node scripts/send-feedback-reward-notice.mjs <feedbackId|--latest>");
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const from = process.env.FEEDBACK_FROM_EMAIL?.trim() || "XFlux <support@xfluxapi.com>";
const apiKey = process.env.RESEND_API_KEY?.trim();
if (!apiKey) {
  console.error("RESEND_API_KEY missing");
  process.exit(1);
}

const feedback =
  arg === "--latest"
    ? await prisma.userFeedback.findFirst({
        where: { reviewStatus: "APPROVED", rewardGrantedAt: { not: null } },
        orderBy: { rewardGrantedAt: "desc" },
      })
    : await prisma.userFeedback.findUnique({ where: { id: arg } });

if (!feedback) {
  console.error("Feedback not found");
  process.exit(1);
}
if (feedback.reviewStatus !== "APPROVED" || !feedback.rewardCalls) {
  console.error("Feedback is not an approved reward row");
  process.exit(1);
}

const user = feedback.userId
  ? await prisma.user.findUnique({
      where: { id: feedback.userId },
      select: { email: true, name: true, quotaLimit: true },
    })
  : await prisma.user.findUnique({
      where: { email: feedback.email.toLowerCase() },
      select: { email: true, name: true, quotaLimit: true },
    });

if (!user) {
  console.error("User not found for", feedback.email);
  process.exit(1);
}

const name = feedback.name || user.name;
const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,";
const html = `
  <p>${greeting}</p>
  <p>Thanks for your product feedback on XFlux. We reviewed it and added
  <strong>${feedback.rewardCalls.toLocaleString()} API calls</strong> to your account
  this billing period (new monthly quota: <strong>${user.quotaLimit.toLocaleString()}</strong>).</p>
  <p>You can check usage anytime in
  <a href="https://xfluxapi.com/dashboard/usage">Dashboard → Usage</a>.</p>
  <p>Thanks,<br>XFlux</p>
`;

const resend = new Resend(apiKey);
const { error } = await resend.emails.send({
  from,
  to: user.email,
  subject: `Your XFlux feedback reward: +${feedback.rewardCalls.toLocaleString()} API calls`,
  html,
});

if (error) {
  console.error("FAIL", error.message);
  process.exit(1);
}

console.log(`OK reward notice → ${user.email} (feedback ${feedback.id}) from ${from}`);
await prisma.$disconnect();
