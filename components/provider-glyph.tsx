import { cn } from "@/lib/utils";
import type { ProviderId } from "@/lib/providers/_types";

/**
 * Per-provider tinted gradient for the glyph mark. Tints are loose
 * brand-adjacent — chosen for recognition, not copyright.
 */
const TINTS: Record<ProviderId, [from: string, to: string]> = {
  openai: ["from-emerald-400/20", "to-emerald-500/5"],
  anthropic: ["from-amber-400/20", "to-orange-500/5"],
  gemini: ["from-sky-400/20", "to-indigo-500/5"],
  mistral: ["from-orange-400/20", "to-rose-500/5"],
  cohere: ["from-fuchsia-400/20", "to-pink-500/5"],
  groq: ["from-rose-400/20", "to-red-500/5"],
  deepseek: ["from-blue-400/20", "to-cyan-500/5"],
  xai: ["from-zinc-300/20", "to-zinc-500/5"],
  perplexity: ["from-teal-400/20", "to-cyan-500/5"],
  together: ["from-violet-400/20", "to-purple-500/5"],
  fireworks: ["from-yellow-400/20", "to-orange-500/5"],
  openrouter: ["from-purple-400/20", "to-blue-500/5"],
  "azure-openai": ["from-blue-400/20", "to-sky-500/5"],
  bedrock: ["from-amber-400/20", "to-yellow-500/5"],
  huggingface: ["from-yellow-400/20", "to-amber-500/5"],
  replicate: ["from-pink-400/20", "to-rose-500/5"],
  ollama: ["from-zinc-300/20", "to-zinc-500/5"],
};

/**
 * Single-letter mark in a tinted square. The first non-space character of the
 * provider name with a tint that hints at the brand. Pure SVG-ish, no images.
 */
export function ProviderGlyph({
  id,
  name,
  size = 36,
  className,
}: {
  id: ProviderId;
  name: string;
  size?: number;
  className?: string;
}) {
  const initial = name.replace(/[^A-Za-z]/g, "")[0]?.toUpperCase() ?? "?";
  const [from, to] = TINTS[id] ?? ["from-zinc-300/20", "to-zinc-500/5"];
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-md border border-border/60 bg-gradient-to-br font-mono text-[0.95rem] font-semibold text-foreground/80",
        from,
        to,
        className
      )}
    >
      {initial}
      <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-foreground/5" />
    </span>
  );
}
