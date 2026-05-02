import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redactKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "•".repeat(Math.max(key.length, 4));
  return `${key.slice(0, 3)}…${key.slice(-4)}`;
}

export function siteUrl(path = "/"): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apikit.dimssu.com";
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx] ?? 0;
}

export function formatMs(n: number): string {
  if (n < 1) return "<1ms";
  if (n < 1000) return `${Math.round(n)}ms`;
  return `${(n / 1000).toFixed(2)}s`;
}
