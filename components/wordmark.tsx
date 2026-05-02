import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  showSlash?: boolean;
}

/** "key/forge" lockup — the slash is the brand spike (rendered in brand color). */
export function Wordmark({ className, showSlash = true }: WordmarkProps) {
  return (
    <span className={cn("inline-flex items-baseline gap-0 font-semibold tracking-tight", className)}>
      <span>key</span>
      {showSlash && (
        <span className="text-brand" aria-hidden>
          /
        </span>
      )}
      {!showSlash && <span aria-hidden>·</span>}
      <span>forge</span>
    </span>
  );
}
