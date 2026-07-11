import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { prisma } from "@/lib/db";
import { isValidUserSource } from "@/lib/user-source-config";

export const metadata: Metadata = {
  title: "Feedback — XFlux",
  description: "Tell us what you need from XFlux and what would make you use it more.",
};

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions);

  let defaultUserSource = "";
  let defaultUserSourceDetail = "";

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { signupSource: true, signupSourceDetail: true },
    });
    if (user?.signupSource && isValidUserSource(user.signupSource)) {
      defaultUserSource = user.signupSource;
      defaultUserSourceDetail = user.signupSourceDetail ?? "";
    }
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Help shape XFlux</h1>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
              We&apos;re building in public. Tell us what you need and what would earn your business
              — every submission is read by the team.
            </p>
          </div>
          <FeedbackForm
            defaultEmail={session?.user?.email ?? ""}
            defaultName={session?.user?.name ?? ""}
            defaultUserSource={defaultUserSource}
            defaultUserSourceDetail={defaultUserSourceDetail}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
