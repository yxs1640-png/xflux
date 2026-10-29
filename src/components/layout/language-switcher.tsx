"use client";

import { localeLabels, locales, type Locale } from "@/i18n/config";
import { useLocaleController } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale, pending } = useLocaleController();

  return (
    <label className={cn("inline-flex items-center gap-2", className)}>
      {!compact && <span className="sr-only">Language</span>}
      <select
        aria-label="Language"
        value={locale}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          void setLocale(next);
        }}
        className={cn(
          "rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm",
          "px-2 py-1.5 hover:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-500",
          "disabled:opacity-60 cursor-pointer max-w-[9.5rem]"
        )}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
