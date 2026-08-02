/** Public homepage demo — shared between UI and API routes. */

export type DemoTab = "profile" | "search" | "timeline";

export const DEMO_TABS: { id: DemoTab; label: string; hint: string }[] = [
  {
    id: "profile",
    label: "Profile",
    hint: "Look up a public account — id, bio, followers, verification.",
  },
  {
    id: "search",
    label: "Search",
    hint: "Find recent posts by keyword, hashtag, or from:username.",
  },
  {
    id: "timeline",
    label: "Timeline",
    hint: "Fetch the latest tweets from any public account.",
  },
];

export const DEMO_USERNAMES = ["elonmusk", "sama", "x"] as const;

export const DEMO_SEARCH_PRESETS = [
  { label: "from:elonmusk", query: "from:elonmusk" },
  { label: "AI agents", query: "ai agents lang:en" },
  { label: "$BTC", query: "$BTC -filter:replies" },
] as const;

export const DEMO_TIMELINE_PRESETS = [
  { label: "@elonmusk", username: "elonmusk" },
  { label: "@sama", username: "sama" },
  { label: "@x", username: "x" },
] as const;

export const DEMO_PROFILE_PRESETS = DEMO_TIMELINE_PRESETS;

export const DEMO_PLACEHOLDER_RESPONSE = `{
  "ready": true,
  "next": "Pick a sample below, then run a live demo request."
}`;

export const DEMO_LIMIT = 5;
export const DEMO_CACHE_MS = 5 * 60 * 1000;

export function normalizeUsername(raw: string): string {
  return raw.trim().replace(/^@/, "").toLowerCase();
}

export function isAllowedDemoUsername(username: string): boolean {
  return (DEMO_USERNAMES as readonly string[]).includes(username);
}

export function resolveDemoSearchQuery(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  for (const preset of DEMO_SEARCH_PRESETS) {
    if (preset.query.toLowerCase() === lower) return preset.query;
  }
  return null;
}
