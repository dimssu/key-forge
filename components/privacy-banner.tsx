import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function PrivacyBanner() {
  return (
    <div
      role="note"
      aria-label="Privacy notice"
      className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 text-sm"
    >
      <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-success" />
      <p className="text-muted-foreground">
        Your key is sent through a stateless server proxy and forwarded directly upstream. We never log,
        store, or persist it. <Link href="/privacy" className="underline decoration-dotted underline-offset-4 hover:text-foreground">See exactly what happens to it</Link>.
      </p>
    </div>
  );
}
