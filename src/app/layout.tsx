import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { GoogleAdsTag } from "@/components/analytics/google-ads-tag";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { Providers } from "@/components/providers";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { defaultLocale, type Locale } from "@/i18n/config";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — X/Twitter Read API & Account Monitors`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Twitter API",
    "X API",
    "Twitter API alternative",
    "free X API",
    "Twitter API proxy",
    "Twitter monitoring",
    "account monitor",
    "webhooks",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — X/Twitter Read API & Account Monitors`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — X/Twitter Read API & Account Monitors`,
    description: DEFAULT_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "saashub-verification": "2xo3o28ifaoc",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Static EN shell — locale switching happens in LocaleProvider (client).
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();

  return (
    <html lang={locale || defaultLocale}>
      <head>
        <GoogleAdsTag />
        <OrganizationJsonLd />
      </head>
      <body className="min-h-screen antialiased">
        <LocaleProvider
          initialLocale={(locale as Locale) || defaultLocale}
          initialMessages={messages as Record<string, unknown>}
        >
          <Providers>{children}</Providers>
        </LocaleProvider>
      </body>
    </html>
  );
}
