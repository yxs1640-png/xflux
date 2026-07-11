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

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-sm text-zinc-500 mb-10">
            Last updated: {LEGAL.effectiveDate} · {LEGAL.companyName}
          </p>

          <Section title="1. Agreement">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the XFlux
              platform, website, API, and monitoring services (collectively, the
              &quot;Service&quot;) operated by {LEGAL.companyName}, a {LEGAL.entityType}{" "}
              ({LEGAL.stateOfIncorporation}).
            </p>
            <p>
              By creating an account, accessing the Service, or paying for a subscription, you
              agree to these Terms. If you do not agree, do not use the Service.
            </p>
          </Section>

          <Section title="2. The Service">
            <p>
              XFlux provides subscription-based access to public X (Twitter) data via a REST API
              and optional account monitoring with webhook delivery. We may modify, suspend, or
              discontinue features with reasonable notice when possible.
            </p>
            <p>
              XFlux is not affiliated with, endorsed by, or sponsored by X Corp. All trademarks
              belong to their respective owners.
            </p>
          </Section>

          <Section title="3. Accounts">
            <p>
              You must provide accurate registration information and keep your credentials secure.
              You are responsible for all activity under your account and API keys. Notify us
              immediately at {LEGAL.supportEmail} if you suspect unauthorized access.
            </p>
          </Section>

          <Section title="4. Subscriptions & billing">
            <p>
              Paid plans are billed in advance on a recurring monthly basis through Stripe. Prices
              are listed on our Pricing page. By subscribing, you authorize us to charge your
              payment method each billing period until you cancel.
            </p>
            <p>
              Usage quotas, monitor limits, and check intervals depend on your plan tier. Exceeding
              API quotas may result in rate limiting (HTTP 429). See our{" "}
              <a href="/refund" className="text-sky-400 hover:text-sky-300">
                Refund Policy
              </a>{" "}
              for cancellation and refund terms.
            </p>
          </Section>

          <Section title="5. Acceptable use">
            <p>
              You must comply with our{" "}
              <a href="/acceptable-use" className="text-sky-400 hover:text-sky-300">
                Acceptable Use Policy
              </a>
              , applicable laws, and third-party platform terms. You may not use the Service for
              spam, harassment, credential theft, circumventing platform safeguards, or any
              unlawful purpose.
            </p>
          </Section>

          <Section title="6. Data & privacy">
            <p>
              Our collection and use of personal data is described in our{" "}
              <a href="/privacy" className="text-sky-400 hover:text-sky-300">
                Privacy Policy
              </a>
              . You are responsible for ensuring your use of X/Twitter data complies with
              applicable laws and platform policies.
            </p>
          </Section>

          <Section title="7. Disclaimer of warranties">
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
              WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE UNINTERRUPTED OR
              ERROR-FREE OPERATION.
            </p>
          </Section>

          <Section title="8. Limitation of liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, {LEGAL.companyName} SHALL NOT BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THE
              SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS BEFORE
              THE CLAIM.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              You may cancel your subscription at any time via the billing portal or by contacting
              support. We may suspend or terminate accounts that violate these Terms or pose a
              security or legal risk.
            </p>
          </Section>

          <Section title="10. Governing law">
            <p>
              These Terms are governed by the laws of the State of Delaware, United States,
              without regard to conflict-of-law principles. Disputes shall be resolved in the
              state or federal courts located in Delaware, unless otherwise required by applicable
              law.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              Questions about these Terms:{" "}
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
