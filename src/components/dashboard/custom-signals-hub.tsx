"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  Radar,
  Send,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SIGNAL_CATEGORIES, type SignalCategoryId } from "@/lib/signals/topics";

type Board = {
  id: string;
  name: string;
  watchAccounts: string[];
  updatedAt: string;
};

type Submission = {
  id: string;
  proposedSlug: string;
  title: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
  createdAt: string;
  communityTopic: { slug: string } | null;
};

type Limits = {
  planTier: string;
  boardLimit: number;
  accountLimit: number;
  boardCount: number;
  submissionLimit: number;
};

export function CustomSignalsHub({
  initialBoards,
  initialSubmissions,
  limits,
  isAdmin,
}: {
  initialBoards: Board[];
  initialSubmissions: Submission[];
  limits: Limits;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"boards" | "submit" | "submissions" | "admin">("boards");
  const [boards, setBoards] = useState(initialBoards);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // New board form
  const [boardName, setBoardName] = useState("");
  const [boardAccounts, setBoardAccounts] = useState("");
  const [boardSearch, setBoardSearch] = useState("");
  const [boardKeywords, setBoardKeywords] = useState("");

  // Submit public topic form
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<SignalCategoryId>(
    SIGNAL_CATEGORIES[0]?.id ?? "niche"
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intro, setIntro] = useState("");
  const [submitAccounts, setSubmitAccounts] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [adminQueue, setAdminQueue] = useState<
    Array<{
      id: string;
      proposedSlug: string;
      title: string;
      user: { email: string };
      watchAccounts: string[];
    }>
  >([]);

  async function createBoard(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/custom-signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: boardName,
        watchAccounts: boardAccounts,
        searchQuery: boardSearch || undefined,
        monitorKeywords: boardKeywords || undefined,
      }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Failed to create board");
      return;
    }
    setBoardName("");
    setBoardAccounts("");
    setBoardSearch("");
    setBoardKeywords("");
    router.push(`/dashboard/signals/${data.board.id}`);
  }

  async function deleteBoard(id: string) {
    if (!confirm("Delete this signal board?")) return;
    await fetch(`/api/custom-signals/${id}`, { method: "DELETE" });
    setBoards((prev) => prev.filter((b) => b.id !== id));
  }

  async function submitPublicTopic(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/signal-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proposedSlug: slug,
        category,
        title,
        description,
        intro,
        watchAccounts: submitAccounts,
        searchQuery: searchQuery || undefined,
      }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Submission failed");
      return;
    }
    setSubmissions((prev) => [data.submission, ...prev]);
    setSlug("");
    setTitle("");
    setDescription("");
    setIntro("");
    setSubmitAccounts("");
    setSearchQuery("");
    setMessage("Submitted for review. We will email you when it is live on /signals.");
    setTab("submissions");
  }

  async function loadAdminQueue() {
    setLoading(true);
    const res = await fetch("/api/admin/signal-submissions");
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setAdminQueue(data.submissions);
    }
  }

  async function reviewSubmission(id: string, action: "approve" | "reject") {
    setLoading(true);
    const res = await fetch(`/api/admin/signal-submissions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(false);
    if (res.ok) {
      setAdminQueue((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    }
  }

  const canCreateBoard = boards.length < limits.boardLimit;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Custom Signals</h1>
        <p className="mt-2 text-zinc-400 max-w-2xl">
          Build private signal boards, turn them into monitors, or submit a public topic for the
          Signals directory.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
        {(
          [
            ["boards", "My boards"],
            ["submit", "Submit public topic"],
            ["submissions", "My submissions"],
            ...(isAdmin ? [["admin", "Review queue"] as const] : []),
          ] as Array<[typeof tab, string]>
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTab(key);
              if (key === "admin") loadAdminQueue();
            }}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              tab === key
                ? "bg-sky-500/10 text-sky-400"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {message && (
        <p className="text-sm text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-lg px-4 py-3">
          {message}
        </p>
      )}

      {tab === "boards" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Boards ({boards.length}/{limits.boardLimit})
              </h2>
              <Link href="/signals">
                <Button variant="ghost" size="sm">
                  Browse public signals
                </Button>
              </Link>
            </div>
            {boards.length === 0 ? (
              <p className="text-sm text-zinc-500">No boards yet. Create one to track @accounts.</p>
            ) : (
              <ul className="space-y-3">
                {boards.map((board) => (
                  <li key={board.id}>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle className="text-base">{board.name}</CardTitle>
                            <CardDescription>
                              {board.watchAccounts.map((a) => `@${a}`).join(", ")}
                            </CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteBoard(board.id)}
                            aria-label="Delete board"
                          >
                            <Trash2 className="h-4 w-4 text-zinc-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/dashboard/signals/${board.id}`}>
                          <Button size="sm">
                            <Sparkles className="h-4 w-4" />
                            Open digest
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5 text-sky-400" />
                New signal board
              </CardTitle>
              <CardDescription>
                Private digest — up to {limits.accountLimit} accounts on {limits.planTier}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createBoard} className="space-y-4">
                <Input
                  placeholder="Board name (e.g. My AI watchlist)"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  disabled={!canCreateBoard || loading}
                />
                <textarea
                  placeholder="@sama, @karpathy — one per line or comma-separated"
                  value={boardAccounts}
                  onChange={(e) => setBoardAccounts(e.target.value)}
                  disabled={!canCreateBoard || loading}
                  rows={4}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                />
                <Input
                  placeholder="Optional search query (leave blank to auto-generate)"
                  value={boardSearch}
                  onChange={(e) => setBoardSearch(e.target.value)}
                  disabled={!canCreateBoard || loading}
                />
                <Input
                  placeholder="Optional monitor keywords (when you create monitors)"
                  value={boardKeywords}
                  onChange={(e) => setBoardKeywords(e.target.value)}
                  disabled={!canCreateBoard || loading}
                />
                <Button type="submit" disabled={!canCreateBoard || loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create board"}
                </Button>
                {!canCreateBoard && (
                  <p className="text-xs text-zinc-500">
                    Board limit reached.{" "}
                    <Link href="/dashboard/billing" className="text-sky-400 hover:underline">
                      Upgrade
                    </Link>{" "}
                    for more.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "submit" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-sky-400" />
              Submit a public signal topic
            </CardTitle>
            <CardDescription>
              After review, your topic goes live at{" "}
              <code className="text-zinc-400">/signals/your-slug</code> and into the public
              directory (Plan C — community SEO).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitPublicTopic} className="space-y-4">
              <Input
                placeholder="Slug (e.g. quant-trading)"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SignalCategoryId)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
              >
                {SIGNAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <Input placeholder="Title (e.g. Quant Trading)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input
                placeholder="SEO description (max 300 chars)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <textarea
                placeholder="Intro paragraph shown on the digest page"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
              />
              <textarea
                placeholder="@accounts to watch (1–10)"
                value={submitAccounts}
                onChange={(e) => setSubmitAccounts(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
              />
              <Input
                placeholder="Optional Twitter search query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "submissions" && (
        <ul className="space-y-3 max-w-2xl">
          {submissions.length === 0 ? (
            <p className="text-sm text-zinc-500">No submissions yet.</p>
          ) : (
            submissions.map((s) => (
              <li key={s.id}>
                <Card>
                  <CardContent className="pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{s.title}</p>
                      <p className="text-sm text-zinc-500">/signals/{s.proposedSlug}</p>
                      {s.adminNote && (
                        <p className="text-xs text-zinc-400 mt-1">Note: {s.adminNote}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {s.status === "PENDING" && (
                        <Badge variant="warning">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {s.status === "APPROVED" && (
                        <Badge variant="success">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      )}
                      {s.status === "REJECTED" && (
                        <Badge variant="default">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                      {s.communityTopic && (
                        <Link href={`/signals/${s.communityTopic.slug}`}>
                          <Button size="sm" variant="outline">
                            View page
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))
          )}
        </ul>
      )}

      {tab === "admin" && isAdmin && (
        <div className="space-y-3 max-w-2xl">
          {adminQueue.length === 0 ? (
            <p className="text-sm text-zinc-500">No pending submissions.</p>
          ) : (
            adminQueue.map((s) => (
              <Card key={s.id}>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <p className="font-medium text-white">{s.title}</p>
                    <p className="text-sm text-zinc-500">
                      /signals/{s.proposedSlug} · {s.user.email}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {s.watchAccounts.map((a) => `@${a}`).join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => reviewSubmission(s.id, "approve")} disabled={loading}>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reviewSubmission(s.id, "reject")}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
