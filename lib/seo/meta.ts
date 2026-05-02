import type { Metadata } from "next";
import { siteUrl } from "../utils";

const baseTitle = "KeyForge — Free LLM API Key Tester (OpenAI, Anthropic, Gemini)";
const baseDescription =
  "Free, open-source developer tool: paste an LLM API key, instantly verify it works, list accessible models, benchmark latency. Supports OpenAI, Anthropic, Gemini, Groq + 13 more. No signup. (Not the card game.)";
const baseKeywords = [
  "LLM API key tester",
  "test OpenAI API key",
  "validate Anthropic API key",
  "check Gemini API key",
  "Claude API key test",
  "Groq API key validator",
  "Mistral API key test",
  "API key validator",
  "developer tool",
];

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
  const fullTitle = title ? `${title} | KeyForge LLM Tester` : baseTitle;
  const desc = description ?? baseDescription;
  const url = siteUrl(path);
  const og =
    ogImage ?? siteUrl(`/api/og?title=${encodeURIComponent(title ?? "LLM API Key Tester")}`);
  const allKeywords = Array.from(new Set([...(keywords ?? []), ...baseKeywords]));
  return {
    title: fullTitle,
    description: desc,
    keywords: allKeywords,
    metadataBase: new URL(siteUrl()),
    alternates: { canonical: url },
    applicationName: "KeyForge",
    authors: [{ name: "KeyForge contributors", url: "https://github.com/dimssu/key-forge" }],
    category: "Developer Tools",
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: "KeyForge — LLM API Key Tester",
      type,
      images: [{ url: og, width: 1200, height: 630, alt: "KeyForge — LLM API Key Tester" }],
      ...(published ? { publishedTime: published } : {}),
      ...(updated ? { modifiedTime: updated } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [og],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    other: {
      "application-name": "KeyForge",
      "apple-mobile-web-app-title": "KeyForge",
    },
  };
}
