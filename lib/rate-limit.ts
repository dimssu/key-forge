/**
 * In-memory sliding-window rate limiter. Edge-runtime friendly.
 * Best-effort only — across multiple regions or instances each has its own counter.
 * Documented openly in /security so users know what to expect.
 */
const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export function check(
  ip: string,
  opts: { perMinute?: number; windowMs?: number } = {}
): RateLimitResult {
  const limit = opts.perMinute ?? Number(process.env.KEYFORGE_RATE_LIMIT_PER_MINUTE ?? 30);
  const window = opts.windowMs ?? 60_000;
  const now = Date.now();
  const arr = buckets.get(ip) ?? [];
  const fresh = arr.filter((t) => now - t < window);
  if (fresh.length >= limit) {
    const oldest = fresh[0] ?? now;
    return { allowed: false, remaining: 0, resetMs: window - (now - oldest) };
  }
  fresh.push(now);
  buckets.set(ip, fresh);
  // simple GC: at most 5000 keys retained
  if (buckets.size > 5000) {
    const cutoff = now - window;
    for (const [k, v] of buckets) {
      const trimmed = v.filter((t) => t > cutoff);
      if (trimmed.length === 0) buckets.delete(k);
      else buckets.set(k, trimmed);
    }
  }
  return { allowed: true, remaining: limit - fresh.length, resetMs: window };
}

export function ipFromRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
