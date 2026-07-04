"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchKeys() {
    const res = await fetch("/api/keys");
    if (res.ok) {
      const data = await res.json();
      setKeys(data.keys);
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  async function createKey() {
    setLoading(true);
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName || "Default" }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setCreatedKey(data.key);
      setNewKeyName("");
      fetchKeys();
    }
  }

  async function revokeKey(id: string) {
    if (!confirm("Revoke this API key?")) return;
    await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
    fetchKeys();
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">API Keys</h1>
        <p className="text-zinc-400">Manage keys for programmatic access</p>
      </div>

      {createdKey && (
        <Card className="mb-6 border-sky-500/30">
          <CardHeader>
            <CardTitle className="text-sky-400">New API Key Created</CardTitle>
            <CardDescription>Copy this key now — it won&apos;t be shown again.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <code className="flex-1 rounded-lg bg-zinc-800 p-3 text-sm text-sky-400 break-all">
              {createdKey}
            </code>
            <Button size="sm" onClick={() => copyKey(createdKey)}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Key</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Key name (e.g. Production)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={createKey} disabled={loading}>
            <Plus className="h-4 w-4" />
            Create Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="text-zinc-500 text-sm py-4">No API keys yet.</p>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{key.name}</span>
                      <Badge variant="sky">{key.keyPrefix}</Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Created {formatDate(key.createdAt)}
                      {key.lastUsedAt && ` · Last used ${formatDate(key.lastUsedAt)}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revokeKey(key.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
