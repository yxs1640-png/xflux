import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./config";

/**
 * Intentionally static: do NOT read `cookies()` / `headers()` here.
 * Those APIs force every route under the root layout into dynamic SSR, which
 * burns Vercel Fluid Active CPU on crawler traffic to marketing/blog pages.
 *
 * Per-user locale is applied client-side via `LocaleProvider` + NEXT_LOCALE cookie.
 * Crawlers still see English (defaultLocale), matching canonical/metadata.
 */
export default getRequestConfig(async () => {
  const locale = defaultLocale;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
