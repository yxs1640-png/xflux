"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ADOPTION_DRIVER_OPTIONS,
  CORE_NEED_OPTIONS,
  type AdoptionDriverId,
  type CoreNeedId,
} from "@/lib/feedback-config";
import { UserSourceSelect } from "@/components/user-source-select";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";

interface FeedbackFormProps {
  defaultEmail?: string;
  defaultName?: string;
  defaultUserSource?: string;
  defaultUserSourceDetail?: string;
}

function CheckboxGroup({
  title,
  description,
  options,
  selected,
  onChange,
}: {
  title: string;
  description: string;
  options: readonly { id: string; label: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = selected.includes(option.id);
          return (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                checked
                  ? "border-sky-500/50 bg-sky-500/10 text-zinc-200"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
              )}
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-sky-500 focus:ring-sky-500"
                checked={checked}
                onChange={() => toggle(option.id)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function FeedbackForm({
  defaultEmail = "",
  defaultName = "",
  defaultUserSource = "",
  defaultUserSourceDetail = "",
}: FeedbackFormProps) {
  const { data: session } = useSession();
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(defaultName);
  const [coreNeeds, setCoreNeeds] = useState<CoreNeedId[]>([]);
  const [adoptionDrivers, setAdoptionDrivers] = useState<AdoptionDriverId[]>([]);
  const [userSource, setUserSource] = useState(defaultUserSource);
  const [userSourceDetail, setUserSourceDetail] = useState(defaultUserSourceDetail);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const isLoggedIn = Boolean(session?.user);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: isLoggedIn ? undefined : email.trim(),
        name: name.trim() || undefined,
        coreNeeds,
        adoptionDrivers,
        userSource,
        userSourceDetail: userSource === "other" ? userSourceDetail : undefined,
        message: message.trim() || undefined,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        website,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to submit feedback");
      return;
    }

    setSubmittedId(data.id);
  }

  if (submittedId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-10 pb-10 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-sky-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Thanks for your feedback</h2>
          <p className="text-sm text-zinc-400">
            We received your message and will use it to prioritize what we build next.
          </p>
          <p className="mt-4 text-xs text-zinc-600 font-mono">Reference: {submittedId}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Share your feedback</CardTitle>
        <CardDescription>
          Tell us what you need from XFlux and what would make you use it more. Your input goes
          directly to the product roadmap.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {!isLoggedIn && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">Name (optional)</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          <UserSourceSelect
            value={userSource}
            onChange={setUserSource}
            detail={userSourceDetail}
            onDetailChange={setUserSourceDetail}
          />

          <CheckboxGroup
            title="What do you need most from XFlux?"
            description="Select everything that matches your core use case."
            options={CORE_NEED_OPTIONS}
            selected={coreNeeds}
            onChange={(ids) => setCoreNeeds(ids as CoreNeedId[])}
          />

          <CheckboxGroup
            title="What would make you use XFlux more?"
            description="If we shipped these, you'd be more likely to upgrade or stick around."
            options={ADOPTION_DRIVER_OPTIONS}
            selected={adoptionDrivers}
            onChange={(ids) => setAdoptionDrivers(ids as AdoptionDriverId[])}
          />

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white">
              Anything else we should know?
            </label>
            <p className="mb-2 text-sm text-zinc-500">
              Workflow details, pricing expectations, integrations, or pain points with other tools.
            </p>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. I need to monitor 20 accounts and push hits into Notion..."
              maxLength={5000}
            />
          </div>

          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit feedback"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
