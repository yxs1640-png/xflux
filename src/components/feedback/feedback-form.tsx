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
  FEEDBACK_REWARD_CALLS_DISPLAY,
  type AdoptionDriverId,
  type CoreNeedId,
} from "@/lib/feedback-config";
import { UserSourceSelect } from "@/components/user-source-select";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";

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
  const [capabilityRequest, setCapabilityRequest] = useState("");
  const [notifyOnShip, setNotifyOnShip] = useState(true);
  const [coreNeeds, setCoreNeeds] = useState<CoreNeedId[]>([]);
  const [adoptionDrivers, setAdoptionDrivers] = useState<AdoptionDriverId[]>([]);
  const [userSource, setUserSource] = useState(defaultUserSource);
  const [userSourceDetail, setUserSourceDetail] = useState(defaultUserSourceDetail);
  const [message, setMessage] = useState("");
  const [showExtras, setShowExtras] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const isLoggedIn = Boolean(session?.user);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const wish = capabilityRequest.trim();
    if (wish.length < 20) {
      setError("Please describe your request in a bit more detail (at least a sentence).");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: isLoggedIn ? undefined : email.trim(),
        name: name.trim() || undefined,
        capabilityRequest: wish,
        notifyOnShip,
        coreNeeds,
        adoptionDrivers,
        userSource: userSource || undefined,
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
          <h2 className="text-xl font-semibold text-white mb-2">We received your request</h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            If it relates to public X/Twitter content or workflows, we&apos;ll do our best to
            build toward it — even when it is not on the site today.{" "}
            {notifyOnShip
              ? "We will email you when a matching capability is ready to use."
              : "You opted out of email updates; you can still check the product later."}
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Concrete write-ups may also qualify for +
            {FEEDBACK_REWARD_CALLS_DISPLAY.toLocaleString()} API calls after manual review
            (registered accounts, once per account).
          </p>
          <p className="mt-4 text-xs text-zinc-600 font-mono">Reference: {submittedId}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tell us what you need</CardTitle>
        <CardDescription>
          Describe the X/Twitter capability or workflow you want. It does not have to exist on
          XFlux yet — if it is about public Twitter/X content, we will try to make it real and
          email you when you can use it.
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
                <p className="mt-1 text-xs text-zinc-600">
                  We use this to notify you when the capability ships.
                </p>
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

          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 sm:p-5">
            <label className="mb-1.5 block text-sm font-semibold text-white">
              Your request <span className="text-sky-400">*</span>
            </label>
            <p className="mb-3 text-sm text-zinc-400">
              What should XFlux do for you? Examples: watch 50 KOLs and summarize daily; search
              replies for a cashtag; export hits to a sheet; alert only on first mention of a
              token. Scope: public X/Twitter data and workflows around it.
            </p>
            <Textarea
              value={capabilityRequest}
              onChange={(e) => setCapabilityRequest(e.target.value)}
              placeholder="I need to…"
              maxLength={5000}
              required
              className="min-h-[160px] border-zinc-700 bg-zinc-950/80 text-base"
            />
            <p className="mt-2 text-xs text-zinc-600">
              {capabilityRequest.trim().length}/5000 · aim for a clear outcome, not only a
              feature name
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-sky-500 focus:ring-sky-500"
              checked={notifyOnShip}
              onChange={(e) => setNotifyOnShip(e.target.checked)}
            />
            <span className="text-zinc-300">
              Email me when you ship this (or a close match) so I can start using it
            </span>
          </label>

          <UserSourceSelect
            value={userSource}
            onChange={setUserSource}
            detail={userSourceDetail}
            onDetailChange={setUserSourceDetail}
          />

          <div>
            <button
              type="button"
              onClick={() => setShowExtras((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2.5 text-left text-sm text-zinc-300 hover:border-zinc-700"
            >
              <span>Optional: quick checkboxes & extra notes</span>
              <ChevronDown
                className={cn("h-4 w-4 text-zinc-500 transition-transform", showExtras && "rotate-180")}
              />
            </button>
            {showExtras && (
              <div className="mt-4 space-y-8">
                <CheckboxGroup
                  title="What do you need most from XFlux today?"
                  description="Optional — helps us map your request to the roadmap."
                  options={CORE_NEED_OPTIONS}
                  selected={coreNeeds}
                  onChange={(ids) => setCoreNeeds(ids as CoreNeedId[])}
                />

                <CheckboxGroup
                  title="What would make you use XFlux more?"
                  description="Optional."
                  options={ADOPTION_DRIVER_OPTIONS}
                  selected={adoptionDrivers}
                  onChange={(ids) => setAdoptionDrivers(ids as AdoptionDriverId[])}
                />

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-white">
                    Anything else?
                  </label>
                  <p className="mb-2 text-sm text-zinc-500">
                    Constraints, budget, tools you already use, or links to examples.
                  </p>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Optional context…"
                    maxLength={5000}
                  />
                </div>
              </div>
            )}
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

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit request"
            )}
          </Button>
          <p className="text-center text-xs text-zinc-600">
            Useful written requests may earn +{FEEDBACK_REWARD_CALLS_DISPLAY.toLocaleString()}{" "}
            API calls after review (registered accounts, once per account).
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
