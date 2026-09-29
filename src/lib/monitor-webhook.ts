import {
  PlanTier,
  WebhookDeliveryEvent,
  WebhookDeliveryStatus,
  type MonitorHit,
  type MonitorTask,
} from "@prisma/client";
import { prisma } from "./db";
import { PLAN_WEBHOOK_ACCESS } from "./quota";

export interface MonitorWebhookPayload {
  event: "monitor.test" | "monitor.hit";
  monitor: {
    id: string;
    targetUsername: string;
    keywords: string | null;
  };
  tweet?: {
    id: string;
    text: string;
    authorUsername: string;
    createdAt: string | null;
  };
  detectedAt?: string;
  test?: boolean;
}

/** Discord Incoming Webhook JSON (content and/or embeds required). */
export type DiscordWebhookBody = {
  username?: string;
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    footer?: { text: string };
    timestamp?: string;
  }>;
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function generateWebhookSecret(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function signWebhookPayload(
  secret: string,
  timestamp: number,
  body: string
): Promise<string> {
  const digest = await hmacSha256Hex(secret, `${timestamp}.${body}`);
  return `sha256=${digest}`;
}

export async function verifyWebhookSignature(
  secret: string,
  timestamp: number,
  body: string,
  signature: string,
  maxAgeSeconds = 300
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > maxAgeSeconds) return false;

  const expected = await signWebhookPayload(secret, timestamp, body);
  return constantTimeEqual(expected, signature);
}

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1))}…`;
}

/** True when URL is a Discord Incoming Webhook (channel integrations). */
export function isDiscordWebhookUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const discordHost =
      host === "discord.com" ||
      host === "discordapp.com" ||
      host.endsWith(".discord.com") ||
      host.endsWith(".discordapp.com");
    return discordHost && u.pathname.includes("/api/webhooks/");
  } catch {
    return false;
  }
}

/** True when URL is a Slack Incoming Webhook. */
export function isSlackWebhookUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.toLowerCase() === "hooks.slack.com" && u.pathname.startsWith("/services/");
  } catch {
    return false;
  }
}

function tweetPermalink(authorUsername: string, tweetId: string): string {
  return `https://x.com/${authorUsername.replace(/^@/, "")}/status/${tweetId}`;
}

/** Map XFlux event → Discord Incoming Webhook body (avoids Discord 50006 empty message). */
export function toDiscordWebhookBody(payload: MonitorWebhookPayload): DiscordWebhookBody {
  if (payload.event === "monitor.test" || payload.test) {
    return {
      username: "XFlux",
      content: `XFlux test OK — monitor @${payload.monitor.targetUsername} is connected.`,
    };
  }

  const tweet = payload.tweet;
  if (!tweet) {
    return {
      username: "XFlux",
      content: `XFlux monitor hit for @${payload.monitor.targetUsername}`,
    };
  }

  const author = tweet.authorUsername.replace(/^@/, "");
  const url = tweetPermalink(author, tweet.id);
  // Embed description max 4096; keep headroom for formatting.
  const description = truncate(tweet.text, 3900);

  return {
    username: "XFlux",
    embeds: [
      {
        title: `@${author} posted`,
        description,
        url,
        color: 0x0ea5e9,
        footer: { text: "XFlux monitor" },
        timestamp: tweet.createdAt ?? payload.detectedAt,
      },
    ],
  };
}

export function toSlackWebhookBody(payload: MonitorWebhookPayload): { text: string } {
  if (payload.event === "monitor.test" || payload.test) {
    return {
      text: `XFlux test OK — monitor @${payload.monitor.targetUsername} is connected.`,
    };
  }

  const tweet = payload.tweet;
  if (!tweet) {
    return { text: `XFlux monitor hit for @${payload.monitor.targetUsername}` };
  }

  const author = tweet.authorUsername.replace(/^@/, "");
  const url = tweetPermalink(author, tweet.id);
  return {
    text: truncate(`*@${author}* posted:\n${tweet.text}\n${url}`, 3000),
  };
}

function buildHitPayload(task: MonitorTask, hit: MonitorHit): MonitorWebhookPayload {
  return {
    event: "monitor.hit",
    monitor: {
      id: task.id,
      targetUsername: task.targetUsername,
      keywords: task.keywords,
    },
    tweet: {
      id: hit.tweetId,
      text: hit.text,
      authorUsername: hit.authorUsername,
      createdAt: hit.tweetCreatedAt?.toISOString() ?? null,
    },
    detectedAt: hit.detectedAt.toISOString(),
  };
}

function buildTestPayload(task: MonitorTask): MonitorWebhookPayload {
  return {
    event: "monitor.test",
    monitor: {
      id: task.id,
      targetUsername: task.targetUsername,
      keywords: task.keywords,
    },
    test: true,
  };
}

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  responseTime: number;
  error?: string;
}

function serializeOutboundBody(webhookUrl: string, payload: MonitorWebhookPayload): string {
  if (isDiscordWebhookUrl(webhookUrl)) {
    return JSON.stringify(toDiscordWebhookBody(payload));
  }
  if (isSlackWebhookUrl(webhookUrl)) {
    return JSON.stringify(toSlackWebhookBody(payload));
  }
  return JSON.stringify(payload);
}

export async function sendMonitorWebhook(
  task: MonitorTask,
  payload: MonitorWebhookPayload,
  event: WebhookDeliveryEvent,
  hitId?: string
): Promise<WebhookDeliveryResult> {
  if (!task.webhookUrl || !task.webhookSecret) {
    return { success: false, responseTime: 0, error: "Webhook not configured" };
  }

  const body = serializeOutboundBody(task.webhookUrl, payload);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await signWebhookPayload(task.webhookSecret, timestamp, body);
  const started = Date.now();

  let statusCode: number | undefined;
  let error: string | undefined;
  let success = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(task.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "XFlux-Webhook/1.0",
        "X-XFlux-Event": payload.event,
        "X-XFlux-Timestamp": String(timestamp),
        "X-XFlux-Signature": signature,
      },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    statusCode = res.status;
    success = res.status >= 200 && res.status < 300;

    if (!success) {
      const text = await res.text().catch(() => "");
      error = text.slice(0, 500) || `HTTP ${res.status}`;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Webhook request failed";
  }

  const responseTime = Date.now() - started;

  await prisma.monitorWebhookDelivery.create({
    data: {
      taskId: task.id,
      hitId: hitId ?? null,
      event,
      status: success ? WebhookDeliveryStatus.SUCCESS : WebhookDeliveryStatus.FAILED,
      statusCode: statusCode ?? null,
      responseTime,
      error: error ?? null,
    },
  });

  return { success, statusCode, responseTime, error };
}

export async function deliverHitWebhook(
  task: MonitorTask,
  hit: MonitorHit
): Promise<WebhookDeliveryResult | null> {
  if (!task.webhookUrl || !task.webhookSecret) return null;

  // Defense in depth: never deliver live hits without plan access (even if caller forgets).
  const owner = await prisma.user.findUnique({
    where: { id: task.userId },
    select: { planTier: true },
  });
  if (!owner || !PLAN_WEBHOOK_ACCESS[owner.planTier as PlanTier]) {
    return null;
  }

  return sendMonitorWebhook(
    task,
    buildHitPayload(task, hit),
    WebhookDeliveryEvent.HIT,
    hit.id
  );
}

export async function sendTestWebhook(taskId: string): Promise<WebhookDeliveryResult> {
  const task = await prisma.monitorTask.findUnique({ where: { id: taskId } });
  if (!task) {
    return { success: false, responseTime: 0, error: "Monitor not found" };
  }
  if (!task.webhookUrl || !task.webhookSecret) {
    return { success: false, responseTime: 0, error: "Webhook URL not configured" };
  }

  return sendMonitorWebhook(
    task,
    buildTestPayload(task),
    WebhookDeliveryEvent.TEST
  );
}
