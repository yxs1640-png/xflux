"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Zap } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">XFlux</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          <Link href="/signals" className="text-sm text-zinc-400 hover:text-white transition-colors">
            {t("signals")}
          </Link>
          <Link href="/predictors" className="text-sm text-zinc-400 hover:text-white transition-colors">
            {t("predictors")}
          </Link>
          <Link href="/twitter-webhook" className="text-sm text-zinc-400 hover:text-white transition-colors">
            {t("webhooks")}
          </Link>
          <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
            {t("docs")}
          </Link>
          <Link href="/blog" className="hidden lg:inline text-sm text-zinc-400 hover:text-white transition-colors">
            {t("blog")}
          </Link>
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
            {t("pricing")}
          </Link>
          {session && (
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
              {t("dashboard")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher compact />
          {session ? (
            <>
              <span className="hidden text-sm text-zinc-400 lg:inline">
                {session.user.email}
              </span>
              <Link href="/dashboard/billing">
                <Button variant="outline" size="sm">
                  {tc("billing")}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">{tc("dashboard")}</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {tc("signIn")}
                </Button>
              </Link>
              <Link href="/register?src=header">
                <Button size="sm">{tc("getApiKey")}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
