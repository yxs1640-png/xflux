export async function register() {
  if (process.env.MONITOR_WORKER_ENABLED !== "true") return;
  if (process.env.NEXT_RUNTIME === "edge") return;

  const { startMonitorWorker } = await import("./lib/monitor-worker-runtime");
  startMonitorWorker();
}
