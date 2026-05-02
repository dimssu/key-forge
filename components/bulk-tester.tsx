"use client";

import * as React from "react";
import { Download, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { detectProvider } from "@/lib/providers/_registry";
import { redactKey } from "@/lib/utils";
import { toCsv } from "@/lib/csv";
import { useToast } from "./ui/toaster";

interface Row {
  raw: string;
  redacted: string;
  provider: string;
  status: string;
  httpStatus?: number;
  modelCount?: number;
  latencyMs?: number;
  fix?: string;
}

export function BulkTester() {
  const { toast } = useToast();
  const [text, setText] = React.useState("");
  const [rows, setRows] = React.useState<Row[]>([]);
  const [running, setRunning] = React.useState(false);

  const run = async () => {
    setRunning(true);
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const initial: Row[] = lines.map((l) => {
      const p = detectProvider(l);
      return {
        raw: l,
        redacted: redactKey(l),
        provider: p?.id ?? "unknown",
        status: p ? "queued" : "no-provider",
      };
    });
    setRows(initial);

    const settled = await Promise.all(
      initial.map(async (r): Promise<Row> => {
        if (r.provider === "unknown") return { ...r, status: "no-provider" };
        try {
          const validate = await fetch(`/api/proxy/${r.provider}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-keyforge-key": r.raw },
            body: JSON.stringify({ action: "validate" }),
          });
          const latency = Number(validate.headers.get("x-keyforge-latency-ms")) || undefined;
          if (!validate.ok) {
            const body = await validate.json().catch(() => ({}));
            return { ...r, status: `error-${validate.status}`, fix: body.error, latencyMs: latency };
          }
          const v = (await validate.json()) as { status: string; httpStatus?: number; fix?: string };
          let modelCount: number | undefined;
          if (v.status === "valid") {
            const m = await fetch(`/api/proxy/${r.provider}`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-keyforge-key": r.raw },
              body: JSON.stringify({ action: "models" }),
            });
            if (m.ok) {
              const data = (await m.json()) as { models: unknown[] };
              modelCount = data.models.length;
            }
          }
          return {
            ...r,
            status: v.status,
            httpStatus: v.httpStatus,
            fix: v.fix,
            modelCount,
            latencyMs: latency,
          };
        } catch {
          return { ...r, status: "network-error" };
        }
      })
    );
    setRows(settled);
    setRunning(false);
    toast({ title: "Bulk test complete", description: `${settled.length} key${settled.length === 1 ? "" : "s"} processed.` });
  };

  const exportCsv = () => {
    const csv = toCsv(
      rows.map((r) => ({
        provider: r.provider,
        key: r.redacted,
        status: r.status,
        http_status: r.httpStatus ?? "",
        models: r.modelCount ?? "",
        latency_ms: r.latencyMs ?? "",
        fix: r.fix ?? "",
      })),
      ["provider", "key", "status", "http_status", "models", "latency_ms", "fix"]
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keyforge-bulk-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={"sk-...\nsk-ant-...\nAIza...\n..."}
        rows={8}
        className="font-mono text-xs"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={run} disabled={running || !text.trim()} className="gap-2">
          <Play className="h-3.5 w-3.5" />
          {running ? "Running…" : `Test ${text.split("\n").filter((l) => l.trim()).length} key(s)`}
        </Button>
        <Button variant="outline" onClick={exportCsv} disabled={rows.length === 0} className="gap-2">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Key</th>
                <th className="px-3 py-2 text-left">Provider</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Models</th>
                <th className="px-3 py-2 text-right">Latency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border/60">
                  <td className="px-3 py-2 font-mono text-xs">{r.redacted}</td>
                  <td className="px-3 py-2">{r.provider}</td>
                  <td className="px-3 py-2">
                    <Badge
                      variant={
                        r.status === "valid"
                          ? "success"
                          : r.status.startsWith("error") || r.status === "invalid"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right">{r.modelCount ?? "—"}</td>
                  <td className="px-3 py-2 text-right">{r.latencyMs ? `${r.latencyMs}ms` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
