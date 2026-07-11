import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center pt-16 px-4 text-zinc-500">
          Loading...
        </main>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
