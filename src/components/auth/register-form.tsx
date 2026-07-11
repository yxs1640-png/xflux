"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Check } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSourceSelect } from "@/components/user-source-select";
import { isValidUserSource } from "@/lib/user-source-config";
import { identifyClient } from "@/lib/analytics/client";

const WELCOME_API_KEY_STORAGE = "xflux_welcome_api_key";

const TRUST_POINTS = [
  "1,000 free API calls every month",
  "No credit card required",
  "API key ready in under 60 seconds",
];

export function RegisterForm() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userSource, setUserSource] = useState("");
  const [userSourceDetail, setUserSourceDetail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const src = searchParams.get("src");
    if (src && isValidUserSource(src)) {
      setUserSource(src);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

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
            }
          : {}),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Registration failed");
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
      setError("Account created but sign-in failed. Please sign in manually.");
      return;
    }

    window.location.href = "/dashboard?welcome=1";
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center pt-16 px-4 pb-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Start with 1,000 free API calls per month — upgrade anytime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-2">
              {TRUST_POINTS.map((point) => (
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
                <label className="mb-1.5 block text-sm text-zinc-400">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
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
                label="How did you hear about XFlux?"
                description="Optional — helps us improve."
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create free account"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-sky-400 hover:text-sky-300">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
