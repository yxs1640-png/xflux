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

async function loadMessages(locale: Locale, baseEn: Messages): Promise<Messages> {
  if (locale === "en") return baseEn;
  const mod = await import(`../../../messages/${locale}.json`);
  return deepMergeMessages(baseEn, mod.default as Messages);
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

  const applyLocale = useCallback(
    async (next: Locale) => {
      if (next === locale) return;
      setPending(true);
      try {
        const nextMessages = await loadMessages(next, enBase);
        setLocaleState(next);
        setMessages(nextMessages);
        document.documentElement.lang = next;
      } finally {
        setPending(false);
      }
    },
    [enBase, locale]
  );

  // Hydrate from cookie without a server round-trip (keeps HTML static/CDN-friendly).
  useEffect(() => {
    const fromCookie = readLocaleCookie();
    if (fromCookie && fromCookie !== locale) {
      void applyLocale(fromCookie);
    } else {
      document.documentElement.lang = locale;
    }
    // Only on mount — cookie-driven upgrade.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback(
    async (next: Locale) => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      await applyLocale(next);
    },
    [applyLocale]
  );

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
