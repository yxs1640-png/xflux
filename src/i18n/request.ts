import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { deepMergeMessages } from "./merge";

const BOT_UA =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot/i;

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
  const headerStore = await headers();
  const ua = headerStore.get("user-agent");

  // Crawlers always get English so UI matches EN metadata/canonicals.
  let locale: Locale = defaultLocale;
  if (!ua || !BOT_UA.test(ua)) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
    if (isLocale(cookieLocale)) {
      locale = cookieLocale;
    } else {
      locale = negotiateLocale(headerStore.get("accept-language"));
    }
  }

  const enMessages = (await import("../../messages/en.json")).default;
  const localeMessages =
    locale === "en"
      ? enMessages
      : (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages: deepMergeMessages(
      enMessages as Record<string, unknown>,
      localeMessages as Record<string, unknown>
    ),
  };
});
