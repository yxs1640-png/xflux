import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LEGAL } from "@/lib/legal-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${LEGAL.companyName} collects, uses, and protects your data on the XFlux platform.`,
  path: "/privacy",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3 text-zinc-400 leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-zinc-500 mb-10">
            Last updated: {LEGAL.effectiveDate} · {LEGAL.companyName}
          </p>

          <Section title="1. Overview">
            <p>
              {LEGAL.companyName} (&quot;XFlux,&quot; &quot;we,&quot; &quot;us&quot;) respects your
              privacy. This Privacy Policy explains how we collect, use, and share information when
              you use our website, dashboard, API, and monitoring services at {LEGAL.website}.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <p>
              <strong className="text-zinc-300">Account information:</strong> email address, name,
              password (stored hashed), and plan tier when you register.
            </p>
            <p>
              <strong className="text-zinc-300">Billing information:</strong> processed by Stripe.
              We do not store full payment card numbers. We may receive billing status, customer
              ID, and subscription metadata from Stripe.
            </p>
            <p>
              <strong className="text-zinc-300">Usage data:</strong> API endpoint, method, status
              code, response time, and quota consumption associated with your account.
            </p>
            <p>
              <strong className="text-zinc-300">Monitor configuration:</strong> usernames you
              choose to monitor, keywords, webhook URLs, and delivery logs.
            </p>
            <p>
              <strong className="text-zinc-300">Technical data:</strong> IP address, browser type,
              and device information collected automatically via server logs and cookies necessary
              for authentication.
            </p>
          </Section>

          <Section title="3. How we use information">
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, operate, and improve the Service</li>
              <li>Authenticate users and enforce API quotas</li>
              <li>Process subscriptions and send billing-related communications</li>
              <li>Monitor service reliability and prevent abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="4. How we share information">
            <p>
              <strong className="text-zinc-300">Service providers:</strong> We use third parties
              that process data on our behalf, including Stripe (payments), Supabase (database
              hosting), Vercel (application hosting), and Fly.io (background workers). They access
              data only to perform services for us.
            </p>
            <p>
              <strong className="text-zinc-300">Webhooks you configure:</strong> When you set a
              monitor webhook URL, we send tweet alert payloads to that endpoint at your direction.
            </p>
            <p>
              <strong className="text-zinc-300">Legal requirements:</strong> We may disclose
              information if required by law or to protect rights, safety, and security.
            </p>
            <p>We do not sell your personal information.</p>
          </Section>

          <Section title="5. Data retention">
            <p>
              We retain account and usage data while your account is active and as needed for
              billing, security, and legal compliance. You may request deletion of your account by
              contacting {LEGAL.supportEmail}.
            </p>
          </Section>

          <Section title="6. Security">
            <p>
              We use industry-standard measures including hashed passwords, API key hashing, HTTPS,
              and access controls. No method of transmission or storage is 100% secure.
            </p>
          </Section>

          <Section title="7. International users">
            <p>
              We are based in the United States. If you access the Service from outside the U.S.,
              your information may be processed in the U.S. and other countries where our providers
              operate.
            </p>
          </Section>

          <Section title="8. Your rights">
            <p>
              Depending on your location, you may have rights to access, correct, delete, or export
              personal data. Contact {LEGAL.supportEmail} to submit a request. We will respond within
              a reasonable timeframe.
            </p>
          </Section>

          <Section title="9. Children">
            <p>
              The Service is not directed to individuals under 18. We do not knowingly collect data
              from children.
            </p>
          </Section>

          <Section title="10. Changes">
            <p>
              We may update this Privacy Policy from time to time. We will post the revised version
              on this page and update the &quot;Last updated&quot; date.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              Privacy inquiries:{" "}
              <a href={`mailto:${LEGAL.legalEmail}`} className="text-sky-400 hover:text-sky-300">
                {LEGAL.legalEmail}
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
