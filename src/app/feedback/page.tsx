import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { prisma } from "@/lib/db";
import { isValidUserSource } from "@/lib/user-source-config";
import { pageMetadata } from "@/lib/seo";
import { FEEDBACK_REWARD_CALLS_DISPLAY } from "@/lib/feedback-config";

export const metadata = pageMetadata({
  title: "Feedback",
  description: `Share useful product feedback on XFlux. Approved evaluations earn +${FEEDBACK_REWARD_CALLS_DISPLAY.toLocaleString()} free API calls.`,
  path: "/feedback",
});

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
              Tell us your use case, what worked, what blocked you, and one improvement you&apos;d
              prioritize. Useful evaluations are reviewed manually — approved submissions earn{" "}
              <strong className="text-white">
                +{FEEDBACK_REWARD_CALLS_DISPLAY.toLocaleString()} free API calls
              </strong>{" "}
              (one reward per account; must be a registered user).
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
