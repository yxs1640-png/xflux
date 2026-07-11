import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateApiKey, hashPassword } from "@/lib/crypto";
import { normalizeUserSourceFields, userSourceSchema } from "@/lib/user-source-schema";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { identifyServerUser, trackServerEvent } from "@/lib/analytics/server";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
  })
  .and(userSourceSchema);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(data.password);
    const { key, hash, prefix } = generateApiKey();
    const source = normalizeUserSourceFields(data);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        passwordHash,
        signupSource: source.userSource,
        signupSourceDetail: source.userSourceDetail,
        apiKeys: {
          create: {
            name: "Default",
            keyHash: hash,
            keyPrefix: prefix,
          },
        },
      },
    });

    await identifyServerUser(user.id, {
      email: user.email,
      name: user.name ?? undefined,
      plan_tier: user.planTier,
      ...(source.userSource ? { signup_source: source.userSource } : {}),
      ...(source.userSourceDetail ? { signup_source_detail: source.userSourceDetail } : {}),
    });
    await trackServerEvent(user.id, AnalyticsEvents.SIGNUP_COMPLETED, {
      ...(source.userSource ? { signup_source: source.userSource } : {}),
      ...(source.userSourceDetail ? { signup_source_detail: source.userSourceDetail } : {}),
    });

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      apiKey: key,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
