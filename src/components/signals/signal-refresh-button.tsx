"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { refreshCustomSignalFeed, refreshSignalFeed } from "@/lib/signals/actions";

type SignalRefreshButtonProps = {
  slug: string;
  cacheKey?: string;
};

export function SignalRefreshButton({ slug, cacheKey }: SignalRefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [spinning, setSpinning] = useState(false);

  function handleRefresh() {
    setSpinning(true);
    startTransition(async () => {
      if (cacheKey?.startsWith("custom-")) {
        const boardId = cacheKey.replace(/^custom-/, "");
        await refreshCustomSignalFeed(boardId);
      } else {
        await refreshSignalFeed(slug);
      }
      router.refresh();
      setSpinning(false);
    });
  }

  const loading = isPending || spinning;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={loading}
      className="gap-1.5 text-xs"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Refreshing…" : "Refresh now"}
    </Button>
  );
}
