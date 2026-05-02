"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Wand2 } from "lucide-react";
import { detectProvider, providers } from "@/lib/providers/_registry";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface KeyInputProps {
  initialProviderId?: string;
  /** When true, the input auto-routes to the matched provider page on paste. */
  detectAndRoute?: boolean;
  /** Called with the raw key + matched provider id when the user submits. */
  onSubmit?: (key: string, providerId: string) => void;
  className?: string;
}

export function KeyInput({
  initialProviderId,
  detectAndRoute = false,
  onSubmit,
  className,
}: KeyInputProps) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [reveal, setReveal] = React.useState(false);
  const [providerId, setProviderId] = React.useState<string | undefined>(initialProviderId);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const provider = providers.find((p) => p.id === providerId);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (raw: string) => {
    setValue(raw);
    const detected = detectProvider(raw);
    if (detected) setProviderId(detected.id);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const txt = e.clipboardData.getData("text").trim();
    const detected = detectProvider(txt);
    if (detected && detectAndRoute && detected.slug !== initialProviderId) {
      e.preventDefault();
      sessionStorage.setItem("kf:lastKey", txt);
      router.push(`/test/${detected.slug}-api-key?p=1`);
    }
  };

  React.useEffect(() => {
    const stash = sessionStorage.getItem("kf:lastKey");
    if (stash) {
      setValue(stash);
      const detected = detectProvider(stash);
      if (detected) setProviderId(detected.id);
      sessionStorage.removeItem("kf:lastKey");
    }
  }, []);

  const submit = () => {
    if (!value || !providerId) return;
    onSubmit?.(value, providerId);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="kf-key" className="block text-sm font-medium">
        Paste your API key
      </label>
      <div className="relative flex items-stretch gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            id="kf-key"
            type={reveal ? "text" : "password"}
            placeholder={provider?.keyExample ?? "sk-…  /  AIza…  /  hf_…  /  http://localhost:11434"}
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={onKey}
            className="pr-10 font-mono"
            aria-describedby="kf-key-detected"
          />
          <button
            type="button"
            onClick={() => setReveal((s) => !s)}
            aria-label={reveal ? "Hide key" : "Show key"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <Button onClick={submit} disabled={!value} className="gap-2">
          <Wand2 className="h-4 w-4" />
          Test key
          <kbd className="ml-1 hidden rounded border border-border/40 bg-background/20 px-1 text-[10px] sm:inline">
            ⌘↵
          </kbd>
        </Button>
      </div>
      <div id="kf-key-detected" className="flex items-center gap-2 text-xs text-muted-foreground">
        {provider ? (
          <>
            <span>Detected:</span>
            <Badge variant="secondary">{provider.name}</Badge>
          </>
        ) : (
          <span>Detected provider will appear here.</span>
        )}
      </div>
    </div>
  );
}
