import type { LatencyStats } from "./_types";

/**
 * Run an async fn N times serially, capture wall-clock latency for each call,
 * and return percentile stats. Failures count as a sample equal to the timeout
 * value to surface degraded behaviour rather than hiding it.
 */
export async function bench(
  fn: (signal?: AbortSignal) => Promise<unknown>,
  samples: number,
  opts: { timeoutMs?: number; signal?: AbortSignal } = {}
): Promise<LatencyStats> {
  const timeoutMs = opts.timeoutMs ?? 8000;
  const out: number[] = [];
  for (let i = 0; i < samples; i++) {
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), timeoutMs);
    const start = performance.now();
    try {
      await fn(opts.signal ?? ac.signal);
      out.push(performance.now() - start);
    } catch {
      out.push(timeoutMs);
    } finally {
      clearTimeout(timeout);
    }
  }
  return summarise(out);
}

export function summarise(samples: number[]): LatencyStats {
  if (samples.length === 0) {
    return { samples: [], p50: 0, p95: 0, p99: 0, mean: 0, min: 0, max: 0 };
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const pick = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))] ?? 0;
  const sum = samples.reduce((a, b) => a + b, 0);
  return {
    samples: samples.map((n) => Math.round(n * 100) / 100),
    p50: Math.round(pick(50) * 100) / 100,
    p95: Math.round(pick(95) * 100) / 100,
    p99: Math.round(pick(99) * 100) / 100,
    mean: Math.round((sum / samples.length) * 100) / 100,
    min: Math.round((sorted[0] ?? 0) * 100) / 100,
    max: Math.round((sorted[sorted.length - 1] ?? 0) * 100) / 100,
  };
}

/**
 * Fetch wrapper that times out after `ms` and never throws on response status.
 * Sanitises error messages so a key never leaks via thrown error text.
 */
export async function safeFetch(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 12000, ...rest } = init;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    return await fetch(url, { ...rest, signal: rest.signal ?? ac.signal });
  } finally {
    clearTimeout(t);
  }
}

/**
 * Convert a non-ok upstream response into a friendly fix line.
 * NEVER include the request body or auth header in the returned text.
 */
export function fixFromStatus(httpStatus: number): string | undefined {
  switch (httpStatus) {
    case 401:
      return "Key is invalid or revoked. Generate a new key from the provider console.";
    case 403:
      return "Key is valid but lacks permission for this resource. Check your project / org scope.";
    case 404:
      return "Endpoint not found. The provider may have moved this resource.";
    case 429:
      return "Rate limit hit. Wait a moment and retry, or check your quota.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Provider is having issues. Check their status page.";
    default:
      return undefined;
  }
}

/** Best-effort token preview that never echoes more than the last 4 chars. */
export function lastFour(key: string): string {
  if (!key) return "";
  return key.length <= 4 ? key : key.slice(-4);
}
