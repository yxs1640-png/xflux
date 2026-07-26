/** Google Ads AW- tag id, e.g. AW-18349917952 */
export function getGoogleAdsId(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
  return id && id.startsWith("AW-") ? id : null;
}

/** Conversion label from Google Ads → Goals → conversion action details */
export function getGoogleAdsConversionSendTo(): string | null {
  const id = getGoogleAdsId();
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
  if (!id || !label) return null;
  return `${id}/${label}`;
}
