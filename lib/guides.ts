export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  published: string;
  updated?: string;
  related?: string[];
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "how-to-get-an-openai-api-key",
    title: "How to get an OpenAI API key",
    description:
      "Step-by-step walkthrough to create, scope, and verify an OpenAI API key — including project keys and service accounts.",
    keywords: [
      "openai api key",
      "how to get openai api key",
      "openai api key generate",
      "openai project key",
    ],
    published: "2026-01-15",
    related: ["api-key-security-best-practices", "openai-vs-anthropic-pricing"],
  },
  {
    slug: "how-to-get-an-anthropic-api-key",
    title: "How to get an Anthropic API key",
    description:
      "Create a Claude API key from the Anthropic console, set workspace limits, and verify it in seconds.",
    keywords: [
      "anthropic api key",
      "claude api key",
      "how to get anthropic api key",
      "anthropic console",
    ],
    published: "2026-01-15",
    related: ["api-key-security-best-practices", "openai-vs-anthropic-pricing"],
  },
  {
    slug: "how-to-get-a-gemini-api-key",
    title: "How to get a Google Gemini API key",
    description:
      "Generate a Gemini API key from Google AI Studio, switch to a billed project, and avoid the free-tier surprises.",
    keywords: [
      "gemini api key",
      "google gemini api key",
      "ai studio api key",
      "google generative ai key",
    ],
    published: "2026-01-15",
    related: ["api-key-security-best-practices", "free-llm-api-keys-for-testing"],
  },
  {
    slug: "api-key-security-best-practices",
    title: "API key security best practices for LLMs",
    description:
      "How to store, scope, rotate, and revoke LLM API keys without leaking them through git, logs, or shared environments.",
    keywords: [
      "api key security",
      "api key best practices",
      "rotate api key",
      "leaked api key",
    ],
    published: "2026-01-16",
    related: ["rotating-api-keys-safely", "llm-rate-limits-explained"],
  },
  {
    slug: "openai-vs-anthropic-pricing",
    title: "OpenAI vs Anthropic pricing in 2026",
    description:
      "A side-by-side breakdown of OpenAI and Anthropic per-token pricing, batch discounts, and prompt-caching savings.",
    keywords: [
      "openai vs anthropic",
      "openai pricing",
      "anthropic pricing",
      "claude vs gpt pricing",
    ],
    published: "2026-01-17",
    related: ["llm-rate-limits-explained", "free-llm-api-keys-for-testing"],
  },
  {
    slug: "free-llm-api-keys-for-testing",
    title: "Free LLM API keys for testing in 2026",
    description:
      "Which providers offer free credits, how long they last, and how to stretch them for prototyping without a credit card.",
    keywords: [
      "free llm api key",
      "free openai key",
      "free claude credits",
      "free gemini api key",
      "openrouter free credits",
    ],
    published: "2026-01-18",
    related: ["api-key-security-best-practices", "openai-vs-anthropic-pricing"],
  },
  {
    slug: "llm-rate-limits-explained",
    title: "LLM rate limits explained",
    description:
      "How RPM, TPM, and tier-based limits actually work across OpenAI, Anthropic, Groq, and others — and how to read the headers.",
    keywords: [
      "llm rate limits",
      "openai rate limit",
      "anthropic rate limit",
      "tpm rpm",
    ],
    published: "2026-01-19",
    related: ["rotating-api-keys-safely", "openai-vs-anthropic-pricing"],
  },
  {
    slug: "rotating-api-keys-safely",
    title: "Rotating API keys safely",
    description:
      "A practical rotation playbook: dual-write, blue-green keys, secret managers, and how to verify the rotation worked.",
    keywords: [
      "rotate api key",
      "api key rotation",
      "blue green secrets",
      "secrets manager rotation",
    ],
    published: "2026-01-20",
    related: ["api-key-security-best-practices", "llm-rate-limits-explained"],
  },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
