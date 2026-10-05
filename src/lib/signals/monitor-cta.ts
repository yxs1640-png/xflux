const MONITOR_CTA_SLUGS = new Set(["forex", "trading"]);

export function isSignalMonitorCtaSlug(slug: string): boolean {
  return MONITOR_CTA_SLUGS.has(slug);
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
  selected?: string
): string {
  const handles = normalizeMonitorHandles(accounts);
  if (handles.length === 0) return "/dashboard/monitors";

  const selectedHandle = selected ? normalizeMonitorHandles([selected])[0] : undefined;
  const add =
    selectedHandle && handles.some((h) => h.toLowerCase() === selectedHandle.toLowerCase())
      ? handles.find((h) => h.toLowerCase() === selectedHandle.toLowerCase()) ?? handles[0]
      : handles[0];

  const params = new URLSearchParams();
  params.set("add", add);
  if (handles.length > 1) params.set("accounts", handles.join(","));
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
}): string {
  const path = buildMonitorPrefillPath(options.accounts, options.selected);
  if (options.isLoggedIn) return path;
  const params = new URLSearchParams();
  params.set("src", options.registerSrc);
  params.set("next", path);
  return `/register?${params.toString()}`;
}

export function parseMonitorPrefillParams(searchParams: {
  get(name: string): string | null;
}): { add: string; accounts: string[] } {
  const addRaw = searchParams.get("add");
  const accountsRaw = searchParams.get("accounts");
  const accounts = normalizeMonitorHandles([
    ...(addRaw ? [addRaw] : []),
    ...(accountsRaw ? accountsRaw.split(",") : []),
  ]);
  return { add: accounts[0] ?? "", accounts };
}
