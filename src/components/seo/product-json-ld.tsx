import { LEGAL } from "@/lib/legal-config";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { PLANS } from "@/lib/constants";

export function PricingProductJsonLd() {
  const offers = PLANS.map((plan) => ({
    "@type": "Offer" as const,
    name: plan.name,
    price: String(plan.price),
    priceCurrency: "USD",
    url: `${SITE_URL}/pricing`,
    description: `${plan.quota} API calls/mo, ${plan.monitors} monitors`,
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/pricing`,
    description:
      "X/Twitter read API, account monitors, signed webhooks, and MCP for Claude/Cursor.",
    provider: {
      "@type": "Organization",
      name: LEGAL.companyName,
      url: SITE_URL,
    },
    offers,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
