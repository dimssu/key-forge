"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { providers } from "@/lib/providers/_registry";
import { KeyInput } from "./key-input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

export function Playground() {
  const [providerId, setProviderId] = React.useState<string>(providers[0]!.id);
  const [key, setKey] = React.useState("");
  const [prompt, setPrompt] = React.useState("Say hello in one short sentence.");
  const [model, setModel] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [running, setRunning] = React.useState(false);

  const send = async () => {
    if (!key) return;
    setRunning(true);
    setOutput("");
    try {
      const res = await fetch(`/api/proxy/${providerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-keyforge-key": key },
        body: JSON.stringify({ action: "stream", prompt, model: model || undefined }),
      });
      if (!res.ok || !res.body) {
        setOutput(`Error: HTTP ${res.status}`);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setOutput((s) => s + dec.decode(value, { stream: true }));
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Provider</span>
          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Model (optional)</span>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="leave blank for default"
            className="font-mono text-xs"
          />
        </label>
      </div>
      <KeyInput initialProviderId={providerId} onSubmit={(k) => setKey(k)} />
      <label className="space-y-1 text-sm">
        <span className="font-medium">Prompt</span>
        <Textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="text-sm"
        />
      </label>
      <Button onClick={send} disabled={!key || !prompt || running} className="gap-2">
        <Send className="h-3.5 w-3.5" /> {running ? "Streaming…" : "Send"}
      </Button>
      <div className="min-h-32 rounded-lg border border-border/60 bg-secondary/30 p-4 text-sm">
        {output ? <pre className="whitespace-pre-wrap break-words text-sm">{output}</pre> : <span className="text-muted-foreground">Output will appear here.</span>}
      </div>
    </div>
  );
}
