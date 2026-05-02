"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { providers } from "@/lib/providers/_registry";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ProviderGlyph } from "./provider-glyph";

export function ProviderGrid() {
  const [q, setQ] = React.useState("");
  const filtered = providers.filter((p) =>
    !q.trim()
      ? true
      : `${p.name} ${p.id} ${p.tagline}`.toLowerCase().includes(q.trim().toLowerCase())
  );
  return (
    <section aria-labelledby="providers-heading" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
            Providers
          </p>
          <h2
            id="providers-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Pick a provider, paste a key, ship.
          </h2>
        </div>
        <div className="relative w-full max-w-xs">
          <Search
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter providers"
            className="h-9 pl-8 text-sm"
            aria-label="Filter providers"
          />
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
          >
            <Link
              href={`/test/${p.slug}-api-key`}
              className="ring-gradient surface-raised group relative flex h-full flex-col gap-4 overflow-hidden rounded-lg p-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ProviderGlyph id={p.id} name={p.name} size={36} />
                  <div className="space-y-0.5">
                    <p className="font-medium leading-none">{p.name}</p>
                    <p className="font-mono text-[0.7rem] text-muted-foreground">
                      /test/{p.slug}-api-key
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.tagline}</p>
              {(p.categories?.length ?? 0) > 0 && (
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {p.categories!.map((c) => (
                    <Badge
                      key={c}
                      variant="outline"
                      className="border-border/60 bg-background/40 text-[10px] font-medium text-muted-foreground"
                    >
                      {c}
                    </Badge>
                  ))}
                </div>
              )}
            </Link>
          </motion.li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          No providers match &quot;{q}&quot;.
        </p>
      )}
    </section>
  );
}
