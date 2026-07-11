import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { MonitorStatus, PlanTier } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateWebhookSecret } from "@/lib/monitor-webhook";
import {
  getDefaultMonitorInterval,
  PLAN_MONITOR_LIMITS,
  PLAN_MONITOR_MIN_INTERVAL,
  PLAN_WEBHOOK_ACCESS,
} from "@/lib/quota";

function serializeMonitor<T extends {
  webhookUrl: string | null;
  webhookSecret: string | null;
}>(monitor: T) {
  const { webhookSecret, ...rest } = monitor;
  return {
    ...rest,
    hasWebhook: Boolean(monitor.webhookUrl),
    webhookSecret: webhookSecret ? `whsec_${webhookSecret.slice(-8)}` : null,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monitors = await prisma.monitorTask.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      hits: {
        orderBy: { detectedAt: "desc" },
        take: 3,
      },
      deliveries: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return NextResponse.json({
    monitors: monitors.map(serializeMonitor),
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { monitorTasks: { where: { isActive: true } } },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const limit = PLAN_MONITOR_LIMITS[user.planTier as PlanTier];
  if (user.monitorTasks.length >= limit) {
    return NextResponse.json(
      { error: `Monitor limit reached (${limit}). Upgrade your plan.` },
      { status: 403 }
    );
  }

  const body = await request.json();
  const username = body.targetUsername?.replace("@", "").trim();

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  const minInterval = PLAN_MONITOR_MIN_INTERVAL[user.planTier as PlanTier];
  const requestedInterval = body.checkInterval
    ? Number(body.checkInterval)
    : getDefaultMonitorInterval(user.planTier as PlanTier);

  if (requestedInterval < minInterval) {
    return NextResponse.json(
      {
        error: `Minimum check interval for your plan is ${minInterval}s. Upgrade for faster polling.`,
      },
      { status: 400 }
    );
  }

  let webhookUrl: string | null = null;
  let webhookSecret: string | null = null;

  if (body.webhookUrl?.trim()) {
    if (!PLAN_WEBHOOK_ACCESS[user.planTier as PlanTier]) {
      return NextResponse.json(
        { error: "Webhooks require Starter plan or higher." },
        { status: 403 }
      );
    }
    try {
      const parsed = new URL(body.webhookUrl.trim());
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return NextResponse.json({ error: "Webhook URL must use http or https" }, { status: 400 });
      }
      webhookUrl = parsed.toString();
      webhookSecret = generateWebhookSecret();
    } catch {
      return NextResponse.json({ error: "Invalid webhook URL" }, { status: 400 });
    }
  }

  const monitor = await prisma.monitorTask.create({
    data: {
      userId: session.user.id,
      targetUsername: username,
      keywords: body.keywords?.trim() || null,
      notificationChannels: body.channels || [],
      checkInterval: requestedInterval,
      status: MonitorStatus.ACTIVE,
      isActive: true,
      webhookUrl,
      webhookSecret,
    },
    include: {
      hits: true,
      deliveries: true,
    },
  });

  const response = serializeMonitor(monitor);
  if (webhookSecret) {
    return NextResponse.json({
      monitor: response,
      webhookSecretPlain: webhookSecret,
    });
  }

  return NextResponse.json({ monitor: response });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing monitor id" }, { status: 400 });
  }

  const task = await prisma.monitorTask.findFirst({
    where: { id, userId: session.user.id },
    include: { user: true },
  });

  if (!task) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const body = await request.json();
  const data: {
    isActive?: boolean;
    status?: MonitorStatus;
    checkInterval?: number;
    keywords?: string | null;
    webhookUrl?: string | null;
    webhookSecret?: string | null;
  } = {};

  let webhookSecretPlain: string | undefined;

  if (typeof body.isActive === "boolean") {
    data.isActive = body.isActive;
    data.status = body.isActive ? MonitorStatus.ACTIVE : MonitorStatus.PAUSED;
  }

  if (body.keywords !== undefined) {
    data.keywords = body.keywords?.trim() || null;
  }

  if (body.checkInterval !== undefined) {
    const minInterval = PLAN_MONITOR_MIN_INTERVAL[task.user.planTier];
    const interval = Number(body.checkInterval);
    if (interval < minInterval) {
      return NextResponse.json(
        { error: `Minimum check interval for your plan is ${minInterval}s` },
        { status: 400 }
      );
    }
    data.checkInterval = interval;
  }

  if (body.webhookUrl !== undefined) {
    if (!PLAN_WEBHOOK_ACCESS[task.user.planTier]) {
      return NextResponse.json(
        { error: "Webhooks require Starter plan or higher." },
        { status: 403 }
      );
    }

    const url = body.webhookUrl?.trim();
    if (!url) {
      data.webhookUrl = null;
      data.webhookSecret = null;
    } else {
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          return NextResponse.json({ error: "Webhook URL must use http or https" }, { status: 400 });
        }
        data.webhookUrl = parsed.toString();
        if (!task.webhookSecret || body.regenerateSecret) {
          webhookSecretPlain = generateWebhookSecret();
          data.webhookSecret = webhookSecretPlain;
        }
      } catch {
        return NextResponse.json({ error: "Invalid webhook URL" }, { status: 400 });
      }
    }
  }

  if (body.regenerateSecret && !body.webhookUrl && task.webhookUrl) {
    if (!PLAN_WEBHOOK_ACCESS[task.user.planTier]) {
      return NextResponse.json(
        { error: "Webhooks require Starter plan or higher." },
        { status: 403 }
      );
    }
    webhookSecretPlain = generateWebhookSecret();
    data.webhookSecret = webhookSecretPlain;
  }

  const monitor = await prisma.monitorTask.update({
    where: { id },
    data,
    include: {
      hits: {
        orderBy: { detectedAt: "desc" },
        take: 3,
      },
      deliveries: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return NextResponse.json({
    monitor: serializeMonitor(monitor),
    ...(webhookSecretPlain ? { webhookSecretPlain } : {}),
  });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing monitor id" }, { status: 400 });
  }

  await prisma.monitorTask.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
