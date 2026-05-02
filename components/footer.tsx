import Link from "next/link";
import { Wordmark } from "./wordmark";

const COLUMNS: Array<{
  title: string;
  links: Array<{ href: string; label: string }>;
}> = [
  {
    title: "Test",
    links: [
      { href: "/test/openai-api-key", label: "OpenAI" },
      { href: "/test/anthropic-api-key", label: "Anthropic" },
      { href: "/test/gemini-api-key", label: "Gemini" },
      { href: "/test/groq-api-key", label: "Groq" },
      { href: "/test/openrouter-api-key", label: "OpenRouter" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/bulk", label: "Bulk tester" },
      { href: "/compare", label: "Cross-provider compare" },
      { href: "/playground", label: "Playground" },
      { href: "/tools/rate-limit", label: "Rate-limit calculator" },
      { href: "/tools/webhook-validator", label: "Webhook validator" },
      { href: "/tools/status", label: "Provider status" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/security", label: "Security" },
      { href: "/.well-known/security.txt", label: "security.txt" },
      { href: "/guides", label: "Guides" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <Wordmark className="text-2xl" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Test any LLM API key in seconds. Free, open source, zero signup.
            </p>
            <p className="font-mono text-[0.7rem] text-muted-foreground/60">
              keyforge.dimssu.com
            </p>
          </div>
          {COLUMNS.map((c) => (
            <FooterColumn key={c.title} {...c} />
          ))}
        </div>
      </div>

      {/* big visible wordmark */}
      <div className="container overflow-hidden pb-6 pt-2 select-none" aria-hidden>
        <div className="text-[18vw] font-semibold leading-[0.85] tracking-[-0.05em] bg-gradient-to-b from-foreground/[0.07] to-transparent bg-clip-text text-transparent">
          keyforge
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container flex flex-col items-start justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>MIT licensed &middot; built for developers shipping with LLMs.</p>
          <p className="font-mono text-[0.7rem]">© {new Date().getFullYear()} KeyForge contributors</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
