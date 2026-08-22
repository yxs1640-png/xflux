"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureGoogleAdsClickIds } from "@/lib/google-ads-attribution";

function GoogleAdsAttributionCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureGoogleAdsClickIds(searchParams);
  }, [searchParams]);

  return null;
}

/** Persist gclid/gbraid/wbraid from ad landing URLs for later conversion matching. */
export function GoogleAdsAttribution() {
  return (
    <Suspense fallback={null}>
      <GoogleAdsAttributionCapture />
    </Suspense>
  );
}
