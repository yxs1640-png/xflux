const SESSION_STORAGE_KEY = "xflux_sid";

/** Anonymous session id for UV — persisted in localStorage. */
export function getClientSessionId(): string {
  if (typeof window === "undefined") return "";

  try {
    let id = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

export function sendAnalyticsBeacon(body: object): void {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify(body);

  try {
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/event", blob);
      return;
    }
  } catch {
    // fall through to fetch
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
