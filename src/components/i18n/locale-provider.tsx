"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { deepMergeMessages } from "@/i18n/merge";

type Messages = Record<string, unknown>;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => Promise<void>;
  pending: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`));
  const value = match?.split("=")[1];
  return isLocale(value) ? value : null;
}

function negotiateBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return defaultLocale;
  const candidates = [navigator.language, ...(navigator.languages ?? [])];
  for (const tag of candidates) {
    const lower = tag.toLowerCase();
    if (isLocale(lower)) return lower;
    const base = lower.split("-")[0];
    if (isLocale(base)) return base;
    if (base === "zh") return "zh";
  }
  return defaultLocale;
}

async function loadMessages(locale: Locale, baseEn: Messages): Promise<Messages> {
  if (locale === "en") return baseEn;
  const mod = await import(`../../../messages/${locale}.json`);
  return deepMergeMessages(baseEn, mod.default as Messages);
}

async function persistLocaleCookie(locale: Locale) {
  await fetch("/api/locale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale }),
  });
}

export function LocaleProvider({
  initialLocale,
  initialMessages,
  children,
}: {
  initialLocale: Locale;
  initialMessages: Messages;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Messages>(initialMessages);
  const [pending, setPending] = useState(false);
  const enBase = initialMessages;

  const applyLocale = useCallback(async (next: Locale) => {
    setPending(true);
    try {
      const nextMessages = await loadMessages(next, enBase);
      setLocaleState(next);
      setMessages(nextMessages);
      document.documentElement.lang = next;
    } finally {
      setPending(false);
    }
  }, [enBase]);

  const setLocale = useCallback(
    async (next: Locale) => {
      await persistLocaleCookie(next);
      await applyLocale(next);
    },
    [applyLocale]
  );

  // Cookie / browser language — no Edge middleware (that was ~half of Fluid CPU by region).
  useEffect(() => {
    const fromCookie = readLocaleCookie();
    const preferred = fromCookie ?? negotiateBrowserLocale();
    if (preferred === initialLocale) {
      document.documentElement.lang = preferred;
      return;
    }
    if (!fromCookie && preferred !== defaultLocale) {
      void persistLocaleCookie(preferred).then(() => applyLocale(preferred));
    } else {
      void applyLocale(preferred);
    }
  }, [applyLocale, initialLocale]);

  const ctx = useMemo(
    () => ({ locale, setLocale, pending }),
    [locale, setLocale, pending]
  );

  return (
    <LocaleContext.Provider value={ctx}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleController(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: defaultLocale,
      setLocale: async () => undefined,
      pending: false,
    };
  }
  return ctx;
}
