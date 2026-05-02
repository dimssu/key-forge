"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Wand2 } from "lucide-react";
import { detectProvider, providers } from "@/lib/providers/_registry";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ProviderGlyph } from "./provider-glyph";
import { cn } from "@/lib/utils";

interface KeyInputProps {
  initialProviderId?: string;
  detectAndRoute?: boolean;
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
      <label
        htmlFor="kf-key"
        className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
      >
        <span>API key</span>
        <span className="text-muted-foreground/40">·</span>
        <span className="font-mono normal-case tracking-normal text-muted-foreground/70">
          paste anywhere
        </span>
      </label>

      <div
        className={cn(
          "ring-gradient surface-raised group relative flex items-stretch gap-2 rounded-xl p-1.5 transition-shadow",
          provider && "ring-1 ring-brand/20"
        )}
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center gap-2 text-muted-foreground">
            <AnimatePresence mode="wait">
              {provider ? (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <ProviderGlyph id={provider.id} name={provider.name} size={24} className="!text-[0.7rem]" />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid h-6 w-6 place-items-center rounded-md border border-dashed border-border font-mono text-[0.7rem] text-muted-foreground/60"
                >
                  ?
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <input
            ref={inputRef}
            id="kf-key"
            type={reveal ? "text" : "password"}
            placeholder={provider?.keyExample ?? "sk-…  ·  AIza…  ·  hf_…  ·  http://localhost:11434"}
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={onKey}
            aria-describedby="kf-key-detected"
            className="h-12 w-full rounded-lg border-0 bg-transparent pl-12 pr-12 font-mono text-sm tracking-wide outline-none placeholder:text-muted-foreground/50"
          />
          <button
            type="button"
            onClick={() => setReveal((s) => !s)}
            aria-label={reveal ? "Hide key" : "Show key"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <Button
          onClick={submit}
          disabled={!value}
          className="h-auto gap-2 rounded-lg px-5 font-medium"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Test key
          <kbd className="ml-1 hidden rounded border border-foreground/20 bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            ⌘↵
          </kbd>
        </Button>
      </div>

      <div
        id="kf-key-detected"
        className="flex h-5 items-center gap-2 text-xs text-muted-foreground"
      >
        <AnimatePresence mode="wait">
          {provider ? (
            <motion.div
              key={`detected-${provider.id}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-center gap-2"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand" />
              <span>Detected</span>
              <Badge
                variant="outline"
                className="border-border/60 bg-background/40 font-mono text-[10px]"
              >
                {provider.name}
              </Badge>
            </motion.div>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="font-mono"
            >
              We&apos;ll detect the provider from the key shape.
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
