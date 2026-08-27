import type { TwitterTweet } from "@/lib/twitter-types";

export type SignalItem = {
  id: string;
  username: string;
  displayName: string;
  text: string;
  createdAt: string;
  tweetUrl: string;
  source: "timeline" | "search";
  metrics?: TwitterTweet["public_metrics"];
};

export type SignalBrief = {
  headline: string;
  highlights: string[];
  synthesis: string;
  guidance: string[];
  themes: Array<{ label: string; count: number }>;
};

export type SignalFeed = {
  items: SignalItem[];
  brief: SignalBrief;
  fetchedAt: string;
  accountCount: number;
  searchQuery: string;
};
