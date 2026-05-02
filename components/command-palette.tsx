"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { providers } from "@/lib/providers/_registry";
import { GUIDES } from "@/lib/guides";
import { Button } from "./ui/button";

const TOOLS = [
  { href: "/", label: "Home" },
  { href: "/bulk", label: "Bulk key tester" },
  { href: "/compare", label: "Cross-provider comparison" },
  { href: "/playground", label: "Playground" },
  { href: "/tools/rate-limit", label: "Rate-limit calculator" },
  { href: "/tools/webhook-validator", label: "Webhook signature validator" },
  { href: "/tools/status", label: "Provider status" },
  { href: "/privacy", label: "Privacy" },
  { href: "/security", label: "Security" },
];

export function CommandPaletteTrigger() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden h-8 gap-2 px-2 font-normal text-muted-foreground sm:flex"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search…</span>
        <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl overflow-hidden p-0">
          <Command label="Command Palette" className="rounded-lg">
            <div className="flex items-center border-b border-border/60 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <Command.Input
                placeholder="Search providers, tools, guides…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                Nothing matches.
              </Command.Empty>
              <Command.Group heading="Test a provider" className="px-2 text-xs text-muted-foreground">
                {providers.map((p) => (
                  <Command.Item
                    key={p.id}
                    value={`test ${p.name} ${p.id}`}
                    onSelect={() => go(`/test/${p.slug}-api-key`)}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm aria-selected:bg-accent"
                  >
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.tagline}</span>
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading="Tools" className="px-2 pt-2 text-xs text-muted-foreground">
                {TOOLS.map((t) => (
                  <Command.Item
                    key={t.href}
                    value={`tool ${t.label}`}
                    onSelect={() => go(t.href)}
                    className="cursor-pointer rounded px-2 py-2 text-sm aria-selected:bg-accent"
                  >
                    {t.label}
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading="Guides" className="px-2 pt-2 text-xs text-muted-foreground">
                {GUIDES.map((g) => (
                  <Command.Item
                    key={g.slug}
                    value={`guide ${g.title}`}
                    onSelect={() => go(`/guides/${g.slug}`)}
                    className="cursor-pointer rounded px-2 py-2 text-sm aria-selected:bg-accent"
                  >
                    {g.title}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
