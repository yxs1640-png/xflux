import Script from "next/script";
import { getGoogleAdsId } from "@/lib/google-ads-config";

const googleAdsId = getGoogleAdsId();

export function GoogleAdsTag() {
  if (!googleAdsId) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
        strategy="beforeInteractive"
      />
      <Script id="google-ads-gtag" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAdsId}', { allow_enhanced_conversions: true });
        `}
      </Script>
    </>
  );
}
