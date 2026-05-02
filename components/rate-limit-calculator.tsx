"use client";

import * as React from "react";
import { parseRateLimitHeaders, type ParsedRateLimit } from "@/lib/rate-limit-headers";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const PLACEHOLDER = `paste headers, one per line, e.g.

x-ratelimit-limit-requests: 5000
x-ratelimit-remaining-requests: 4998
x-ratelimit-reset-requests: 12s
x-ratelimit-limit-tokens: 200000
x-ratelimit-remaining-tokens: 198432
x-ratelimit-reset-tokens: 6m0s`;

export function RateLimitCalculator() {
  const [text, setText] = React.useState("");
  const parsed: ParsedRateLimit = React.useMemo(() => {
    if (!text.trim()) return { provider: "unknown", raw: {} };
    const map: Record<string, string> = {};
    for (const line of text.split("\n")) {
      const m = /^([^:]+):\s*(.+)$/.exec(line.trim());
      if (m) map[m[1]!.toLowerCase()] = m[2]!;
    }
    return parseRateLimitHeaders(map);
  }, [text]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={12}
        className="font-mono text-xs"
      />
      <div className="space-y-3">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base">Detected: {parsed.provider}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 text-sm">
            <Row title="Requests" data={parsed.requests} />
            <Row title="Tokens" data={parsed.tokens} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({
  title,
  data,
}: {
  title: string;
  data?: { limit?: number; remaining?: number; reset?: string };
}) {
  if (!data || (data.limit == null && data.remaining == null)) {
    return (
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</h3>
        <p className="text-muted-foreground">No headers detected.</p>
      </div>
    );
  }
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</h3>
      <dl className="mt-1 grid grid-cols-3 gap-2 font-mono">
        <Stat label="limit" value={data.limit ?? "—"} />
        <Stat label="remaining" value={data.remaining ?? "—"} />
        <Stat label="reset" value={data.reset ?? "—"} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-border/60 bg-secondary/30 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{String(value)}</div>
    </div>
  );
}
