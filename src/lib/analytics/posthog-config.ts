const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";

/** Strip accidental inline comments copied from .env examples. */
export function getPostHogHost(): string {
  const raw = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();
  if (!raw) return DEFAULT_POSTHOG_HOST;

  const withoutComment = raw.split("#")[0]?.trim().replace(/^["']|["']$/g, "") ?? "";
  if (!withoutComment) return DEFAULT_POSTHOG_HOST;

  try {
    const url = new URL(withoutComment);
    return url.origin;
  } catch {
    console.warn("[analytics] Invalid NEXT_PUBLIC_POSTHOG_HOST, using default:", raw);
    return DEFAULT_POSTHOG_HOST;
  }
}

export function getPostHogKey(): string | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return null;
  return key.split("#")[0]?.trim().replace(/^["']|["']$/g, "") || null;
}
