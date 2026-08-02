import { DEMO_CACHE_MS } from "@/lib/demo-config";

const cache = new Map<string, { expires: number; body: object }>();

export function getDemoCache(key: string): object | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.body;
  return null;
}

export function setDemoCache(key: string, body: object): void {
  cache.set(key, { expires: Date.now() + DEMO_CACHE_MS, body });
}
