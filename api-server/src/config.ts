export const config = {
  port: parseInt(process.env.PORT || "8080", 10),
  internalKey: process.env.XFLUX_INTERNAL_KEY || "",
  consumerApiBaseUrl: (process.env.CONSUMER_API_BASE_URL || "http://89.167.53.180").replace(/\/$/, ""),
  consumerApiKey: process.env.CONSUMER_API_KEY || "",
  consumerApiPrefix: process.env.CONSUMER_API_PREFIX || "/consumer",
};

export function assertConfig() {
  const missing: string[] = [];
  if (!config.internalKey) missing.push("XFLUX_INTERNAL_KEY");
  if (!config.consumerApiKey) missing.push("CONSUMER_API_KEY");
  if (missing.length) {
    const msg = `[config] Missing env vars: ${missing.join(", ")}`;
    if (process.env.NODE_ENV === "production") {
      console.error(msg);
      process.exit(1);
    }
    console.warn(msg);
  }
}
