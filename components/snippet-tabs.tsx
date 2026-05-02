"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import type { ProviderSnippet } from "@/lib/providers/_types";

const TABS: Array<{ key: keyof ProviderSnippet; label: string; lang: string }> = [
  { key: "curl", label: "cURL", lang: "shell" },
  { key: "python", label: "Python", lang: "py" },
  { key: "nodeFetch", label: "Node fetch", lang: "ts" },
  { key: "jsAxios", label: "axios", lang: "ts" },
];

export function SnippetTabs({ snippet }: { snippet: ProviderSnippet }) {
  const [tab, setTab] = React.useState<keyof ProviderSnippet>("curl");
  const [copied, setCopied] = React.useState(false);
  const code = snippet[tab];
  const lang = TABS.find((t) => t.key === tab)?.lang ?? "txt";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as keyof ProviderSnippet)}
      className="space-y-2"
    >
      <div className="flex items-center justify-between gap-2">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {TABS.map((t) => (
        <TabsContent key={t.key} value={t.key} className="mt-0">
          <CodeBlock code={snippet[t.key]} lang={t.lang} onCopy={copy} copied={copied && tab === t.key} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function CodeBlock({
  code,
  lang,
  onCopy,
  copied,
}: {
  code: string;
  lang: string;
  onCopy: () => void;
  copied: boolean;
}) {
  const lines = code.split("\n");
  return (
    <div className="surface-raised relative overflow-hidden rounded-lg">
      {/* terminal-style header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          </span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {lang}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          aria-label="Copy snippet"
          className="h-7 gap-1.5 px-2 text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <pre className="m-0 px-0 py-3 text-[12px] leading-[1.65]">
          <code>
            {lines.map((line, i) => (
              <span key={i} className="grid grid-cols-[3rem_1fr]">
                <span className="select-none pr-4 text-right font-mono text-[10px] text-muted-foreground/40">
                  {String(i + 1).padStart(2, " ")}
                </span>
                <span>{line || " "}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
