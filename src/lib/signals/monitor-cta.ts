const MONITOR_CTA_SLUGS = new Set(["forex", "trading", "crypto", "twitter-api"]);

export type MonitorPrefill = {
  accounts: readonly string[];
  registerSrc: string;
  /** Optional keyword filter prefilled on the Add Monitor form */
  keywords?: string;
};

/** Landing paths that already get organic clicks — deep-link into Monitor create. */
export const LANDING_MONITOR_PRESETS: Record<string, MonitorPrefill> = {
  "use-cases/crypto-alerts": {
    accounts: ["blknoiz06", "WatcherGuru", "CryptoCred"],
    registerSrc: "crypto_alerts",
  },
  "use-cases/trading-alerts": {
    accounts: ["unusual_whales", "elerianm", "DeItaone"],
    registerSrc: "trading_alerts",
  },
  "blog/track-crypto-kols-twitter-api": {
    accounts: ["blknoiz06", "WatcherGuru", "lookonchain"],
    registerSrc: "blog_post",
  },
  "blog/twitter-to-discord-alerts": {
    accounts: ["unusual_whales", "DeItaone", "elonmusk"],
    registerSrc: "blog_post",
  },
  "twitter-discord-alerts": {
    accounts: ["unusual_whales", "DeItaone", "elonmusk"],
    registerSrc: "discord_alerts",
  },
  "compare/x-api": {
    accounts: ["TwitterDev", "XDevelopers", "elonmusk"],
    registerSrc: "compare_page",
  },
};

export function isSignalMonitorCtaSlug(slug: string): boolean {
  return MONITOR_CTA_SLUGS.has(slug);
}

export function getLandingMonitorPrefill(pathKey: string): MonitorPrefill | undefined {
  return LANDING_MONITOR_PRESETS[pathKey];
}

export function normalizeMonitorHandles(accounts: readonly string[]): string[] {
  const seen = new Set<string>();
  const handles: string[] = [];
  for (const raw of accounts) {
    const handle = raw.replace(/^@+/, "").trim();
    if (!handle || seen.has(handle.toLowerCase())) continue;
    seen.add(handle.toLowerCase());
    handles.push(handle);
  }
  return handles;
}

/** Deep-link into the Add Monitor form with one selected handle and the rest as chips. */
export function buildMonitorPrefillPath(
  accounts: readonly string[],
  selected?: string,
  keywords?: string
): string {
  const handles = normalizeMonitorHandles(accounts);
  if (handles.length === 0) {
    const empty = new URLSearchParams();
    if (keywords?.trim()) empty.set("keywords", keywords.trim());
    const qs = empty.toString();
    return qs ? `/dashboard/monitors?${qs}` : "/dashboard/monitors";
  }

  const selectedHandle = selected ? normalizeMonitorHandles([selected])[0] : undefined;
  const add =
    selectedHandle && handles.some((h) => h.toLowerCase() === selectedHandle.toLowerCase())
      ? handles.find((h) => h.toLowerCase() === selectedHandle.toLowerCase()) ?? handles[0]
      : handles[0];

  const params = new URLSearchParams();
  params.set("add", add);
  if (handles.length > 1) params.set("accounts", handles.join(","));
  if (keywords?.trim()) params.set("keywords", keywords.trim());
  return `/dashboard/monitors?${params.toString()}`;
}

export function isSafeMonitorNext(next: string | null | undefined): next is string {
  if (!next) return false;
  if (!next.startsWith("/dashboard/monitors")) return false;
  if (next.startsWith("//") || next.includes("://")) return false;
  return !next.includes("\\");
}

export function monitorCtaHref(options: {
  isLoggedIn: boolean;
  registerSrc: string;
  accounts: readonly string[];
  selected?: string;
  keywords?: string;
}): string {
  const path = buildMonitorPrefillPath(options.accounts, options.selected, options.keywords);
  if (options.isLoggedIn) return path;
  const params = new URLSearchParams();
  params.set("src", options.registerSrc);
  params.set("next", path);
  return `/register?${params.toString()}`;
}

export function parseMonitorPrefillParams(searchParams: {
  get(name: string): string | null;
}): { add: string; accounts: string[]; keywords: string } {
  const addRaw = searchParams.get("add");
  const accountsRaw = searchParams.get("accounts");
  const keywords = searchParams.get("keywords")?.trim() ?? "";
  const accounts = normalizeMonitorHandles([
    ...(addRaw ? [addRaw] : []),
    ...(accountsRaw ? accountsRaw.split(",") : []),
  ]);
  return { add: accounts[0] ?? "", accounts, keywords };
}
