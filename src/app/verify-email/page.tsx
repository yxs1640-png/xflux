import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { consumeEmailVerificationToken } from "@/lib/email-verification";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Verify email",
  description: "Confirm your XFlux account email to unlock the full Free API quota.",
  path: "/verify-email",
  noIndex: true,
});

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <VerifyShell
        title="Missing verification link"
        body="Open the link from your XFlux email, or resend it from the dashboard."
        ctaHref="/dashboard"
        ctaLabel="Go to dashboard"
      />
    );
  }

  const result = await consumeEmailVerificationToken(token);

  if (result.ok || result.error === "already") {
    return (
      <VerifyShell
        title="Email verified"
        body="Your Free plan now includes up to 1,000 API calls per month. You can keep using the same API key."
        ctaHref="/dashboard"
        ctaLabel="Open dashboard"
      />
    );
  }

  if (result.error === "expired") {
    return (
      <VerifyShell
        title="Link expired"
        body="Request a new verification email from the dashboard banner."
        ctaHref="/dashboard"
        ctaLabel="Resend from dashboard"
      />
    );
  }

  return (
    <VerifyShell
      title="Invalid link"
      body="This verification link is invalid or was already used. Sign in and resend from the dashboard."
      ctaHref="/login"
      ctaLabel="Sign in"
    />
  );
}

function VerifyShell({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="mt-4 text-zinc-400 leading-relaxed">{body}</p>
          <div className="mt-8">
            <Link href={ctaHref}>
              <Button size="lg">{ctaLabel}</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
