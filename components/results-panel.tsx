"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronRight, X, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { Sparkline } from "./sparkline";
import { formatMs } from "@/lib/utils";
import type { LatencyStats, ModelInfo, ValidationResult } from "@/lib/providers/_types";

export interface ResultData {
  validation?: ValidationResult;
  models?: ModelInfo[];
  latency?: LatencyStats;
  benchLatency?: LatencyStats;
  raw?: unknown;
}

export function ResultsPanel({
  data,
  providerName,
}: {
  data: ResultData | null;
  providerName: string;
}) {
  const [showRaw, setShowRaw] = React.useState(false);
  if (!data) return null;
  const v = data.validation;
  const ok = v?.status === "valid";
  const statusLabel = ok ? "key is valid" : v?.status?.replace(/_/g, " ") ?? "unknown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="surface-raised overflow-hidden rounded-xl"
    >
      {/* status header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-card/40 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <StatusBadge ok={ok} />
          <div className="space-y-0.5">
            <p className="text-sm font-medium leading-none">
              {providerName}
              <span className="text-muted-foreground"> — </span>
              <span className={ok ? "text-success" : "text-destructive"}>{statusLabel}</span>
            </p>
            <p className="font-mono text-[0.7rem] text-muted-foreground">
              {data.models?.length ?? 0} models &middot; HTTP {v?.httpStatus ?? "—"}
            </p>
          </div>
        </div>
        {data.benchLatency ? (
          <div className="flex items-center gap-2">
            <Sparkline values={data.benchLatency.samples} width={72} height={24} />
            <Badge variant="outline" className="gap-1 border-border/60 font-mono text-[10px]">
              <Zap className="h-3 w-3 text-brand" />
              {formatMs(data.benchLatency.p50)} p50
            </Badge>
          </div>
        ) : data.latency ? (
          <Badge variant="outline" className="gap-1 border-border/60 font-mono text-[10px]">
            <Zap className="h-3 w-3 text-brand" />
            {formatMs(data.latency.mean)} mean
          </Badge>
        ) : null}
      </div>

      <div className="space-y-5 p-5">
        {!ok && v?.fix && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/[0.06] px-3 py-2 text-sm"
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-destructive">
              Fix
            </span>
            <span className="text-muted-foreground">{v.fix}</span>
          </motion.div>
        )}

        {data.benchLatency && <BenchPanel stats={data.benchLatency} />}

        {data.models && data.models.length > 0 && (
          <section className="space-y-2.5">
            <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Accessible models
            </h3>
            <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {data.models.slice(0, 60).map((m, i) => (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.01, 0.2) }}
                  className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2.5 py-1.5"
                  title={m.id}
                >
                  <span className="truncate font-mono text-[0.72rem] text-foreground/85">
                    {m.id}
                  </span>
                  {m.capabilities && m.capabilities.length > 0 && (
                    <span className="ml-auto flex shrink-0 items-center gap-1">
                      {m.capabilities.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                        >
                          {capLabel(c)}
                        </span>
                      ))}
                    </span>
                  )}
                </motion.li>
              ))}
            </ul>
            {data.models.length > 60 && (
              <p className="text-xs text-muted-foreground">
                + {data.models.length - 60} more &middot; expand the raw JSON below for the full
                list.
              </p>
            )}
          </section>
        )}

        {data.raw !== undefined && (
          <details
            className="text-xs"
            onToggle={(e) => setShowRaw((e.target as HTMLDetailsElement).open)}
          >
            <summary className="flex cursor-pointer select-none items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
              {showRaw ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Raw JSON
            </summary>
            <pre className="mt-2 border border-border/60 bg-background p-3">
              <code>{JSON.stringify(data.raw, null, 2)}</code>
            </pre>
          </details>
        )}
      </div>
    </motion.div>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={
        "relative grid h-9 w-9 place-items-center rounded-md border " +
        (ok
          ? "border-success/30 bg-success/[0.08] text-success"
          : "border-destructive/30 bg-destructive/[0.08] text-destructive")
      }
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={ok ? "ok" : "no"}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.18 }}
        >
          {ok ? <Check className="h-4.5 w-4.5" strokeWidth={2.5} /> : <X className="h-4.5 w-4.5" strokeWidth={2.5} />}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function BenchPanel({ stats }: { stats: NonNullable<ResultData["benchLatency"]> }) {
  return (
    <section className="surface-raised rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Latency · {stats.samples.length} pings
        </h3>
        <Sparkline values={stats.samples} width={120} height={28} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Stat label="p50" value={formatMs(stats.p50)} />
        <Stat label="p95" value={formatMs(stats.p95)} />
        <Stat label="p99" value={formatMs(stats.p99)} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-base font-medium tabular-nums">{value}</div>
    </div>
  );
}

function capLabel(c: string): string {
  switch (c) {
    case "embedding": return "emb";
    case "vision": return "vis";
    case "audio": return "aud";
    case "image": return "img";
    case "tool-use": return "tool";
    default: return c.slice(0, 4);
  }
}
