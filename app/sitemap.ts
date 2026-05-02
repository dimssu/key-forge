import type { MetadataRoute } from "next";
import { providers } from "@/lib/providers/_registry";
import { GUIDES } from "@/lib/guides";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const staticUrls: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("/bulk"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl("/compare"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl("/playground"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl("/tools/rate-limit"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/tools/webhook-validator"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/tools/status"), lastModified: now, changeFrequency: "hourly", priority: 0.6 },
    { url: siteUrl("/privacy"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: siteUrl("/security"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: siteUrl("/guides"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
  const provider: MetadataRoute.Sitemap = providers.map((p) => ({
    url: siteUrl(`/test/${p.slug}-api-key`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  const guide: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: siteUrl(`/guides/${g.slug}`),
    lastModified: g.updated ?? g.published,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticUrls, ...provider, ...guide];
}
