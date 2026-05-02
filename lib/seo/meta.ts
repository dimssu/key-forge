import type { Metadata } from "next";
import { siteUrl } from "../utils";

const baseTitle = "KeyForge — Test any LLM API key in seconds";
const baseDescription =
  "Free, universal LLM API key tester. Verify keys for OpenAI, Anthropic, Gemini, and 14 more providers. List models, benchmark latency, copy snippets.";

export interface BuildMetadataArgs {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
  type?: "website" | "article";
  published?: string;
  updated?: string;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
  keywords,
  type = "website",
  published,
  updated,
}: BuildMetadataArgs = {}): Metadata {
  const fullTitle = title ? `${title} | KeyForge` : baseTitle;
  const desc = description ?? baseDescription;
  const url = siteUrl(path);
  const og = ogImage ?? siteUrl(`/api/og?title=${encodeURIComponent(title ?? "KeyForge")}`);
  return {
    title: fullTitle,
    description: desc,
    keywords,
    metadataBase: new URL(siteUrl()),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: "KeyForge",
      type,
      images: [{ url: og, width: 1200, height: 630 }],
      ...(published ? { publishedTime: published } : {}),
      ...(updated ? { modifiedTime: updated } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [og],
    },
    robots: { index: true, follow: true },
  };
}
