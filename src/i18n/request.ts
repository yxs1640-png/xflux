import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { deepMergeMessages } from "./merge";

function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage.split(",").map((part) => {
    const [tag] = part.trim().split(";");
    return tag.trim().toLowerCase();
  });

  for (const tag of preferred) {
    if (isLocale(tag)) return tag;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
    if (base === "zh") return "zh";
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  let locale: Locale = defaultLocale;
  if (isLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const headerStore = await headers();
    locale = negotiateLocale(headerStore.get("accept-language"));
  }

  const enMessages = (await import("../../messages/en.json")).default;
  const localeMessages =
    locale === "en"
      ? enMessages
      : (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    // Missing keys in a locale fall back to English instead of showing "namespace.key"
    messages: deepMergeMessages(
      enMessages as Record<string, unknown>,
      localeMessages as Record<string, unknown>
    ),
  };
});
