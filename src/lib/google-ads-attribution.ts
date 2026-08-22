/** Google Ads click identifiers captured from landing URLs (client-side only). */

export const GOOGLE_ADS_CLICK_PARAM_KEYS = ["gclid", "gbraid", "wbraid"] as const;

export type GoogleAdsClickParamKey = (typeof GOOGLE_ADS_CLICK_PARAM_KEYS)[number];

export type GoogleAdsClickIds = Partial<Record<GoogleAdsClickParamKey, string>>;

const STORAGE_KEY = "xflux_gads_click_ids";
const STORAGE_TTL_MS = 90 * 24 * 60 * 60 * 1000;

type StoredClickIds = {
  ids: GoogleAdsClickIds;
  capturedAt: number;
};

function readStored(): StoredClickIds | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredClickIds;
    if (!parsed?.ids || typeof parsed.capturedAt !== "number") return null;
    if (Date.now() - parsed.capturedAt > STORAGE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(ids: GoogleAdsClickIds): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredClickIds = { ids, capturedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

/** Extract gclid / gbraid / wbraid from URL search params. */
export function parseGoogleAdsClickIds(
  searchParams: URLSearchParams | string
): GoogleAdsClickIds {
  const params =
    typeof searchParams === "string" ? new URLSearchParams(searchParams) : searchParams;
  const ids: GoogleAdsClickIds = {};

  for (const key of GOOGLE_ADS_CLICK_PARAM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) ids[key] = value;
  }

  return ids;
}

/** Persist click ids (latest non-empty values win, 90-day TTL). */
export function captureGoogleAdsClickIds(searchParams: URLSearchParams | string): GoogleAdsClickIds {
  const incoming = parseGoogleAdsClickIds(searchParams);
  if (Object.keys(incoming).length === 0) return getStoredGoogleAdsClickIds();

  const existing = readStored()?.ids ?? {};
  const merged = { ...existing, ...incoming };
  writeStored(merged);
  return merged;
}

export function getStoredGoogleAdsClickIds(): GoogleAdsClickIds {
  return readStored()?.ids ?? {};
}

/** Compact string for DB / analytics, e.g. `gclid=abc123`. */
export function formatGoogleAdsClickIds(ids: GoogleAdsClickIds): string | null {
  const parts = GOOGLE_ADS_CLICK_PARAM_KEYS.flatMap((key) => {
    const value = ids[key]?.trim();
    return value ? [`${key}=${value}`] : [];
  });
  if (parts.length === 0) return null;
  return parts.join("&").slice(0, 200);
}

/** Google enhanced-conversions email normalization. */
export function normalizeEmailForEnhancedConversion(email: string): string {
  let normalized = email.trim().toLowerCase();
  const at = normalized.indexOf("@");
  if (at === -1) return normalized;

  let local = normalized.slice(0, at);
  let domain = normalized.slice(at + 1);

  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") {
    local = local.replace(/\./g, "");
    const plus = local.indexOf("+");
    if (plus !== -1) local = local.slice(0, plus);
  }

  return `${local}@${domain}`;
}
