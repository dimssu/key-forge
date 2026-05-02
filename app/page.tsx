import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { ProviderGrid } from "@/components/provider-grid";
import { PrivacyBanner } from "@/components/privacy-banner";
import { KeyInput } from "@/components/key-input";
import { Button } from "@/components/ui/button";
import { GUIDES } from "@/lib/guides";
import { softwareApp } from "@/lib/seo/jsonld";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-0.5 text-xs">
            <Sparkles className="h-3 w-3" /> Free, open source, zero signup
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Test any LLM API key in seconds.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Paste a key from OpenAI, Anthropic, Gemini, Groq, or 13 more providers. Verify it works, see
            which models you can call, benchmark latency, and copy ready-to-use snippets.
          </p>
        </div>
        <KeyInput detectAndRoute />
        <PrivacyBanner />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Highlight
          icon={<ShieldCheck className="h-4 w-4" />}
          title="Stateless"
          desc="Keys never persist. The proxy forwards once and forgets."
        />
        <Highlight
          icon={<Zap className="h-4 w-4" />}
          title="Latency-aware"
          desc="p50 / p95 / p99 from a 5-ping benchmark, per provider."
        />
        <Highlight
          icon={<Sparkles className="h-4 w-4" />}
          title="Snippet-first"
          desc="cURL, Python, Node fetch, axios — copy and ship."
        />
      </section>

      <ProviderGrid />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Guides</h2>
          <Button asChild variant="link" size="sm">
            <Link href="/guides">All guides <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {GUIDES.slice(0, 4).map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="block rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-foreground/30"
              >
                <h3 className="font-medium">{g.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp()) }}
      />
    </div>
  );
}

function Highlight({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-foreground">{icon}<span className="font-medium">{title}</span></div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
