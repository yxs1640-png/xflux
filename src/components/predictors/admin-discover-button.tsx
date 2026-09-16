"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SMART_MONEY } from "@/lib/predictor-discovery/copy";

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
      setMessage(SMART_MONEY.adminDone(data.authorsFound ?? 0, data.claimsAdded ?? 0));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button onClick={runDiscovery} disabled={loading} variant="outline">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          SMART_MONEY.adminRefresh
        )}
      </Button>
      {message && <p className="text-xs text-zinc-500 mt-2">{message}</p>}
    </div>
  );
}
