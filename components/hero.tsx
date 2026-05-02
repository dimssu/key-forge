"use client";

import { motion } from "framer-motion";
import { providers } from "@/lib/providers/_registry";
import { ProviderGlyph } from "./provider-glyph";
import { KeyInput } from "./key-input";
import { PrivacyBanner } from "./privacy-banner";
import type { ProviderId } from "@/lib/providers/_types";

const heroProviderOrder: ProviderId[] = [
  "openai",
  "anthropic",
  "gemini",
  "groq",
  "mistral",
  "cohere",
  "perplexity",
  "xai",
  "deepseek",
  "openrouter",
  "together",
  "fireworks",
  "huggingface",
  "replicate",
  "ollama",
];

export function Hero() {
  const heroProviders = heroProviderOrder
    .map((id) => providers.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="relative -mt-10 pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div className="dotted-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="bg-noise pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-5"
        >
          <Eyebrow />

          <h1 className="text-display-2xl font-semibold tracking-tight">
            Test any LLM API key
            <br />
            <span className="relative inline-block">
              <span className="text-foreground">in</span>{" "}
              <span className="bg-gradient-to-br from-foreground via-foreground to-brand bg-clip-text text-transparent">
                seconds
              </span>
              <span className="ml-1 inline-block h-[0.62em] w-[0.06em] translate-y-[0.05em] bg-brand align-baseline animate-blink" />
            </span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Paste a key from{" "}
            <span className="text-foreground">OpenAI</span>,{" "}
            <span className="text-foreground">Anthropic</span>,{" "}
            <span className="text-foreground">Gemini</span>, or{" "}
            <span className="text-foreground">{providers.length - 3} more</span>. Verify it
            works, see your accessible models, benchmark latency, copy a snippet. No signup.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-3"
        >
          <KeyInput detectAndRoute />
          <PrivacyBanner />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-3"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
            Works with
          </p>
          <div className="flex flex-wrap gap-2">
            {heroProviders.map((p) => (
              <a
                key={p.id}
                href={`/test/${p.slug}-api-key`}
                className="group flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <ProviderGlyph id={p.id} name={p.name} size={20} className="!text-[0.7rem]" />
                <span>{p.name}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Eyebrow() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 py-1 pl-1 pr-3 text-xs font-medium text-muted-foreground backdrop-blur">
      <span className="grid h-5 place-items-center rounded-full bg-brand/15 px-2 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-brand">
        v0.1
      </span>
      <span>
        Free, open source, zero signup &middot;{" "}
        <span className="text-foreground">17 providers</span>
      </span>
    </div>
  );
}
