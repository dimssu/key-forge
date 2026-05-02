"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import type { ProviderSnippet } from "@/lib/providers/_types";

export function SnippetTabs({ snippet }: { snippet: ProviderSnippet }) {
  const [tab, setTab] = React.useState<keyof ProviderSnippet>("curl");
  const [copied, setCopied] = React.useState(false);
  const code = snippet[tab];

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
    <Tabs value={tab} onValueChange={(v) => setTab(v as keyof ProviderSnippet)} className="space-y-2">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="curl">cURL</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="nodeFetch">Node fetch</TabsTrigger>
          <TabsTrigger value="jsAxios">axios</TabsTrigger>
        </TabsList>
        <Button variant="ghost" size="sm" onClick={copy} aria-label="Copy snippet">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      {(["curl", "python", "nodeFetch", "jsAxios"] as const).map((k) => (
        <TabsContent key={k} value={k}>
          <pre className="text-xs">
            <code>{snippet[k]}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  );
}
