import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";

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
  // Skip static assets and API; locale cookie still set on first page hit
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

// Keep locales referenced so tree-shaking doesn't drop the config import side
void locales;
