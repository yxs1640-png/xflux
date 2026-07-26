import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { GoogleAdsConversion } from "@/components/analytics/google-ads-conversion";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center pt-16 px-4 text-zinc-500">
          Loading...
        </main>
      }
    >
      <GoogleAdsConversion />
      <RegisterForm />
    </Suspense>
  );
}
