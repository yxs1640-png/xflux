import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";

/** Common crawler UAs — force English so UI language matches EN metadata/canonicals. */
const BOT_UA =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot/i;

function isCrawler(ua: string | null): boolean {
  return Boolean(ua && BOT_UA.test(ua));
}

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

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const ua = request.headers.get("user-agent");

  if (isCrawler(ua)) {
    // Do not persist a bot locale cookie forever for humans who share caches;
    // set EN only for this response path.
    response.cookies.set(LOCALE_COOKIE, defaultLocale, {
      path: "/",
      maxAge: 60 * 60, // short-lived
      sameSite: "lax",
    });
    return response;
  }

  const existing = request.cookies.get(LOCALE_COOKIE)?.value;

  if (!isLocale(existing)) {
    const locale = negotiateLocale(request.headers.get("accept-language"));
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

void locales;
