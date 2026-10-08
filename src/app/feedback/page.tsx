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
  title: "Tell us what you need",
  description:
    "Request an X/Twitter capability from XFlux — even if it is not on the site yet. We email you when it is ready to use.",
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
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              What should XFlux do for you?
            </h1>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Describe the X/Twitter capability or workflow you need. It does not have to exist
              on the product today — if it is about public Twitter/X content, we will try to
              build it and{" "}
              <strong className="text-white">email you when you can use it</strong>. Useful
              write-ups may also earn{" "}
              <strong className="text-white">
                +{FEEDBACK_REWARD_CALLS_DISPLAY.toLocaleString()} free API calls
              </strong>{" "}
              after review (registered accounts, once per account).
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
