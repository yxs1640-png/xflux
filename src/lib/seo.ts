import type { Metadata } from "next";
import { LEGAL } from "./legal-config";

export const SITE_URL = LEGAL.website;
export const SITE_NAME = "XFlux";

export const DEFAULT_DESCRIPTION =
  "Affordable X/Twitter read API for profiles, timelines, and search, plus scheduled account monitors with signed HTTP webhooks. Free tier available — no credit card required.";

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
