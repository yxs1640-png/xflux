export const USER_SOURCE_OPTIONS = [
  { id: "google_search", label: "Google search" },
  { id: "twitter_x", label: "Twitter / X" },
  { id: "friend_referral", label: "Friend or colleague" },
  { id: "reddit_hn", label: "Reddit, Hacker News, or forum" },
  { id: "youtube_podcast", label: "YouTube or podcast" },
  { id: "blog_newsletter", label: "Blog or newsletter" },
  { id: "product_hunt", label: "Product Hunt or launch site" },
  { id: "github", label: "GitHub or open-source community" },
  { id: "ai_assistant", label: "ChatGPT, Claude, or other AI tool" },
  { id: "other", label: "Other" },
] as const;

export type UserSourceId = (typeof USER_SOURCE_OPTIONS)[number]["id"];

export const USER_SOURCE_IDS = USER_SOURCE_OPTIONS.map((o) => o.id);

export function getUserSourceLabel(id: string | null | undefined): string {
  if (!id) return "Unknown";
  return USER_SOURCE_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function isValidUserSource(id: string): id is UserSourceId {
  return USER_SOURCE_IDS.includes(id as UserSourceId);
}
