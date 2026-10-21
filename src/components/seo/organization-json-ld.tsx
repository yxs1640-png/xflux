import { LEGAL } from "@/lib/legal-config";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

/** Sitewide Organization graph for crawlers and AI citation grounding. */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: LEGAL.companyName,
    url: SITE_URL,
    logo: "https://raw.githubusercontent.com/yxs1640-png/xflux/main/mcp-server/icon-400.png",
    email: LEGAL.supportEmail,
    sameAs: [
      "https://github.com/yxs1640-png/xflux",
      "https://www.npmjs.com/package/@xflux/xflux-mcp-server",
      "https://glama.ai/mcp/servers/yxs1640-png/xflux",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
