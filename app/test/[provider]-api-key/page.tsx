import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Key } from "lucide-react";
import { providers, getProviderBySlug } from "@/lib/providers/_registry";
import { Tester } from "@/components/tester";
import { PrivacyBanner } from "@/components/privacy-banner";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbs as breadcrumbLD, faqPage, howTo, softwareApp } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/meta";
import { getProviderContent } from "@/lib/provider-content";

interface Params {
  params: { provider: string };
}

function parseSlug(p: string): string | null {
  const m = /^(.*)-api-key$/.exec(p);
  return m ? m[1]! : null;
}

export function generateStaticParams() {
  return providers.map((p) => ({ provider: `${p.slug}-api-key` }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: Params): Metadata {
  const slug = parseSlug(params.provider);
  const adapter = slug ? getProviderBySlug(slug) : undefined;
  if (!adapter) return buildMetadata({ title: "Provider not found" });
  const title = `Test your ${adapter.name} API key`;
  const desc = `Verify a ${adapter.name} key works, list accessible models, benchmark latency, and copy ready-to-use snippets. Free, no signup.`;
  return buildMetadata({
    title,
    description: desc,
    path: `/test/${adapter.slug}-api-key`,
    keywords: [
      `${adapter.name.toLowerCase()} api key`,
      `test ${adapter.name.toLowerCase()} api key`,
      `validate ${adapter.name.toLowerCase()} api key`,
      `${adapter.name.toLowerCase()} key checker`,
      `how to get ${adapter.name.toLowerCase()} api key`,
    ],
    ogImage: `/api/og?provider=${adapter.slug}&title=${encodeURIComponent(adapter.name)}+API+key+tester`,
  });
}

export default function ProviderTestPage({ params }: Params) {
  const slug = parseSlug(params.provider);
  const adapter = slug ? getProviderBySlug(slug) : undefined;
  if (!adapter) notFound();

  const content = getProviderContent(adapter.id);
  const others = providers.filter((p) => p.id !== adapter.id).slice(0, 3);

  return (
    <article className="space-y-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/test/${adapter.slug}-api-key`, label: `${adapter.name} key tester` },
        ]}
      />

      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {(adapter.categories ?? []).map((c) => (
            <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Test your {adapter.name} API key
        </h1>
        <p className="max-w-2xl text-muted-foreground">{content.lede}</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={adapter.consoleUrl} target="_blank" rel="noreferrer">
              <Key className="mr-1.5 h-3.5 w-3.5" /> Get a key
              <ExternalLink className="ml-1.5 h-3 w-3" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href={adapter.docsUrl} target="_blank" rel="noreferrer">
              API docs <ExternalLink className="ml-1.5 h-3 w-3" />
            </a>
          </Button>
          {adapter.pricingUrl && (
            <Button asChild variant="ghost" size="sm">
              <a href={adapter.pricingUrl} target="_blank" rel="noreferrer">
                Pricing <ExternalLink className="ml-1.5 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </header>

      <PrivacyBanner />

      <Tester
        provider={{
          id: adapter.id,
          name: adapter.name,
          slug: adapter.slug,
          keyExample: adapter.keyExample,
          consoleUrl: adapter.consoleUrl,
          docsUrl: adapter.docsUrl,
          hostBased: adapter.hostBased,
          categories: adapter.categories,
        }}
      />

      <section aria-labelledby="overview" className="prose-doc">
        <h2 id="overview">What this key does</h2>
        <p>{content.whatItDoes}</p>
        <h2>How to get a {adapter.name} API key</h2>
        <ol>
          {content.howToGet.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <h2>Common errors and fixes</h2>
        <ul>
          {content.commonErrors.map((e, i) => (
            <li key={i}>
              <strong>{e.code}:</strong> {e.fix}
            </li>
          ))}
        </ul>
        <h2>Security best practices</h2>
        <ul>
          {content.security.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        {content.pricing && (
          <>
            <h2>Pricing at a glance</h2>
            <p>{content.pricing}</p>
          </>
        )}
      </section>

      <section aria-labelledby="faq" className="space-y-3">
        <h2 id="faq" className="text-xl font-semibold">FAQ</h2>
        <dl className="divide-y divide-border/60 rounded-lg border border-border/60">
          {content.faqs.map((f, i) => (
            <div key={i} className="px-4 py-3">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="related" className="space-y-3">
        <h2 id="related" className="text-xl font-semibold">Test other providers</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {others.map((p) => (
            <li key={p.id}>
              <Link
                href={`/test/${p.slug}-api-key`}
                className="flex flex-col gap-1 rounded-lg border border-border/60 bg-card p-4 hover:border-foreground/30"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="related-guides" className="space-y-3">
        <h2 id="related-guides" className="text-xl font-semibold">Related reading</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {content.relatedGuides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="flex flex-col gap-1 rounded-lg border border-border/60 bg-card p-4 hover:border-foreground/30"
              >
                <span className="font-medium">{g.title}</span>
                <span className="text-xs text-muted-foreground">{g.description}</span>
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLD([
              { name: "Home", href: "/" },
              { name: `${adapter.name} key tester`, href: `/test/${adapter.slug}-api-key` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage(content.faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howTo({
              name: `How to test a ${adapter.name} API key`,
              description: `Verify a ${adapter.name} API key works and list the models it can call.`,
              steps: [
                { name: "Get a key", text: `Sign in at ${adapter.consoleUrl} and create an API key.` },
                { name: "Paste the key", text: "Paste it into the KeyForge tester field." },
                { name: "Run", text: "Press ⌘+Enter or click Test key. We'll validate, list models, and time the call." },
              ],
            })
          ),
        }}
      />
    </article>
  );
}
