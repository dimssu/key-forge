import Link from "next/link";
import { Github } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { CommandPaletteTrigger } from "./command-palette";
import { Wordmark } from "./wordmark";
import { Button } from "./ui/button";

const NAV = [
  { href: "/bulk", label: "Bulk" },
  { href: "/compare", label: "Compare" },
  { href: "/playground", label: "Playground" },
  { href: "/guides", label: "Guides" },
  { href: "/tools/status", label: "Status" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <Link
            href="/"
            className="group flex items-center gap-2 text-[15px]"
            aria-label="KeyForge home"
          >
            <Wordmark />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-5 text-sm text-muted-foreground md:flex"
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="relative transition-colors hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <CommandPaletteTrigger />
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="GitHub repository"
            className="hidden sm:inline-flex"
          >
            <a href="https://github.com/dimssu/key-forge" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
