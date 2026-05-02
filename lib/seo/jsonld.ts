import { siteUrl } from "../utils";

export interface FaqItem {
  q: string;
  a: string;
}

export function softwareApp() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "KeyForge",
    description:
      "Test any LLM API key in seconds. Validate, list models, benchmark latency, and copy ready-to-use snippets.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any (web)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: siteUrl(),
    publisher: { "@type": "Organization", name: "KeyForge" },
  };
}

export function faqPage(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbs(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: siteUrl(it.href),
    })),
  };
}

export function howTo(args: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    step: args.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function article(args: {
  title: string;
  description: string;
  slug: string;
  published: string;
  updated?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    datePublished: args.published,
    dateModified: args.updated ?? args.published,
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/guides/${args.slug}`) },
    author: { "@type": "Organization", name: "KeyForge" },
    publisher: { "@type": "Organization", name: "KeyForge" },
  };
}
