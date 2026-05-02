import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function PrivacyBanner() {
  return (
    <p
      role="note"
      aria-label="Privacy notice"
      className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground/80"
    >
      <ShieldCheck className="h-3 w-3 flex-none text-success/80" aria-hidden />
      <span>
        Stateless proxy — keys never logged, stored, or persisted.{" "}
        <Link
          href="/privacy"
          className="text-foreground/80 underline decoration-border decoration-1 underline-offset-2 transition-colors hover:decoration-foreground"
        >
          What happens to your key →
        </Link>
      </span>
    </p>
  );
}
