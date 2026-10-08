#!/usr/bin/env node
/**
 * Email a user that their requested capability is ready (local ops, not Vercel).
 *
 *   node scripts/send-feedback-capability-ready.mjs <feedbackId>
 *   node scripts/send-feedback-capability-ready.mjs <feedbackId> --url https://xfluxapi.com/docs/...
 *   node scripts/send-feedback-capability-ready.mjs <feedbackId> --note "Try Monitor → Alerts"
 *   node scripts/send-feedback-capability-ready.mjs --list   # pending notify-on-ship rows
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

loadEnv();

const args = process.argv.slice(2);
const listMode = args.includes("--list");
const urlIdx = args.indexOf("--url");
const noteIdx = args.indexOf("--note");
const productUrl =
  urlIdx >= 0 && args[urlIdx + 1] ? args[urlIdx + 1] : "https://xfluxapi.com/dashboard";
const note = noteIdx >= 0 && args[noteIdx + 1] ? args[noteIdx + 1] : "";
const feedbackId = args.find((a) => !a.startsWith("--") && a !== args[urlIdx + 1] && a !== args[noteIdx + 1]);

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

if (listMode) {
  const rows = await prisma.userFeedback.findMany({
    where: {
      notifyOnShip: true,
      capabilityRequest: { not: null },
      capabilityNotifySentAt: null,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      email: true,
      capabilityRequest: true,
      createdAt: true,
    },
  });
  for (const row of rows) {
    const preview = (row.capabilityRequest || "").replace(/\s+/g, " ").slice(0, 80);
    console.log(`${row.id}\t${row.email}\t${preview}`);
  }
  console.log(`\n${rows.length} pending ship-notify`);
  await prisma.$disconnect();
  process.exit(0);
}

if (!feedbackId) {
  console.error(
    "Usage: node scripts/send-feedback-capability-ready.mjs <feedbackId> [--url URL] [--note TEXT]\n       node scripts/send-feedback-capability-ready.mjs --list"
  );
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY?.trim();
if (!apiKey) {
  console.error("RESEND_API_KEY missing");
  process.exit(1);
}

const from = process.env.FEEDBACK_FROM_EMAIL?.trim() || "XFlux <support@xfluxapi.com>";

const feedback = await prisma.userFeedback.findUnique({ where: { id: feedbackId } });
if (!feedback) {
  console.error("Feedback not found");
  process.exit(1);
}
if (!feedback.capabilityRequest?.trim()) {
  console.error("No capabilityRequest on this row");
  process.exit(1);
}
if (!feedback.notifyOnShip) {
  console.error("User opted out of ship notify");
  process.exit(1);
}
if (feedback.capabilityNotifySentAt) {
  console.error("Already notified at", feedback.capabilityNotifySentAt.toISOString());
  process.exit(1);
}

const name = feedback.name;
const greeting = name?.trim() ? `Hi ${escapeHtml(name.trim())},` : "Hi,";
const wish = escapeHtml(feedback.capabilityRequest.trim()).replace(/\n/g, "<br>");
const noteHtml = note
  ? `<p>${escapeHtml(note).replace(/\n/g, "<br>")}</p>`
  : "";
const html = `
  <p>${greeting}</p>
  <p>Good news — we have something ready that matches (or closely matches) the request
  you sent us:</p>
  <blockquote style="border-left:3px solid #38bdf8;padding-left:12px;color:#334155">
    ${wish}
  </blockquote>
  ${noteHtml}
  <p><a href="${escapeHtml(productUrl)}">Open XFlux and try it</a></p>
  <p>If this is not quite what you meant, reply and tell us — we will keep iterating.</p>
  <p>— XFlux</p>
`;

const resend = new Resend(apiKey);
const { error } = await resend.emails.send({
  from,
  to: feedback.email,
  subject: "Your requested XFlux capability is ready to use",
  html,
});

if (error) {
  console.error("Send failed:", error.message);
  await prisma.$disconnect();
  process.exit(1);
}

await prisma.userFeedback.update({
  where: { id: feedback.id },
  data: { capabilityNotifySentAt: new Date() },
});

console.log("Sent ship-ready email to", feedback.email, "for", feedback.id);
await prisma.$disconnect();
