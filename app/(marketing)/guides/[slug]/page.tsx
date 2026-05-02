import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GUIDES, getGuide } from "@/lib/guides";
import { GUIDE_BODIES } from "@/lib/guides-content";
import { article, breadcrumbs as breadcrumbsLD } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/meta";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return buildMetadata({ title: "Guide not found" });
  return buildMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    keywords: guide.keywords,
    type: "article",
    published: guide.published,
    updated: guide.updated,
    ogImage: `/api/og?title=${encodeURIComponent(guide.title)}`,
  });
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  const body = GUIDE_BODIES[params.slug];
  if (!guide || !body) notFound();

  const related = (guide.related ?? [])
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/guides", label: "Guides" },
          { href: `/guides/${guide.slug}`, label: guide.title },
        ]}
      />
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{guide.title}</h1>
        <p className="text-muted-foreground">{guide.description}</p>
        <p className="text-xs text-muted-foreground">
          Published {new Date(guide.published).toLocaleDateString()}
          {guide.updated ? ` · Updated ${new Date(guide.updated).toLocaleDateString()}` : ""}
        </p>
      </header>
      <section
        className="prose-doc"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {related.length > 0 && (
        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="text-lg font-semibold">Related guides</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {related.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="block rounded-lg border border-border/60 bg-card p-4 hover:border-foreground/30"
                >
                  <span className="font-medium">{g.title}</span>
                  <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            article({
              title: guide.title,
              description: guide.description,
              slug: guide.slug,
              published: guide.published,
              updated: guide.updated,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsLD([
              { name: "Home", href: "/" },
              { name: "Guides", href: "/guides" },
              { name: guide.title, href: `/guides/${guide.slug}` },
            ])
          ),
        }}
      />
    </article>
  );
}
