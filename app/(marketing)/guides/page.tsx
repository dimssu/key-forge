import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GUIDES } from "@/lib/guides";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "LLM API key guides",
  description:
    "Practical guides on getting, securing, rotating, and choosing between LLM API keys — OpenAI, Anthropic, Gemini, and more.",
  path: "/guides",
});

export default function GuidesIndex() {
  return (
    <article className="space-y-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/guides", label: "Guides" }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Guides</h1>
        <p className="max-w-2xl text-muted-foreground">
          Practical, opinionated walkthroughs for working with LLM API keys: how to get them, how to secure
          them, and how to compare them.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="block h-full rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-foreground/30"
            >
              <h2 className="font-medium">{g.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
