import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { providers } from "@/lib/providers/_registry";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "LLM provider comparison",
  description:
    "Side-by-side comparison of OpenAI, Anthropic, Gemini, Groq, and 13 more LLM providers — categories, key shape, status pages, pricing.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <article className="space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/compare", label: "Compare" },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Cross-provider comparison</h1>
        <p className="max-w-2xl text-muted-foreground">
          A single table of every supported provider — what categories they cover, what their keys look like,
          and where to go for pricing or status. Click a provider to test a key.
        </p>
      </header>
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Provider</th>
              <th className="px-3 py-2 text-left">Categories</th>
              <th className="px-3 py-2 text-left">Key shape</th>
              <th className="px-3 py-2 text-left">Pricing</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-3 py-2">
                  <Link
                    href={`/test/${p.slug}-api-key`}
                    className="font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">{p.tagline}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {(p.categories ?? []).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px]">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-xs">{p.keyExample}</td>
                <td className="px-3 py-2">
                  {p.pricingUrl ? (
                    <a
                      href={p.pricingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                    >
                      pricing
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {p.statusPageUrl ? (
                    <a
                      href={p.statusPageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                    >
                      status
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
