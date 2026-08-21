import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { ApiPlayground } from "@/components/landing/api-playground";

const CAPABILITIES = [
  "Profiles, search, timelines & tweet lookup",
  "Account monitors — no cron jobs",
  "Signed webhooks on Starter ($19/mo+)",
];

const USE_CASES = [
  "Track KOL / competitor accounts",
  "Feed RAG or sentiment pipelines",
  "Build Slack or trading alert bots",
];

export function RegisterProductPanel() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-400 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          X/Twitter read API
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl leading-tight">
          Public X data via REST —{" "}
          <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
            plus monitors that alert you
          </span>
        </h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          Fetch profiles, search posts, and read timelines with normalized JSON. Add background
          monitors when you need to know when @accounts post — optional signed webhooks on paid
          plans. No official X API approval required.
        </p>
      </div>

      <ul className="space-y-2">
        {CAPABILITIES.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-zinc-300">
            <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
            {point}
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 mb-3">
          Teams use XFlux for
        </p>
        <ul className="space-y-2">
          {USE_CASES.map((item) => (
            <li key={item} className="text-sm text-zinc-400 before:content-['·'] before:mr-2 before:text-zinc-600">
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/docs/quickstart"
          className="mt-4 inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300"
        >
          60-second quickstart <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-300 mb-3">
          Try the API now — no signup required
        </p>
        <ApiPlayground />
      </div>
    </div>
  );
}
