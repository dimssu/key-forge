import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

/**
 * APIKit welcomes AI / LLM crawler ingestion. The bots below are listed
 * explicitly to make consent unambiguous — many crawlers default to "deny" or
 * to "honor only an explicit allow rule." See also: /llms.txt for a
 * machine-readable summary of what this site is.
 *
 * Bots intentionally NOT special-cased here are still allowed by the catch-all
 * "*" rule.
 */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "cohere-ai",
  "YouBot",
  "Diffbot",
  "Twitterbot",
  "LinkedInBot",
];

export default function robots(): MetadataRoute.Robots {
  const perBot = AI_BOTS.map((bot) => ({
    userAgent: bot,
    allow: "/",
    disallow: ["/api/proxy/", "/share/"],
  }));
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/share/"],
      },
      ...perBot,
    ],
    sitemap: siteUrl("/sitemap.xml"),
    host: siteUrl().replace(/^https?:\/\//, "").replace(/\/$/, ""),
  };
}
