import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { assertConfig, config } from "./config.js";
import { apiRoutes } from "./routes/api.js";

assertConfig();

const app = new Hono();

app.use("*", async (c, next) => {
  if (c.req.path === "/health") return next();

  const key = c.req.header("x-flux-internal-key");
  if (!config.internalKey || key !== config.internalKey) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await next();
});

app.get("/health", (c) =>
  c.json({
    status: "ok",
    service: "xflux-api-server",
    timestamp: new Date().toISOString(),
  })
);

app.route("/v1", apiRoutes);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message, code: "API_ERROR" }, err.status);
  }
  console.error(err);
  return c.json({ error: "Internal server error", code: "INTERNAL" }, 500);
});

serve({ fetch: app.fetch, port: config.port, hostname: "0.0.0.0" }, (info) => {
  console.log(`XFlux API server listening on 0.0.0.0:${info.port}`);
});
