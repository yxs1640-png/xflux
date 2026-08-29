"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DOCS_RELATED_SIGNALS, resolveSignalTopics } from "@/lib/signals/internal-links";

export function RelatedSignals() {
  const pathname = usePathname();
  const slugs = DOCS_RELATED_SIGNALS[pathname];
  if (!slugs?.length) return null;

  const topics = resolveSignalTopics(slugs);
  if (topics.length === 0) return null;

  return (
    <aside
      className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
      aria-label="Related signal digests"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
        Related signal digests
      </h2>
      <ul className="space-y-3">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={`/signals/${topic.slug}`}
              className="group flex items-start justify-between gap-3 text-sm"
            >
              <span>
                <span className="text-zinc-200 group-hover:text-sky-400 transition-colors">
                  {topic.title} signals
                </span>
                <span className="block text-xs text-zinc-500 mt-0.5 line-clamp-1">{topic.intro}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-sky-400 transition-colors mt-0.5" />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/signals"
        className="mt-4 inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300"
      >
        All signal topics
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </aside>
  );
}
