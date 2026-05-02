import Link from "next/link";
import { Github } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { CommandPaletteTrigger } from "./command-palette";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Logo size={22} className="text-primary" />
            <span>KeyForge</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <Link href="/bulk" className="hover:text-foreground">Bulk</Link>
            <Link href="/compare" className="hover:text-foreground">Compare</Link>
            <Link href="/playground" className="hover:text-foreground">Playground</Link>
            <Link href="/guides" className="hover:text-foreground">Guides</Link>
            <Link href="/tools/status" className="hover:text-foreground">Status</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <CommandPaletteTrigger />
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon" aria-label="GitHub repository">
            <a href="https://github.com/dimssu/key-forge" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
