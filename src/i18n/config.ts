export const locales = ["en", "zh", "ja", "ko", "es", "pt", "de", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Native labels shown in the language switcher */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  fr: "Français",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
