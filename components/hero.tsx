"use client";

import { motion } from "framer-motion";
import { providers } from "@/lib/providers/_registry";
import { KeyInput } from "./key-input";
import { PrivacyBanner } from "./privacy-banner";

export function Hero() {
  return (
    <section className="relative -mt-10 pb-10 pt-12 sm:pt-16">
      <div className="dotted-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <div className="space-y-7">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-4"
        >
          <h1 className="text-display-xl font-semibold tracking-tight">
            Test any LLM API key{" "}
            <span className="relative whitespace-nowrap">
              <span className="text-muted-foreground">in seconds</span>
              <span
                className="ml-0.5 inline-block h-[0.62em] w-[0.06em] translate-y-[0.05em] bg-brand align-baseline motion-safe:animate-blink"
                aria-hidden
              />
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Paste a key, list your accessible models, benchmark latency, and copy a snippet.
            Works with {providers.length} providers. No signup.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-2"
        >
          <KeyInput detectAndRoute />
          <PrivacyBanner />
        </motion.div>
      </div>
    </section>
  );
}
