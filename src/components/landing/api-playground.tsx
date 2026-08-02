"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal-config";

const DEFAULT_USERNAME = "elonmusk";

const PLACEHOLDER_RESPONSE = `{
  "data": {
    "id": "44196397",
    "username": "elonmusk",
    "name": "Elon Musk",
    "followers_count": 241000000,
    "verified": true
  }
}`;

export function ApiPlayground() {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [response, setResponse] = useState(PLACEHOLDER_RESPONSE);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanUsername = username.trim().replace(/^@/, "") || DEFAULT_USERNAME;
  const curlCommand = `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  ${LEGAL.website}/api/v1/users/${cleanUsername}`;

  async function runLive() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/demo/profile?username=${encodeURIComponent(cleanUsername)}`
      );
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Request failed");
        return;
      }
      setResponse(JSON.stringify(json, null, 2));
      setIsLive(true);
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-black/40 overflow-hidden text-left">
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          API playground
        </span>
        {isLive && (
          <span className="text-xs text-emerald-400">Live response</span>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs text-zinc-500 mb-1.5 block">Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="elonmusk"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <Button
              type="button"
              size="sm"
              onClick={runLive}
              disabled={loading}
              className="shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run live
            </Button>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5">Demo: elonmusk, sama, or x</p>
        </div>

        <div>
          <div className="text-xs text-zinc-500 mb-1.5">With your API key</div>
          <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap break-all">
            {curlCommand}
          </pre>
        </div>

        <div>
          <div className="text-xs text-zinc-500 mb-1.5">Response</div>
          {error && <p className="text-xs text-amber-400 mb-2">{error}</p>}
          <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-300 overflow-x-auto max-h-64 overflow-y-auto">
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
}
