import {
  WebhookDeliveryEvent,
  WebhookDeliveryStatus,
  type MonitorHit,
  type MonitorTask,
} from "@prisma/client";
import { prisma } from "./db";

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

export async function sendMonitorWebhook(
  task: MonitorTask,
  payload: MonitorWebhookPayload,
  event: WebhookDeliveryEvent,
  hitId?: string
): Promise<WebhookDeliveryResult> {
  if (!task.webhookUrl || !task.webhookSecret) {
    return { success: false, responseTime: 0, error: "Webhook not configured" };
  }

  const body = JSON.stringify(payload);
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
