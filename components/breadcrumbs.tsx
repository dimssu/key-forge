import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />}
              {last ? (
                <span aria-current="page" className="text-foreground">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-foreground">{c.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
