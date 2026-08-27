import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SignalFeedSkeleton } from "@/components/signals/signal-feed-skeleton";

export default function SignalTopicLoading() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="animate-pulse mb-10 space-y-4">
            <div className="h-4 w-40 rounded bg-zinc-800" />
            <div className="h-8 w-3/4 max-w-md rounded bg-zinc-800" />
            <div className="h-5 w-full max-w-xl rounded bg-zinc-800" />
          </div>
          <SignalFeedSkeleton />
        </div>
      </main>
      <Footer />
    </>
  );
}
