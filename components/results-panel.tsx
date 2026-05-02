"use client";

import * as React from "react";
import { CheckCircle2, ChevronDown, ChevronRight, XCircle, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatMs } from "@/lib/utils";
import type { LatencyStats, ModelInfo, ValidationResult } from "@/lib/providers/_types";

export interface ResultData {
  validation?: ValidationResult;
  models?: ModelInfo[];
  latency?: LatencyStats;
  benchLatency?: LatencyStats;
  raw?: unknown;
}

export function ResultsPanel({ data, providerName }: { data: ResultData | null; providerName: string }) {
  const [showRaw, setShowRaw] = React.useState(false);
  if (!data) return null;
  const v = data.validation;
  const ok = v?.status === "valid";
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {ok ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span>{providerName}: {ok ? "key is valid" : v?.status?.replace(/_/g, " ") ?? "unknown"}</span>
          </CardTitle>
          {data.latency && (
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" /> {formatMs(data.latency.mean)} mean
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!ok && v?.fix && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
            <strong className="font-medium">Fix:</strong> {v.fix}
          </div>
        )}
        {data.models && data.models.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-medium">
              {data.models.length} model{data.models.length === 1 ? "" : "s"} accessible
            </h3>
            <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {data.models.slice(0, 60).map((m) => (
                <li
                  key={m.id}
                  className="truncate rounded border border-border/60 bg-secondary/40 px-2 py-1 font-mono text-xs"
                  title={m.id}
                >
                  {m.id}
                </li>
              ))}
            </ul>
            {data.models.length > 60 && (
              <p className="mt-2 text-xs text-muted-foreground">
                + {data.models.length - 60} more.
              </p>
            )}
          </section>
        )}
        {data.benchLatency && (
          <section className="rounded border border-border/60 bg-secondary/30 p-3 text-sm">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Latency benchmark ({data.benchLatency.samples.length} pings)
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-sm">
              <Stat label="p50" value={formatMs(data.benchLatency.p50)} />
              <Stat label="p95" value={formatMs(data.benchLatency.p95)} />
              <Stat label="p99" value={formatMs(data.benchLatency.p99)} />
            </div>
          </section>
        )}
        {data.raw !== undefined && (
          <details className="text-xs" onToggle={(e) => setShowRaw((e.target as HTMLDetailsElement).open)}>
            <summary className="flex cursor-pointer select-none items-center gap-1 text-muted-foreground hover:text-foreground">
              {showRaw ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Raw JSON
            </summary>
            <pre className="mt-2">
              <code>{JSON.stringify(data.raw, null, 2)}</code>
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
