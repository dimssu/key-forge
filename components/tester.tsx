"use client";

import * as React from "react";
import { Activity, Share2 } from "lucide-react";
import { KeyInput } from "./key-input";
import { ResultsPanel, type ResultData } from "./results-panel";
import { SnippetTabs } from "./snippet-tabs";
import { Button } from "./ui/button";
import { useToast } from "./ui/toaster";
import type { ProviderAdapter } from "@/lib/providers/_types";
import { redactKey } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface TesterProps {
  provider: Pick<
    ProviderAdapter,
    "id" | "name" | "slug" | "keyExample" | "consoleUrl" | "docsUrl" | "hostBased" | "categories"
  >;
}

export function Tester({ provider }: TesterProps) {
  const { toast } = useToast();
  const [running, setRunning] = React.useState(false);
  const [benching, setBenching] = React.useState(false);
  const [data, setData] = React.useState<ResultData | null>(null);
  const [key, setKey] = React.useState("");

  const proxy = React.useCallback(
    async (action: "validate" | "models" | "bench" | "quota", k: string, samples?: number) => {
      const res = await fetch(`/api/proxy/${provider.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-keyforge-key": k },
        body: JSON.stringify({ action, samples }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      return res.json();
    },
    [provider.id]
  );

  const run = async (k: string) => {
    setKey(k);
    setRunning(true);
    setData({});
    try {
      const v = await proxy("validate", k);
      let models;
      if (v.status === "valid") {
        models = await proxy("models", k);
      }
      setData({
        validation: v,
        models: models?.models ?? [],
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast({ title: "Test failed", description: msg, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const runBench = async () => {
    if (!key) return;
    setBenching(true);
    try {
      const r = await proxy("bench", key, 5);
      setData((d) => ({ ...(d ?? {}), benchLatency: r.stats }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast({ title: "Benchmark failed", description: msg, variant: "destructive" });
    } finally {
      setBenching(false);
    }
  };

  const share = async () => {
    if (!key || !data) return;
    const res = await fetch(`/api/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: provider.id,
        key,
        status: data.validation?.status ?? "unknown",
        models: data.models ?? [],
        latency: data.benchLatency ?? null,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast({
        title: "Share unavailable",
        description: body.error ?? "Set KEYFORGE_SIGNING_SECRET to enable sharing.",
        variant: "destructive",
      });
      return;
    }
    const { url } = (await res.json()) as { url: string };
    await navigator.clipboard.writeText(url).catch(() => undefined);
    toast({ title: "Share link copied", description: "Redacted result URL on clipboard." });
  };

  const sample = `Hello — what's the cheapest model you currently expose?`;
  const exampleModel = data?.models?.[0]?.id ?? "";

  const adapter = React.useMemo(() => {
    return import("@/lib/providers/_registry").then((m) =>
      m.providers.find((p) => p.id === provider.id)
    );
  }, [provider.id]);

  const [snippet, setSnippet] = React.useState<ReturnType<ProviderAdapter["snippets"]> | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    void adapter.then((a) => {
      if (!a || cancelled) return;
      setSnippet(
        a.snippets({
          redactedKey: key ? redactKey(key) : a.keyExample.replace(/[•]/g, "X"),
          exampleModel,
          prompt: sample,
        })
      );
    });
    return () => {
      cancelled = true;
    };
  }, [adapter, key, exampleModel]);

  return (
    <div className="space-y-6">
      <KeyInput initialProviderId={provider.id} onSubmit={(k) => run(k)} />

      {running && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {data?.validation && (
        <>
          <ResultsPanel data={data} providerName={provider.name} />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={runBench} disabled={benching}>
              <Activity className="mr-1.5 h-3.5 w-3.5" />
              {benching ? "Running 5 pings…" : "Run latency benchmark"}
            </Button>
            <Button variant="outline" size="sm" onClick={share} disabled={!data.validation}>
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              Share redacted result
            </Button>
          </div>
        </>
      )}

      {snippet && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium">Ready-to-paste snippets</h2>
          <SnippetTabs snippet={snippet} />
        </section>
      )}
    </div>
  );
}
