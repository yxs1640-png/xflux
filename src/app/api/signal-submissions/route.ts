import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PlanTier } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSlugTaken } from "@/lib/custom-signals/community-topics";
import {
  buildSearchQueryFromAccounts,
  parseAccountList,
  SLUG_PATTERN,
} from "@/lib/custom-signals/topic-config";
import { getCustomSignalLimits } from "@/lib/custom-signals/service";
import { PLAN_SIGNAL_SUBMISSION_LIMITS } from "@/lib/quota";
import { SIGNAL_CATEGORIES, type SignalCategoryId } from "@/lib/signals/topics";

const VALID_CATEGORIES = new Set(SIGNAL_CATEGORIES.map((c) => c.id));

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await prisma.signalTopicSubmission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { communityTopic: { select: { slug: true, publishedAt: true } } },
  });

  const limits = await getCustomSignalLimits(session.user.id);

  return NextResponse.json({ submissions, limits });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const planTier = user.planTier as PlanTier;
  const pendingCount = await prisma.signalTopicSubmission.count({
    where: { userId: session.user.id, status: "PENDING" },
  });

  if (pendingCount >= PLAN_SIGNAL_SUBMISSION_LIMITS[planTier]) {
    return NextResponse.json(
      {
        error: `You already have ${pendingCount} pending submission(s). Wait for review or upgrade your plan.`,
      },
      { status: 403 }
    );
  }

  const body = await request.json();
  const proposedSlug = String(body.proposedSlug ?? "")
    .trim()
    .toLowerCase();
  const category = String(body.category ?? "") as SignalCategoryId;
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const intro = String(body.intro ?? "").trim();
  const accounts = parseAccountList(String(body.watchAccounts ?? ""));
  const searchQuery =
    String(body.searchQuery ?? "").trim() || buildSearchQueryFromAccounts(accounts);
  const pulseLabel = String(body.pulseLabel ?? title).trim().slice(0, 32);

  if (!SLUG_PATTERN.test(proposedSlug) || proposedSlug.length < 3 || proposedSlug.length > 48) {
    return NextResponse.json(
      { error: "Slug must be 3–48 chars, lowercase letters, numbers, and hyphens only." },
      { status: 400 }
    );
  }
  if (!VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }
  if (!title || title.length > 80) {
    return NextResponse.json({ error: "Title is required (max 80 chars)." }, { status: 400 });
  }
  if (!description || description.length > 300) {
    return NextResponse.json({ error: "Description is required (max 300 chars)." }, { status: 400 });
  }
  if (!intro || intro.length > 400) {
    return NextResponse.json({ error: "Intro is required (max 400 chars)." }, { status: 400 });
  }
  if (accounts.length === 0 || accounts.length > 10) {
    return NextResponse.json({ error: "Add 1–10 @accounts to watch." }, { status: 400 });
  }

  if (await isSlugTaken(proposedSlug)) {
    return NextResponse.json({ error: "This slug is already taken or pending review." }, { status: 409 });
  }

  const submission = await prisma.signalTopicSubmission.create({
    data: {
      userId: session.user.id,
      proposedSlug,
      category,
      title,
      description,
      intro,
      watchAccounts: accounts,
      searchQuery,
      pulseLabel,
    },
  });

  return NextResponse.json({ submission });
}
