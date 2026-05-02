import { siteUrl } from "../utils";

export interface FaqItem {
  q: string;
  a: string;
}

const PROVIDERS_LIST = [
  "OpenAI",
  "Anthropic",
  "Google Gemini",
  "Mistral",
  "Cohere",
  "Groq",
  "DeepSeek",
  "xAI Grok",
  "Perplexity",
  "Together AI",
  "Fireworks AI",
  "OpenRouter",
  "Azure OpenAI",
  "AWS Bedrock",
  "Hugging Face",
  "Replicate",
  "Ollama",
];

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "APIKit",
    alternateName: "APIKit LLM API Key Tester",
    description:
      "Free, open-source developer toolkit for testing Large Language Model (LLM) API keys.",
    url: siteUrl(),
    logo: siteUrl("/favicon.svg"),
    sameAs: ["https://github.com/dimssu/key-forge"],
  };
}

export function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "APIKit",
    alternateName: "APIKit — LLM API Key Tester",
    url: siteUrl(),
    description:
      "Free LLM API key tester for OpenAI, Anthropic, Gemini, Groq, and 13 more providers.",
    inLanguage: "en",
    audience: {
      "@type": "Audience",
      audienceType: "Software developers integrating LLM APIs",
    },
    about: [
      { "@type": "Thing", name: "Large Language Model APIs" },
      { "@type": "Thing", name: "API key validation" },
      { "@type": "Thing", name: "Developer tools" },
    ],
  };
}

export function softwareApp() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "APIKit",
    alternateName: "APIKit LLM API Key Tester",
    description:
      "Free, universal LLM API key tester. Validate keys for OpenAI, Anthropic, Gemini, Groq, Mistral, and 12 more providers in seconds. Lists accessible models, benchmarks latency, and generates code snippets. Open source, no signup.",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "DeveloperTool",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript and HTML5",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    url: siteUrl(),
    image: siteUrl("/api/og?title=LLM+API+Key+Tester"),
    publisher: organization(),
    audience: {
      "@type": "Audience",
      audienceType: "Software developers integrating LLM APIs",
    },
    keywords: [
      "LLM API key tester",
      "test OpenAI API key",
      "validate Anthropic API key",
      "check Gemini API key",
      "Claude API key test",
      "Groq API key validator",
      "developer toolkit",
      "API kit",
      "API key validation",
      ...PROVIDERS_LIST.map((p) => `${p} API`),
    ].join(", "),
    featureList: [
      "Validate LLM API keys against the upstream provider",
      "List models accessible to the supplied key",
      "Benchmark request latency (p50, p95, p99)",
      "Generate cURL, Python, Node fetch, and axios code snippets",
      "Bulk test many keys with CSV export",
      "Stream a real prompt through the Playground",
      "Validate OpenAI and Anthropic webhook signatures",
      "Parse rate-limit response headers",
      "Live provider uptime indicator",
      "Stateless proxy — keys never persist",
    ],
    about: [
      { "@type": "Thing", name: "OpenAI API" },
      { "@type": "Thing", name: "Anthropic Claude API" },
      { "@type": "Thing", name: "Google Gemini API" },
      { "@type": "Thing", name: "LLM developer tools" },
    ],
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
    author: organization(),
    publisher: organization(),
  };
}
