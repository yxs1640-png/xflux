import type { MetadataRoute } from "next";
import { getAllCommunitySignalSlugs } from "@/lib/custom-signals/community-topics";
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
  { path: "/signals", changeFrequency: "hourly", priority: 0.87 },
  ...SIGNAL_TOPICS.map((t) => ({
    path: `/signals/${t.slug}`,
    changeFrequency: "hourly" as const,
    priority: 0.86,
  })),
  { path: "/register", changeFrequency: "monthly", priority: 0.85 },
  { path: "/use-cases", changeFrequency: "monthly", priority: 0.84 },
  { path: "/docs", changeFrequency: "weekly", priority: 0.85 },
  { path: "/docs/quickstart", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/api", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/monitors", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/webhooks", changeFrequency: "monthly", priority: 0.82 },
  { path: "/docs/limits", changeFrequency: "monthly", priority: 0.7 },
  { path: "/feedback", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
  { path: "/acceptable-use", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  let communitySlugs: string[] = [];
  try {
    communitySlugs = await getAllCommunitySignalSlugs();
  } catch {
    // DB may be unavailable at build time — static signal routes still ship.
  }
  const communityRoutes = communitySlugs.map((slug) => ({
    path: `/signals/${slug}`,
    changeFrequency: "hourly" as const,
    priority: 0.86,
  }));
  const allRoutes = [
    ...PUBLIC_ROUTES.slice(0, 4),
    ...communityRoutes.filter(
      (r) => !PUBLIC_ROUTES.some((p) => p.path === r.path)
    ),
    ...PUBLIC_ROUTES.slice(4),
  ];

  return allRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
