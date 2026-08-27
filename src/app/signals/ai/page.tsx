import { SignalFeedPage } from "@/components/signals/signal-feed-page";
import {
  AI_WATCH_ACCOUNTS,
  fetchAiSignalFeed,
} from "@/lib/signals/fetch-ai-feed";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Live AI Signals from X/Twitter — Account Updates & Analysis",
  description:
    "Real-time AI and LLM signals from @sama, @karpathy, labs, and live search — who posted what, key themes, and what to monitor next. Powered by XFlux.",
  path: "/signals/ai",
});

/** Re-fetch timelines + search every 2 minutes for near-real-time digest. */
export const revalidate = 120;

export default async function AiSignalsPage() {
  const feed = await fetchAiSignalFeed();

  return (
    <SignalFeedPage
      feed={feed}
      registerSrc="signals_ai"
      watchedAccounts={AI_WATCH_ACCOUNTS}
    />
  );
}
