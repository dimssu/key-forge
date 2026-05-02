#!/usr/bin/env node
import kleur from "kleur";

const HELP = `keyforge — test any LLM API key from your terminal

Usage:
  npx keyforge validate <provider>      Validate a key. Reads from KEYFORGE_KEY env var.
  npx keyforge models <provider>        List models accessible to the key.
  npx keyforge bench <provider> [N]     Run an N-ping latency benchmark (default 5).
  npx keyforge providers                List supported providers.

Environment:
  KEYFORGE_KEY         The key to test.
  KEYFORGE_BASE_URL    Override the proxy base (default https://keyforge.dimssu.com).

Examples:
  KEYFORGE_KEY=sk-... npx keyforge validate openai
  KEYFORGE_KEY=sk-ant-... npx keyforge models anthropic`;

const PROVIDERS = [
  "openai", "anthropic", "gemini", "mistral", "cohere", "groq",
  "deepseek", "xai", "perplexity", "together", "fireworks", "openrouter",
  "azure-openai", "bedrock", "huggingface", "replicate", "ollama",
];

const base = process.env.KEYFORGE_BASE_URL ?? "https://keyforge.dimssu.com";

async function call(provider: string, action: "validate" | "models" | "bench", samples?: number) {
  const key = process.env.KEYFORGE_KEY;
  if (!key) {
    console.error(kleur.red("KEYFORGE_KEY env var is required."));
    process.exit(1);
  }
  const res = await fetch(`${base}/api/proxy/${provider}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-keyforge-key": key },
    body: JSON.stringify({ action, samples }),
  });
  if (!res.ok) {
    console.error(kleur.red(`HTTP ${res.status}`));
    const txt = await res.text();
    console.error(txt);
    process.exit(2);
  }
  return res.json();
}

const [, , cmd, provider, ...rest] = process.argv;

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(HELP);
  process.exit(0);
}

if (cmd === "providers") {
  for (const p of PROVIDERS) console.log(p);
  process.exit(0);
}

if (!provider || !PROVIDERS.includes(provider)) {
  console.error(kleur.red(`Unknown provider. Try one of: ${PROVIDERS.join(", ")}.`));
  process.exit(1);
}

if (cmd === "validate") {
  const out = await call(provider, "validate");
  const ok = out.status === "valid";
  console.log(ok ? kleur.green("valid") : kleur.red(out.status));
  if (out.fix) console.log(kleur.gray(out.fix));
  process.exit(ok ? 0 : 3);
} else if (cmd === "models") {
  const out = await call(provider, "models");
  for (const m of out.models ?? []) console.log(m.id);
} else if (cmd === "bench") {
  const n = Number(rest[0] ?? 5);
  const out = await call(provider, "bench", n);
  const s = out.stats;
  console.log(`p50 ${kleur.cyan(`${s.p50}ms`)}  p95 ${kleur.cyan(`${s.p95}ms`)}  p99 ${kleur.cyan(`${s.p99}ms`)}  mean ${s.mean}ms`);
} else {
  console.error(kleur.red(`Unknown command: ${cmd}`));
  console.log(HELP);
  process.exit(1);
}
