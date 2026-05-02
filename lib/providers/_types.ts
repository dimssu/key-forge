export type ProviderId =
  | "openai"
  | "anthropic"
  | "gemini"
  | "mistral"
  | "cohere"
  | "groq"
  | "deepseek"
  | "xai"
  | "perplexity"
  | "together"
  | "fireworks"
  | "openrouter"
  | "azure-openai"
  | "bedrock"
  | "huggingface"
  | "replicate"
  | "ollama";

export interface ModelInfo {
  id: string;
  name?: string;
  context?: number;
  capabilities?: Array<"chat" | "embedding" | "image" | "audio" | "vision" | "tool-use">;
  pricing?: {
    inputPerMillion?: number;
    outputPerMillion?: number;
    currency?: string;
  };
}

export interface QuotaInfo {
  hardLimit?: number;
  softLimit?: number;
  used?: number;
  currency?: string;
  resetAt?: string;
  raw?: unknown;
}

export interface LatencyStats {
  samples: number[];
  p50: number;
  p95: number;
  p99: number;
  mean: number;
  min: number;
  max: number;
}

export type ValidationStatus = "valid" | "invalid" | "rate_limited" | "network_error" | "unknown";

export interface ValidationResult {
  status: ValidationStatus;
  httpStatus?: number;
  message?: string;
  fix?: string;
  detectedScopes?: string[];
}

export interface SnippetParams {
  /** A safe, redacted display key. */
  redactedKey: string;
  /** A representative model id from the provider. */
  exampleModel: string;
  /** A representative prompt to embed in the snippet. */
  prompt: string;
}

export interface ProviderSnippet {
  curl: string;
  python: string;
  nodeFetch: string;
  jsAxios: string;
}

export interface ProviderAdapter {
  id: ProviderId;
  name: string;
  /** URL slug under /test/{slug}-api-key. */
  slug: string;
  /** Short tagline shown on the homepage card. */
  tagline: string;
  /** Regex used to detect the provider from a pasted key. */
  keyPattern: RegExp;
  /** Example key used in placeholders (never a real key). */
  keyExample: string;
  docsUrl: string;
  /** Where users go to get a key. */
  consoleUrl: string;
  statusPageUrl?: string;
  pricingUrl?: string;
  /** Categories shown on the provider page. */
  categories?: Array<"chat" | "embedding" | "image" | "audio" | "vision" | "open-source">;
  /** "true" if this provider needs a host URL instead of a key (e.g. Ollama). */
  hostBased?: boolean;
  /**
   * Validate the supplied key by calling a low-cost endpoint upstream.
   * Implementations MUST NOT log the key. Errors must not echo the key in messages.
   */
  validateKey(key: string, opts?: { signal?: AbortSignal }): Promise<ValidationResult>;
  /**
   * Fetch the list of models the key has access to.
   */
  listModels(key: string, opts?: { signal?: AbortSignal }): Promise<ModelInfo[]>;
  /**
   * Optional quota / spend fetch for providers that expose it.
   */
  fetchQuota?(key: string, opts?: { signal?: AbortSignal }): Promise<QuotaInfo | null>;
  /**
   * Optional streaming completion for the playground feature.
   */
  streamTest?(
    key: string,
    prompt: string,
    opts?: { model?: string; signal?: AbortSignal }
  ): AsyncIterable<string>;
  /**
   * Latency benchmark — N pings against a cheap endpoint, returning percentile stats.
   */
  benchmarkLatency(
    key: string,
    samples?: number,
    opts?: { signal?: AbortSignal }
  ): Promise<LatencyStats>;
  /**
   * Generate ready-to-copy snippets for this provider. Pure (no network).
   */
  snippets(params: SnippetParams): ProviderSnippet;
}
