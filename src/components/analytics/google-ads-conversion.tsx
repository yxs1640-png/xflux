import { getGoogleAdsConversionSendTo, getGoogleAdsId } from "@/lib/google-ads-config";

/**
 * Google Ads event snippet for /register.
 * Must be plain SSR <script> tags — Tag Assistant does not see afterInteractive scripts.
 */
export function GoogleAdsRegisterConversionTags() {
  const id = getGoogleAdsId();
  const sendTo = getGoogleAdsConversionSendTo();
  if (!id || !sendTo) return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)});
gtag('event', 'conversion', {'send_to': ${JSON.stringify(sendTo)}});
          `.trim(),
        }}
      />
    </>
  );
}
