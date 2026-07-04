import "server-only";

import { pollDueMonitors } from "./monitor-poll";

export function startMonitorWorker() {
  const tickMs = Number(process.env.MONITOR_WORKER_TICK_MS || 30_000);
  const batchSize = Number(process.env.MONITOR_WORKER_BATCH_SIZE || 5);

  async function tick() {
    try {
      const results = await pollDueMonitors(batchSize);
      if (results.length > 0) {
        const hits = results.reduce((n, r) => n + r.newHits, 0);
        console.log(`[monitor-worker] polled=${results.length} newHits=${hits}`);
      }
    } catch (err) {
      console.error("[monitor-worker] tick failed:", err);
    }
  }

  console.log(`[monitor-worker] enabled tick=${tickMs}ms batch=${batchSize}`);
  void tick();
  setInterval(tick, tickMs);
}
