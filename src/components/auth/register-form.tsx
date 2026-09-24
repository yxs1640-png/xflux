"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSourceSelect } from "@/components/user-source-select";
import { isValidUserSource } from "@/lib/user-source-config";
import { identifyClient } from "@/lib/analytics/client";
import { fireGoogleAdsSignupConversion } from "@/components/analytics/google-ads-conversion";
import { RegisterProductPanel } from "@/components/auth/register-product-panel";
import { getGoogleAdsId } from "@/lib/google-ads-config";
import {
  captureGoogleAdsClickIds,
  formatGoogleAdsClickIds,
  getStoredGoogleAdsClickIds,
} from "@/lib/google-ads-attribution";

const WELCOME_API_KEY_STORAGE = "xflux_welcome_api_key";

export function RegisterForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userSource, setUserSource] = useState("");
  const [userSourceDetail, setUserSourceDetail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const gtmDebug = searchParams.get("gtm_debug");
    const adsId = getGoogleAdsId();
    if (gtmDebug && adsId && typeof window.gtag === "function") {
      window.gtag("config", adsId, { debug_mode: true });
    }

    captureGoogleAdsClickIds(searchParams);

    const src = searchParams.get("src");
    if (src && isValidUserSource(src)) {
      setUserSource(src);
      return;
    }
    const utmSource = searchParams.get("utm_source")?.toLowerCase();
    if (utmSource === "google") {
      setUserSource("google_search");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const googleAdsClickId =
      userSource === "google_search"
        ? formatGoogleAdsClickIds(getStoredGoogleAdsClickIds()) ?? undefined
        : undefined;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || undefined,
        email,
        password,
        ...(userSource
          ? {
              userSource,
              userSourceDetail: userSource === "other" ? userSourceDetail : undefined,
              googleAdsClickId,
            }
          : {}),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || t("registrationFailed"));
      return;
    }

    identifyClient(data.userId, {
      email: data.email,
      signup_source: userSource || undefined,
      signup_source_detail: userSource === "other" ? userSourceDetail : undefined,
      plan_tier: "FREE",
    });

    sessionStorage.setItem(WELCOME_API_KEY_STORAGE, data.apiKey);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("signInAfterCreateFailed"));
      return;
    }

    fireGoogleAdsSignupConversion({ email: data.email });
    window.location.href = "/dashboard?welcome=1";
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <RegisterProductPanel />

          <div className="lg:sticky lg:top-24">
            <Card className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
          <CardHeader className="text-center lg:text-left">
            <CardTitle>{t("registerTitle")}</CardTitle>
            <CardDescription>{t("registerSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-2">
              {[t("trustFreeCalls"), t("trustNoCard"), t("trustFastKey")].map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-zinc-400">
                  <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">{t("name")}</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">{t("email")}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">{t("password")}</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordHint")}
                  minLength={8}
                  required
                />
              </div>
              <UserSourceSelect
                value={userSource}
                onChange={setUserSource}
                detail={userSourceDetail}
                onDetailChange={setUserSourceDetail}
                required={false}
                label={t("sourceLabel")}
                description={t("sourceDescription")}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("creating") : t("createAccount")}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-500">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-sky-400 hover:text-sky-300">
                {t("signIn")}
              </Link>
            </p>
          </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
