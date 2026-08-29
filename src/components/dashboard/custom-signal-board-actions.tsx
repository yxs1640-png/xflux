"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomSignalBoardActions({
  boardId,
  boardName,
  accounts,
}: {
  boardId: string;
  boardName: string;
  accounts: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function createMonitors() {
    setLoading(true);
    setResult(null);
    const res = await fetch(`/api/custom-signals/${boardId}/create-monitors`, {
      method: "POST",
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setResult(data.error || "Failed");
      return;
    }
    const parts: string[] = [];
    if (data.created?.length) parts.push(`Created monitors: @${data.created.join(", @")}`);
    if (data.skipped?.length) parts.push(`Skipped: @${data.skipped.join(", @")}`);
    if (data.limitReached) parts.push("Monitor limit reached — upgrade or pause others.");
    setResult(parts.join(" · ") || "Done");
    router.refresh();
  }

  return (
    <div className="space-y-4 mb-8">
      <Link
        href="/dashboard/signals"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        All boards
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-white">{boardName}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Private board · {accounts.map((a) => `@${a}`).join(", ")}
        </p>
      </div>

      <Card className="border-sky-500/30 bg-sky-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Radar className="h-5 w-5 text-sky-400" />
            Turn into monitors
          </CardTitle>
          <CardDescription>
            Create one monitor per @account in this board. Existing monitors are skipped.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={createMonitors} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create monitors from board"}
          </Button>
          {result && <p className="text-sm text-zinc-400">{result}</p>}
          <Link href="/dashboard/monitors" className="text-sm text-sky-400 hover:underline">
            View monitors →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
