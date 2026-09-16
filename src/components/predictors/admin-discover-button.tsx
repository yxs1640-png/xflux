"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminDiscoverButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function runDiscovery() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/predictors/discover", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessage(
        `Done: ${data.authorsFound} predictors, ${data.claimsAdded} claims added (${data.seedsScanned} seeds scanned).`
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Discovery failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button onClick={runDiscovery} disabled={loading} variant="outline">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run discovery (admin)"}
      </Button>
      {message && <p className="text-xs text-zinc-500 mt-2">{message}</p>}
    </div>
  );
}
