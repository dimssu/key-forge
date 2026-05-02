import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProviderGrid } from "@/components/provider-grid";
import { Button } from "@/components/ui/button";
import { GUIDES } from "@/lib/guides";
import { softwareApp } from "@/lib/seo/jsonld";

export default function Home() {
  return (
    <div className="space-y-20">
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
