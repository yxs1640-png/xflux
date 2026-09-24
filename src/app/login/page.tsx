"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("invalidCredentials"));
      return;
    }

    trackClientEvent(AnalyticsEvents.LOGIN_COMPLETED);

    window.location.href = "/dashboard";
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center pt-16 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>{t("welcomeBack")}</CardTitle>
            <CardDescription>{t("signInSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
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
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("signingIn") : t("signIn")}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-500">
              {t("noAccount")}{" "}
              <Link href="/register" className="text-sky-400 hover:text-sky-300">
                {t("register")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
