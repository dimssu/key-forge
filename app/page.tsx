import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProviderGrid } from "@/components/provider-grid";
import { Button } from "@/components/ui/button";
import { GUIDES } from "@/lib/guides";
import { faqPage, softwareApp } from "@/lib/seo/jsonld";

const HOMEPAGE_FAQS = [
  {
    q: "What is KeyForge?",
    a: "KeyForge is a free, open-source developer tool that tests Large Language Model (LLM) API keys. Paste a key from OpenAI, Anthropic, Google Gemini, Groq, Mistral, Cohere, DeepSeek, xAI, Perplexity, Together AI, Fireworks AI, OpenRouter, Azure OpenAI, AWS Bedrock, Hugging Face, Replicate, or a local Ollama host, and KeyForge verifies the key works, lists every model it can call, benchmarks request latency, and generates ready-to-use cURL, Python, and Node.js snippets.",
  },
  {
    q: "Is KeyForge related to the KeyForge card game?",
    a: "No. This site is a developer tool for testing LLM API keys. It is unrelated to the trading card game KeyForge published by Asmodee / Fantasy Flight Games. The naming overlap is coincidental.",
  },
  {
    q: "What does KeyForge do with my API key?",
    a: "Nothing — beyond forwarding it once to the upstream provider so we can read the response. The proxy is stateless: keys are never logged, stored, or persisted. There is no database, no analytics on key values, and no third-party scripts. The full code is open source on GitHub.",
  },
  {
    q: "Which LLM providers does KeyForge support?",
    a: "OpenAI, Anthropic (Claude), Google Gemini, Mistral, Cohere, Groq, DeepSeek, xAI (Grok), Perplexity, Together AI, Fireworks AI, OpenRouter, Azure OpenAI, AWS Bedrock, Hugging Face, Replicate, and Ollama (local). Adding a new provider takes about 30 minutes — see the contributing guide.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. KeyForge is free and requires no account, email, or signup. Just paste a key and test.",
  },
  {
    q: "Can I run KeyForge myself?",
    a: "Yes. The codebase is MIT-licensed and runs on any Node.js host or Vercel. Clone the repo at github.com/dimssu/key-forge and follow the README.",
  },
];

export default function Home() {
  return (
    <div className="space-y-14">
      <Hero />

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

      <section aria-labelledby="faq-heading" className="space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            What KeyForge is — and isn&apos;t.
          </h2>
        </div>
        <dl className="surface-raised divide-y divide-border/60 overflow-hidden rounded-lg">
          {HOMEPAGE_FAQS.map((f, i) => (
            <div key={i} className="px-5 py-4">
              <dt className="font-medium tracking-tight">{f.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
              Guides
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Practical, opinionated, no fluff.
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="self-start sm:self-end">
            <Link href="/guides">
              All guides <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {GUIDES.slice(0, 4).map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="ring-gradient surface-raised group relative block h-full overflow-hidden rounded-lg p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <p className="font-mono text-[0.7rem] text-muted-foreground">
                  /guides/{g.slug}
                </p>
                <h3 className="mt-3 text-lg font-medium tracking-tight">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {g.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                  Read <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage(HOMEPAGE_FAQS)) }}
      />
    </div>
  );
}

function Highlight({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="surface-raised flex flex-col gap-2 rounded-lg p-5">
      <div className="flex items-center gap-2 text-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-brand/10 text-brand">
          {icon}
        </span>
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}
