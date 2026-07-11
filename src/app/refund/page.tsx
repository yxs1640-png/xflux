import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LEGAL } from "@/lib/legal-config";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3 text-zinc-400 leading-relaxed">{children}</div>
    </section>
  );
}

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white mb-2">Refund Policy</h1>
          <p className="text-sm text-zinc-500 mb-10">
            Last updated: {LEGAL.effectiveDate} · {LEGAL.companyName}
          </p>

          <Section title="1. Subscriptions">
            <p>
              Paid plans (Basic, Pro, and future paid tiers) are billed monthly in advance through
              Stripe. Your subscription renews automatically each billing period unless canceled.
            </p>
          </Section>

          <Section title="2. Cancellation">
            <p>
              You may cancel at any time from the Dashboard billing portal (&quot;Manage
              billing&quot;) or by emailing {LEGAL.supportEmail}. Cancellation stops future charges.
              Access to paid features continues until the end of the current billing period.
            </p>
          </Section>

          <Section title="3. Refunds">
            <p>
              <strong className="text-zinc-300">General policy:</strong> Subscription fees are
              non-refundable except where required by law or at our sole discretion.
            </p>
            <p>
              <strong className="text-zinc-300">7-day satisfaction window:</strong> If you are a
              new paying customer and experience a material service failure within seven (7) days of
              your first payment, contact us at {LEGAL.supportEmail}. We may offer a full or partial
              refund or account credit after review.
            </p>
            <p>
              <strong className="text-zinc-300">Downgrades:</strong> When you downgrade or cancel,
              we do not prorate refunds for the current period unless required by law.
            </p>
          </Section>

          <Section title="4. Free tier">
            <p>
              The Free plan requires no payment. No refunds apply to free accounts.
            </p>
          </Section>

          <Section title="5. Chargebacks">
            <p>
              If you believe a charge is incorrect, contact us before initiating a chargeback so we
              can resolve the issue. Accounts with fraudulent chargebacks may be suspended.
            </p>
          </Section>

          <Section title="6. Contact">
            <p>
              Billing questions:{" "}
              <a href={`mailto:${LEGAL.supportEmail}`} className="text-sky-400 hover:text-sky-300">
                {LEGAL.supportEmail}
              </a>
            </p>
          </Section>

          <p className="text-xs text-zinc-600 mt-12">
            Template for Stripe Atlas / SaaS compliance. Have a qualified attorney review before
            relying on this document for legal purposes.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
