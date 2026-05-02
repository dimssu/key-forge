import Link from "next/link";

interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-muted-foreground/70">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="text-border">/</span>}
              {last ? (
                <span aria-current="page" className="text-foreground/90">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="transition-colors hover:text-foreground">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
