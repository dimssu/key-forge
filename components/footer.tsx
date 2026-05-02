import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo size={20} className="text-primary" />
            <span>KeyForge</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Test any LLM API key in seconds. Free, open source, zero signup.
          </p>
        </div>
        <FooterColumn
          title="Test"
          links={[
            { href: "/test/openai-api-key", label: "OpenAI" },
            { href: "/test/anthropic-api-key", label: "Anthropic" },
            { href: "/test/gemini-api-key", label: "Gemini" },
            { href: "/test/groq-api-key", label: "Groq" },
            { href: "/test/openrouter-api-key", label: "OpenRouter" },
          ]}
        />
        <FooterColumn
          title="Tools"
          links={[
            { href: "/bulk", label: "Bulk tester" },
            { href: "/compare", label: "Cross-provider compare" },
            { href: "/playground", label: "Playground" },
            { href: "/tools/rate-limit", label: "Rate-limit calculator" },
            { href: "/tools/webhook-validator", label: "Webhook validator" },
            { href: "/tools/status", label: "Provider status" },
          ]}
        />
        <FooterColumn
          title="Trust"
          links={[
            { href: "/privacy", label: "Privacy" },
            { href: "/security", label: "Security" },
            { href: "/.well-known/security.txt", label: "security.txt" },
            { href: "/guides", label: "Guides" },
          ]}
        />
      </div>
      <div className="border-t border-border/60">
        <div className="container py-4 text-xs text-muted-foreground">
          MIT licensed. Built for developers who don&apos;t want to ship a key they can&apos;t use.
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
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
