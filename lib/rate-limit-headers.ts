/**
 * Parse `x-ratelimit-*` style headers from a provider response and project
 * remaining quota. Supports OpenAI, Anthropic, Groq today; falls back to
 * generic remaining/limit/reset triplet if headers look standard.
 */
export interface ParsedRateLimit {
  provider: string;
  requests?: { limit?: number; remaining?: number; reset?: string };
  tokens?: { limit?: number; remaining?: number; reset?: string };
  raw: Record<string, string>;
}

export function parseRateLimitHeaders(headersInit: HeadersInit): ParsedRateLimit {
  const h: Record<string, string> = {};
  const it: Iterable<[string, string]> =
    headersInit instanceof Headers
      ? (headersInit as unknown as Iterable<[string, string]>)
      : Array.isArray(headersInit)
        ? headersInit
        : Object.entries(headersInit);
  for (const [k, v] of it) h[k.toLowerCase()] = v;

  const num = (v?: string) => (v == null ? undefined : Number(v));

  const requests = {
    limit: num(h["x-ratelimit-limit-requests"] ?? h["x-ratelimit-limit"]),
    remaining: num(h["x-ratelimit-remaining-requests"] ?? h["x-ratelimit-remaining"]),
    reset: h["x-ratelimit-reset-requests"] ?? h["x-ratelimit-reset"],
  };
  const tokens = {
    limit: num(h["x-ratelimit-limit-tokens"] ?? h["anthropic-ratelimit-tokens-limit"]),
    remaining: num(h["x-ratelimit-remaining-tokens"] ?? h["anthropic-ratelimit-tokens-remaining"]),
    reset: h["x-ratelimit-reset-tokens"] ?? h["anthropic-ratelimit-tokens-reset"],
  };

  let provider = "unknown";
  if (h["anthropic-ratelimit-tokens-limit"]) provider = "Anthropic";
  else if (h["x-ratelimit-limit-tokens"]) provider = "OpenAI / OpenAI-compatible";

  return { provider, requests, tokens, raw: h };
}
