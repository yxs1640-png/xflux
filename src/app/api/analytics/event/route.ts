import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  isAllowedClientEvent,
  isValidSessionId,
  normalizePagePath,
  recordPageViewAsync,
  recordProductEventAsync,
} from "@/lib/analytics/db-store";

type PageviewBody = {
  type: "pageview";
  path: string;
  sessionId: string;
};

type EventBody = {
  type: "event";
  event: string;
  sessionId?: string;
  path?: string;
  properties?: Record<string, unknown>;
};

export async function POST(req: Request) {
  let body: PageviewBody | EventBody;
  try {
    body = (await req.json()) as PageviewBody | EventBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.type === "pageview") {
    const path = normalizePagePath(body.path);
    if (!path || !isValidSessionId(body.sessionId)) {
      return NextResponse.json({ ok: true });
    }
    recordPageViewAsync(path, body.sessionId);
    return NextResponse.json({ ok: true });
  }

  if (body.type === "event") {
    if (!isAllowedClientEvent(body.event)) {
      return NextResponse.json({ error: "Event not allowed" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const path = body.path ? normalizePagePath(body.path) : null;

    recordProductEventAsync({
      event: body.event,
      userId: session?.user?.id,
      sessionId: body.sessionId && isValidSessionId(body.sessionId) ? body.sessionId : null,
      path,
      props: body.properties,
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
