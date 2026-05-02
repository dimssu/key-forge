import type { ProviderAdapter, ProviderId } from "./_types";
import openai from "./openai";
import anthropic from "./anthropic";
import gemini from "./gemini";
import mistral from "./mistral";
import cohere from "./cohere";
import groq from "./groq";
import deepseek from "./deepseek";
import xai from "./xai";
import perplexity from "./perplexity";
import together from "./together";
import fireworks from "./fireworks";
import openrouter from "./openrouter";
import azure from "./azure-openai";
import bedrock from "./bedrock";
import huggingface from "./huggingface";
import replicate from "./replicate";
import ollama from "./ollama";

/**
 * Order matters for paste-detect: most-specific patterns must come BEFORE
 * more general ones. e.g. `sk-ant-…` before `sk-…`, `sk-or-…` before `sk-…`.
 */
export const providers: ProviderAdapter[] = [
  anthropic,
  openrouter,
  groq,
  perplexity,
  xai,
  fireworks,
  huggingface,
  replicate,
  openai,
  deepseek,
  gemini,
  cohere,
  mistral,
  together,
  azure,
  bedrock,
  ollama,
];

/** Lookup by id. */
export function getProvider(id: string): ProviderAdapter | undefined {
  return providers.find((p) => p.id === id);
}

/** Lookup by slug (URL fragment). */
export function getProviderBySlug(slug: string): ProviderAdapter | undefined {
  return providers.find((p) => p.slug === slug);
}

/** Detect a provider from a pasted key. Returns the first match in priority order. */
export function detectProvider(key: string): ProviderAdapter | undefined {
  const trimmed = key.trim();
  if (!trimmed) return undefined;
  return providers.find((p) => p.keyPattern.test(trimmed));
}

export type { ProviderId };
