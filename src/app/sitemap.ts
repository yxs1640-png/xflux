import type { MetadataRoute } from "next";
import { getAllCommunitySignalSlugs } from "@/lib/custom-signals/community-topics";
import { getPredictorUsernamesForSitemap } from "@/lib/predictor-discovery/sitemap";
import { SIGNAL_TOPICS } from "@/lib/signals/topics";
import { SITE_URL } from "@/lib/seo";

const PUBLIC_ROUTES: Array<{
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/twitter-webhook", changeFrequency: "weekly", priority: 0.88 },
  { path: "/twitter-discord-alerts", changeFrequency: "weekly", priority: 0.86 },
  { path: "/mcp", changeFrequency: "weekly", priority: 0.87 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.86 },
  { path: "/compare", changeFrequency: "weekly", priority: 0.88 },
  { path: "/compare/x-api", changeFrequency: "monthly", priority: 0.87 },
  { path: "/compare/sorsa", changeFrequency: "monthly", priority: 0.86 },
  { path: "/compare/socialdata", changeFrequency: "monthly", priority: 0.86 },
  { path: "/signals", changeFrequency: "hourly", priority: 0.87 },
  ...SIGNAL_TOPICS.map((t) => ({
    path: `/signals/${t.slug}`,
    changeFrequency: "hourly" as const,
    priority: 0.86,
  })),
  { path: "/register", changeFrequency: "monthly", priority: 0.85 },
  { path: "/use-cases", changeFrequency: "monthly", priority: 0.84 },
  { path: "/use-cases/trading-alerts", changeFrequency: "monthly", priority: 0.85 },
  { path: "/use-cases/ai-research", changeFrequency: "monthly", priority: 0.85 },
  { path: "/use-cases/crypto-alerts", changeFrequency: "monthly", priority: 0.85 },
  { path: "/predictors", changeFrequency: "daily", priority: 0.86 },
  { path: "/predictors/macro", changeFrequency: "daily", priority: 0.84 },
  { path: "/predictors/trading", changeFrequency: "daily", priority: 0.84 },
  { path: "/predictors/crypto", changeFrequency: "daily", priority: 0.84 },
  { path: "/predictors/geopolitics", changeFrequency: "daily", priority: 0.84 },
  { path: "/docs", changeFrequency: "weekly", priority: 0.85 },
  { path: "/docs/quickstart", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/authentication", changeFrequency: "monthly", priority: 0.78 },
  { path: "/docs/api", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/errors", changeFrequency: "monthly", priority: 0.75 },
  { path: "/docs/guides/search", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/guides/python", changeFrequency: "monthly", priority: 0.82 },
  { path: "/docs/guides/nodejs", changeFrequency: "monthly", priority: 0.82 },
  { path: "/docs/monitors", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/webhooks", changeFrequency: "monthly", priority: 0.82 },
  { path: "/docs/integrations/make", changeFrequency: "monthly", priority: 0.84 },
  { path: "/docs/guides/trading-keywords", changeFrequency: "monthly", priority: 0.83 },
  { path: "/docs/integrations/mcp", changeFrequency: "monthly", priority: 0.82 },
  { path: "/docs/limits", changeFrequency: "monthly", priority: 0.7 },
  { path: "/docs/compare/pricing", changeFrequency: "monthly", priority: 0.84 },
  { path: "/docs/faq", changeFrequency: "monthly", priority: 0.8 },
  { path: "/feedback", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
  { path: "/acceptable-use", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  let communitySlugs: string[] = [];
  let predictorUsernames: string[] = [];
  try {
    [communitySlugs, predictorUsernames] = await Promise.all([
      getAllCommunitySignalSlugs(),
      getPredictorUsernamesForSitemap(100),
    ]);
  } catch {
    // DB may be unavailable at build time — static routes still ship.
  }

  const communityRoutes = communitySlugs.map((slug) => ({
    path: `/signals/${slug}`,
    changeFrequency: "hourly" as const,
    priority: 0.86,
  }));

  const predictorRoutes = predictorUsernames.map((username) => ({
    path: `/predictors/u/${username}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Blog posts — imported lazily to avoid circular deps in edge cases
  const { BLOG_POSTS } = await import("@/lib/blog/posts");
  const blogRoutes = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const seen = new Set<string>();
  const allRoutes = [
    ...PUBLIC_ROUTES,
    ...communityRoutes,
    ...predictorRoutes,
    ...blogRoutes,
  ].filter((r) => {
    if (seen.has(r.path)) return false;
    seen.add(r.path);
    return true;
  });

  return allRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
