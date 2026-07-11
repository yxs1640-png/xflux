"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Trash2,
  Webhook,
} from "lucide-react";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";

interface MonitorHit {
  id: string;
  tweetId: string;
  text: string;
  authorUsername: string;
  detectedAt: string;
}

interface WebhookDelivery {
  id: string;
  event: "TEST" | "HIT";
  status: "SUCCESS" | "FAILED";
  statusCode: number | null;
  responseTime: number | null;
  error: string | null;
  createdAt: string;
}

interface Monitor {
  id: string;
  targetUsername: string;
  keywords: string | null;
  isActive: boolean;
  status: "ACTIVE" | "PAUSED" | "ERROR";
  checkInterval: number;
  lastCheckAt: string | null;
  lastError: string | null;
  webhookUrl: string | null;
  hasWebhook: boolean;
  webhookSecret: string | null;
  hits: MonitorHit[];
  deliveries: WebhookDelivery[];
}

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return new Date(iso).toLocaleDateString();
}

function statusBadge(status: Monitor["status"], isActive: boolean) {
  if (!isActive || status === "PAUSED") {
    return <Badge variant="default">Paused</Badge>;
  }
  if (status === "ERROR") {
    return <Badge variant="warning">Error</Badge>;
  }
  return <Badge variant="success">Active</Badge>;
}

function MonitorWebhookPanel({
  monitor,
  canWebhook,
  onUpdate,
}: {
  monitor: Monitor;
  canWebhook: boolean;
  onUpdate: (m: Monitor, secret?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(monitor.webhookUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [plainSecret, setPlainSecret] = useState<string | null>(null);

  useEffect(() => {
    setUrl(monitor.webhookUrl ?? "");
  }, [monitor.webhookUrl]);

  async function saveWebhook() {
    setSaving(true);
    const res = await fetch(`/api/monitors?id=${monitor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhookUrl: url.trim() || null }),
    });
    setSaving(false);
    const data = await res.json();
    if (res.ok) {
      onUpdate(data.monitor, data.webhookSecretPlain);
      if (data.webhookSecretPlain) setPlainSecret(data.webhookSecretPlain);
      if (url.trim()) {
        trackClientEvent(AnalyticsEvents.WEBHOOK_CONFIGURED, { monitor_id: monitor.id });
      }
    } else {
      alert(data.error || "Failed to save webhook");
    }
  }

  async function regenerateSecret() {
    if (!monitor.webhookUrl && !url.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/monitors?id=${monitor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regenerateSecret: true }),
    });
    setSaving(false);
    const data = await res.json();
    if (res.ok) {
      onUpdate(data.monitor, data.webhookSecretPlain);
      if (data.webhookSecretPlain) setPlainSecret(data.webhookSecretPlain);
    } else {
      alert(data.error || "Failed to rotate secret");
    }
  }

  async function testWebhook() {
    setTesting(true);
    const res = await fetch(`/api/monitors/${monitor.id}/webhook/test`, { method: "POST" });
    setTesting(false);
    const data = await res.json();
    if (res.ok) {
      onUpdate({ ...monitor, deliveries: data.deliveries });
      trackClientEvent(AnalyticsEvents.WEBHOOK_TESTED, {
        monitor_id: monitor.id,
        success: data.result.success,
        status_code: data.result.statusCode ?? null,
      });
      alert(
        data.result.success
          ? `Test delivered (${data.result.statusCode}, ${data.result.responseTime}ms)`
          : `Test failed: ${data.result.error}`
      );
    } else {
      alert(data.error || "Test failed");
    }
  }

  return (
    <div className="border-t border-zinc-800 pt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wide hover:text-zinc-300"
      >
        <Webhook className="h-3.5 w-3.5" />
        Webhook
        {monitor.hasWebhook && (
          <Badge variant="sky" className="text-[10px] py-0">Configured</Badge>
        )}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {!canWebhook ? (
            <p className="text-sm text-zinc-500">
              Webhooks require Starter plan or higher.{" "}
              <Link href="/dashboard/billing" className="text-sky-400 hover:underline">
                Upgrade
              </Link>
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <Input
                  placeholder="https://your-server.com/webhooks/xflux"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 min-w-[200px]"
                />
                <Button size="sm" onClick={saveWebhook} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
                {monitor.hasWebhook && (
                  <>
                    <Button size="sm" variant="outline" onClick={testWebhook} disabled={testing}>
                      {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={regenerateSecret} disabled={saving}>
                      Rotate secret
                    </Button>
                  </>
                )}
              </div>

              {(plainSecret || monitor.webhookSecret) && (
                <div className="rounded-md bg-zinc-900/80 p-3 text-xs">
                  <p className="text-zinc-500 mb-1">Signing secret</p>
                  {plainSecret ? (
                    <div className="flex items-center gap-2">
                      <code className="text-sky-400 break-all">{plainSecret}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(plainSecret)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <code className="text-zinc-400">{monitor.webhookSecret} (masked)</code>
                  )}
                  <p className="text-zinc-600 mt-2">
                    See{" "}
                    <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
                      Webhook docs
                    </Link>{" "}
                    for signature verification.
                  </p>
                </div>
              )}

              {monitor.deliveries.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-zinc-600">Recent deliveries</p>
                  {monitor.deliveries.map((d) => (
                    <div
                      key={d.id}
                      className="flex flex-wrap items-center gap-2 text-xs text-zinc-500"
                    >
                      <Badge variant={d.status === "SUCCESS" ? "success" : "warning"}>
                        {d.status}
                      </Badge>
                      <span>{d.event}</span>
                      {d.statusCode != null && <span>{d.statusCode}</span>}
                      {d.responseTime != null && <span>{d.responseTime}ms</span>}
                      <span>{formatRelativeTime(d.createdAt)}</span>
                      {d.error && (
                        <span className="text-amber-500 truncate max-w-xs" title={d.error}>
                          {d.error}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function MonitorsPage() {
  const { data: session } = useSession();
  const canWebhook = session?.user?.planTier !== "FREE";
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [username, setUsername] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  async function fetchMonitors() {
    const res = await fetch("/api/monitors");
    if (res.ok) {
      const data = await res.json();
      setMonitors(data.monitors);
    }
  }

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 30_000);
    return () => clearInterval(interval);
  }, []);

  function updateMonitor(updated: Monitor) {
    setMonitors((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }

  async function createMonitor(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const hadKeywords = Boolean(keywords.trim());
    const res = await fetch("/api/monitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUsername: username, keywords }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setUsername("");
      setKeywords("");
      fetchMonitors();
      trackClientEvent(AnalyticsEvents.MONITOR_CREATED, {
        has_keywords: hadKeywords,
        check_interval: data.monitor?.checkInterval,
      });
    } else {
      const data = await res.json();
      alert(data.error || "Failed to create monitor");
    }
  }

  async function deleteMonitor(id: string) {
    await fetch(`/api/monitors?id=${id}`, { method: "DELETE" });
    fetchMonitors();
  }

  async function toggleMonitor(m: Monitor) {
    await fetch(`/api/monitors?id=${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !m.isActive }),
    });
    fetchMonitors();
  }

  async function checkNow(id: string) {
    setCheckingId(id);
    const res = await fetch(`/api/monitors/${id}/check`, { method: "POST" });
    setCheckingId(null);
    if (res.ok) {
      const data = await res.json();
      if (data.monitor) updateMonitor(data.monitor);
      else fetchMonitors();

      const r = data.result;
      trackClientEvent(AnalyticsEvents.MONITOR_CHECKED, {
        monitor_id: id,
        new_hits: r?.newHits ?? 0,
        baselined: Boolean(r?.baselined),
        had_error: Boolean(r?.error),
      });
      if (r?.error) {
        alert(`Check failed: ${r.error}`);
      } else if (r?.baselined) {
        alert("Baseline set. Future checks will alert on new tweets only.");
      } else if (r?.newHits > 0) {
        alert(`Found ${r.newHits} new tweet(s).`);
      } else {
        alert("Check complete. No new tweets since last check.");
      }
    } else {
      const data = await res.json();
      alert(data.error || "Check failed");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Monitors</h1>
        <p className="text-zinc-400">
          Track accounts for new tweets on your plan schedule. Use{" "}
          <strong className="text-white">Check now</strong> to poll immediately.{" "}
          <Link href="/docs/monitors" className="text-sky-400 hover:underline">
            Documentation
          </Link>
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Monitor</CardTitle>
          <CardDescription>Watch a user&apos;s new tweets (optional keyword filter)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createMonitor} className="flex flex-wrap gap-4">
            <Input
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="max-w-xs"
              required
            />
            <Input
              placeholder="Keywords (optional, comma-separated)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="max-w-xs"
            />
            <Button type="submit" disabled={loading}>
              <Plus className="h-4 w-4" />
              Add Monitor
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Monitors</CardTitle>
          <CardDescription>
            First check establishes a baseline — only newer tweets appear as hits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monitors.length === 0 ? (
            <p className="text-zinc-500 text-sm py-4">
              No monitors configured. Add one above to start tracking.
            </p>
          ) : (
            <div className="space-y-6">
              {monitors.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-zinc-800 p-4 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white">@{m.targetUsername}</span>
                        {statusBadge(m.status, m.isActive)}
                      </div>
                      {m.keywords && (
                        <p className="text-sm text-zinc-500 mt-1">Keywords: {m.keywords}</p>
                      )}
                      <p className="text-xs text-zinc-600 mt-1">
                        Every {m.checkInterval}s · Last check {formatRelativeTime(m.lastCheckAt)}
                      </p>
                      {m.lastError && (
                        <p className="text-xs text-amber-500 mt-1 truncate" title={m.lastError}>
                          {m.lastError}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => checkNow(m.id)}
                        disabled={checkingId === m.id}
                        title="Check now"
                      >
                        {checkingId === m.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMonitor(m)}
                        title={m.isActive ? "Pause" : "Resume"}
                      >
                        {m.isActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMonitor(m.id)}
                        className="text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {m.hits.length > 0 ? (
                    <div className="space-y-2 border-t border-zinc-800 pt-3">
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                        Recent hits
                      </p>
                      {m.hits.map((hit) => (
                        <div
                          key={hit.id}
                          className="rounded-md bg-zinc-900/50 px-3 py-2 text-sm"
                        >
                          <p className="text-zinc-300 line-clamp-2">{hit.text}</p>
                          <p className="text-xs text-zinc-600 mt-1">
                            {formatRelativeTime(hit.detectedAt)} · tweet {hit.tweetId}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-600 border-t border-zinc-800 pt-3">
                      No hits yet. Click refresh to run the first check.
                    </p>
                  )}

                  <MonitorWebhookPanel
                    monitor={m}
                    canWebhook={canWebhook}
                    onUpdate={(updated) => updateMonitor(updated)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
