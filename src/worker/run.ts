/**
 * Monitor worker for Fly.io (compiled to dist/worker/run.js).
 * Exposes GET /health on PORT for Fly health checks.
 */
import http from "http";
import { pollDueMonitors } from "../lib/monitor-poll";

const tickMs = Number(process.env.MONITOR_WORKER_TICK_MS || 30_000);
const batchSize = Number(process.env.MONITOR_WORKER_BATCH_SIZE || 5);
const port = Number(process.env.PORT || 8080);

http
  .createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          service: "xflux-monitor-worker",
          timestamp: new Date().toISOString(),
        })
      );
      return;
    }
    res.writeHead(404);
    res.end();
  })
  .listen(port, () => {
    console.log(`[xflux-worker] health server on :${port}`);
  });

async function tick() {
  const started = Date.now();
  try {
    const results = await pollDueMonitors(batchSize);
    if (results.length > 0) {
      const hits = results.reduce((n, r) => n + r.newHits, 0);
      const errors = results.filter((r) => r.error).length;
      console.log(
        `[xflux-worker] polled=${results.length} newHits=${hits} errors=${errors} ${Date.now() - started}ms`
      );
    }
  } catch (err) {
    console.error("[xflux-worker] tick failed:", err);
  }
}

console.log(`[xflux-worker] starting tick=${tickMs}ms batch=${batchSize}`);
void tick();
setInterval(tick, tickMs);
