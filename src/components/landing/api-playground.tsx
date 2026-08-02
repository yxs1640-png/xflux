"use client";

import { useMemo, useState } from "react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal-config";
import { cn } from "@/lib/utils";
import {
  DEMO_PLACEHOLDER_RESPONSE,
  DEMO_PROFILE_PRESETS,
  DEMO_SEARCH_PRESETS,
  DEMO_TABS,
  DEMO_TIMELINE_PRESETS,
  type DemoTab,
} from "@/lib/demo-config";

const DEFAULT_USERNAME = "elonmusk";
const DEFAULT_SEARCH = DEMO_SEARCH_PRESETS[0].query;

function buildDemoPath(tab: DemoTab, profileUser: string, searchQuery: string, timelineUser: string) {
  switch (tab) {
    case "profile":
      return `/api/demo/profile?username=${encodeURIComponent(profileUser)}`;
    case "search":
      return `/api/demo/search?q=${encodeURIComponent(searchQuery)}`;
    case "timeline":
      return `/api/demo/timeline?username=${encodeURIComponent(timelineUser)}`;
  }
}

function buildAuthPath(tab: DemoTab, profileUser: string, searchQuery: string, timelineUser: string) {
  switch (tab) {
    case "profile":
      return `${LEGAL.website}/api/v1/users/${profileUser}`;
    case "search":
      return `${LEGAL.website}/api/v1/search?q=${encodeURIComponent(searchQuery)}&limit=20`;
    case "timeline":
      return `${LEGAL.website}/api/v1/users/${timelineUser}/tweets?limit=10`;
  }
}

export function ApiPlayground() {
  const [tab, setTab] = useState<DemoTab>("profile");
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [timelineUser, setTimelineUser] = useState(DEFAULT_USERNAME);
  const [searchQuery, setSearchQuery] = useState<string>(DEFAULT_SEARCH);
  const [response, setResponse] = useState(DEMO_PLACEHOLDER_RESPONSE);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanUsername = username.trim().replace(/^@/, "") || DEFAULT_USERNAME;
  const cleanTimelineUser = timelineUser.trim().replace(/^@/, "") || DEFAULT_USERNAME;
  const cleanSearchQuery = searchQuery.trim() || DEFAULT_SEARCH;

  const demoPath = useMemo(
    () => buildDemoPath(tab, cleanUsername, cleanSearchQuery, cleanTimelineUser),
    [tab, cleanUsername, cleanSearchQuery, cleanTimelineUser]
  );

  const authPath = useMemo(
    () => buildAuthPath(tab, cleanUsername, cleanSearchQuery, cleanTimelineUser),
    [tab, cleanUsername, cleanSearchQuery, cleanTimelineUser]
  );

  const curlCommand = `curl -H "Authorization: Bearer xflux_YOUR_KEY" \\
  ${authPath}`;

  const activeHint = DEMO_TABS.find((t) => t.id === tab)?.hint ?? "";

  function switchTab(next: DemoTab) {
    setTab(next);
    setError(null);
    setIsLive(false);
    setResponse(DEMO_PLACEHOLDER_RESPONSE);
  }

  async function runLive() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(demoPath);
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Request failed");
        setIsLive(false);
        return;
      }
      setResponse(JSON.stringify(json, null, 2));
      setIsLive(true);
    } catch {
      setError("Network error — try again");
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-black/40 overflow-hidden text-left">
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-950 p-1">
          {DEMO_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTab(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
                tab === item.id
                  ? "bg-sky-500/20 text-sky-300"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {isLive ? (
          <span className="text-xs text-emerald-400">Live response</span>
        ) : (
          <span className="text-xs text-zinc-500">Ready</span>
        )}
      </div>

      <div className="p-4 space-y-4">
        <p className="text-xs text-zinc-500">{activeHint}</p>

        {tab === "profile" && (
          <PlaygroundInput
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="elonmusk"
            presets={DEMO_PROFILE_PRESETS.map((p) => ({
              label: p.label,
              onSelect: () => setUsername(p.username),
            }))}
            onRun={runLive}
            loading={loading}
          />
        )}

        {tab === "search" && (
          <PlaygroundInput
            label="Search query"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="from:elonmusk"
            presets={DEMO_SEARCH_PRESETS.map((p) => ({
              label: p.label,
              onSelect: () => setSearchQuery(p.query),
            }))}
            onRun={runLive}
            loading={loading}
          />
        )}

        {tab === "timeline" && (
          <PlaygroundInput
            label="Account"
            value={timelineUser}
            onChange={setTimelineUser}
            placeholder="elonmusk"
            presets={DEMO_TIMELINE_PRESETS.map((p) => ({
              label: p.label,
              onSelect: () => setTimelineUser(p.username),
            }))}
            onRun={runLive}
            loading={loading}
          />
        )}

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-zinc-500">Demo request</span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
              GET
            </span>
          </div>
          <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-400 overflow-x-auto whitespace-pre-wrap break-all">
            {demoPath}
          </pre>
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
          <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-300 overflow-x-auto max-h-64 overflow-y-auto font-mono">
            {response}
          </pre>
        </div>

        <p className="text-[11px] text-zinc-600 text-center">
          Public demo · cached ~5 min · no signup · full API after free registration
        </p>
      </div>
    </div>
  );
}

function PlaygroundInput({
  label,
  value,
  onChange,
  placeholder,
  presets,
  onRun,
  loading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  presets: { label: string; onSelect: () => void }[];
  onRun: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-zinc-500 mb-1.5 block">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <Button type="button" size="sm" onClick={onRun} disabled={loading} className="shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Run live
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={preset.onSelect}
            className="rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-400 hover:border-sky-500/40 hover:text-sky-300 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
