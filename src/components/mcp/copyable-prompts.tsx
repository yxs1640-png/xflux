"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  prompts: string[];
  copyLabel: string;
  copiedLabel: string;
};

export function CopyablePrompts({ prompts, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState<number | null>(null);

  async function copy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      window.setTimeout(() => setCopied((cur) => (cur === index ? null : cur)), 1600);
    } catch {
      // ignore
    }
  }

  return (
    <ul className="space-y-3">
      {prompts.map((prompt, index) => (
        <li
          key={prompt}
          className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3"
        >
          <p className="flex-1 text-sm text-zinc-200 leading-relaxed font-mono">{prompt}</p>
          <button
            type="button"
            onClick={() => copy(prompt, index)}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-500 hover:text-white"
            aria-label={copyLabel}
          >
            {copied === index ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                {copiedLabel}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                {copyLabel}
              </>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
