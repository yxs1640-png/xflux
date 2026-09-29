"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OpsRefreshButton({ generatedAt }: { generatedAt: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(() => router.refresh())}
        className="border-zinc-700"
      >
        <RefreshCw className={`mr-2 h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} />
        {pending ? "Refreshing…" : "Refresh"}
      </Button>
      <span className="text-xs text-zinc-500">
        Last load: {generatedAt.replace("T", " ").slice(0, 19)} UTC
      </span>
    </div>
  );
}
