import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function PrivacyBanner() {
  return (
    <div
      role="note"
      aria-label="Privacy notice"
      className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/[0.06] px-3.5 py-2.5 text-sm"
    >
      <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-success" aria-hidden />
      <p className="text-muted-foreground">
        Stateless proxy &middot; never logs, stores, or persists your key.{" "}
        <Link
          href="/privacy"
          className="font-medium text-foreground underline decoration-border decoration-1 underline-offset-[3px] transition-colors hover:decoration-foreground"
        >
          See exactly what happens to it
        </Link>
        .
      </p>
    </div>
  );
}
