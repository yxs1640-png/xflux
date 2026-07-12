import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PUBLIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/register", changeFrequency: "monthly", priority: 0.85 },
  { path: "/docs", changeFrequency: "weekly", priority: 0.85 },
  { path: "/docs/quickstart", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/api", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/monitors", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/webhooks", changeFrequency: "monthly", priority: 0.75 },
  { path: "/docs/limits", changeFrequency: "monthly", priority: 0.7 },
  { path: "/feedback", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
  { path: "/acceptable-use", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
