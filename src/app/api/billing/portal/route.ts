import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isBillingCheckoutEnabled } from "@/lib/billing-config";
import { isActiveSubscriptionStatus } from "@/lib/billing";
import { getAppBaseUrl, getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured on this server" },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const hasActiveSubscription = isActiveSubscriptionStatus(user.subscriptionStatus);
  if (!isBillingCheckoutEnabled() && !hasActiveSubscription) {
    return NextResponse.json(
      { error: "Paid plans are coming soon. Self-serve billing is not open yet." },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  const baseUrl = getAppBaseUrl();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: portal.url });
}
