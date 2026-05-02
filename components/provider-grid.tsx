"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { providers } from "@/lib/providers/_registry";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

export function ProviderGrid() {
  const [q, setQ] = React.useState("");
  const filtered = providers.filter((p) =>
    !q.trim()
      ? true
      : `${p.name} ${p.id} ${p.tagline}`.toLowerCase().includes(q.trim().toLowerCase())
  );
  return (
    <section aria-labelledby="providers-heading" className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="providers-heading" className="text-lg font-semibold">
          All {providers.length} supported providers
        </h2>
        <div className="relative max-w-xs">
          <Search
            className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter providers"
            className="h-9 pl-7 text-sm"
            aria-label="Filter providers"
          />
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <li key={p.id}>
            <Link
              href={`/test/${p.slug}-api-key`}
              className="group flex h-full flex-col justify-between rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-foreground/30"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-medium">{p.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {(p.categories ?? []).map((c) => (
                  <Badge key={c} variant="outline" className="text-[10px]">
                    {c}
                  </Badge>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
