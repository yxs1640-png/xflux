import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LEGAL } from "@/lib/legal-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Acceptable Use Policy",
  description: `Acceptable use rules for the XFlux X/Twitter API and monitoring services.`,
  path: "/acceptable-use",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3 text-zinc-400 leading-relaxed">{children}</div>
    </section>
  );
}

export default function AcceptableUsePage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white mb-2">Acceptable Use Policy</h1>
          <p className="text-sm text-zinc-500 mb-10">
            Last updated: {LEGAL.effectiveDate} · {LEGAL.companyName}
          </p>

          <Section title="1. Purpose">
            <p>
              This Acceptable Use Policy (&quot;AUP&quot;) supplements our{" "}
              <a href="/terms" className="text-sky-400 hover:text-sky-300">
                Terms of Service
              </a>
              . It defines permitted and prohibited uses of the XFlux API and Monitor services.
            </p>
          </Section>

          <Section title="2. Permitted use">
            <p>You may use XFlux to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access public X (Twitter) profiles, tweets, and search results for lawful purposes</li>
              <li>Monitor public accounts you are authorized to track for alerts or research</li>
              <li>Integrate data into applications, analytics, or automation you operate</li>
              <li>Comply with applicable API quotas and plan limits</li>
            </ul>
          </Section>

          <Section title="3. Prohibited use">
            <p>You may not use XFlux to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violate X/Twitter terms, copyright, or any applicable law</li>
              <li>Harass, threaten, dox, or spam individuals or groups</li>
              <li>Collect or process private, non-public, or protected data without authorization</li>
              <li>Circumvent authentication, rate limits, or security controls of XFlux or third parties</li>
              <li>Distribute malware, phishing content, or fraudulent schemes</li>
              <li>Resell or sublicense API access without written permission</li>
              <li>Overload or disrupt the Service (including excessive concurrent requests beyond fair use)</li>
              <li>Use the Service for election interference, illegal surveillance, or human trafficking</li>
            </ul>
          </Section>

          <Section title="4. Rate limits & fair use">
            <p>
              Each plan includes monthly API quotas and monitor limits. Automated traffic must stay
              within documented limits. We may throttle or suspend accounts that degrade service
              quality for others.
            </p>
          </Section>

          <Section title="5. Enforcement">
            <p>
              We may investigate suspected violations and suspend or terminate accounts without
              refund. We may report illegal activity to authorities where appropriate.
            </p>
          </Section>

          <Section title="6. Contact">
            <p>
              Report abuse:{" "}
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
