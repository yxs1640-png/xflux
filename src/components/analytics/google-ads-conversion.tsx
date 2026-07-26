import Script from "next/script";
import { getGoogleAdsConversionSendTo } from "@/lib/google-ads-config";

/** Fires Google Ads conversion on register (page-view goal). */
export function GoogleAdsConversionScript() {
  const sendTo = getGoogleAdsConversionSendTo();
  if (!sendTo) return null;

  return (
    <Script id="google-ads-conversion" strategy="afterInteractive">
      {`
        (function () {
          var sendTo = ${JSON.stringify(sendTo)};
          function fire() {
            if (typeof gtag === "function") {
              gtag("event", "conversion", { send_to: sendTo });
              return true;
            }
            return false;
          }
          if (fire()) return;
          var attempts = 0;
          var timer = setInterval(function () {
            attempts += 1;
            if (fire() || attempts > 20) clearInterval(timer);
          }, 300);
        })();
      `}
    </Script>
  );
}
