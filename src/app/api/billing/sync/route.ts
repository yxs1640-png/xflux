import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";
import { syncUserBillingFromStripe } from "@/lib/stripe-webhooks";

/** Fallback sync when Stripe webhook delivery is delayed or misconfigured. */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let checkoutSessionId: string | null = null;
  try {
    const body = await request.json();
    if (typeof body?.sessionId === "string") {
      checkoutSessionId = body.sessionId;
    }
  } catch {
    // empty body is fine
  }

  if (!checkoutSessionId) {
    checkoutSessionId = request.nextUrl.searchParams.get("session_id");
  }

  try {
    const result = await syncUserBillingFromStripe(session.user.id, checkoutSessionId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[billing/sync]", err);
    return NextResponse.json({ error: "Failed to sync subscription" }, { status: 500 });
  }
}
