"use client";

import * as React from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { verifyAnthropic, verifyOpenAI } from "@/lib/webhooks";

export function WebhookValidator() {
  const [provider, setProvider] = React.useState<"openai" | "anthropic">("openai");
  const [body, setBody] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [sig, setSig] = React.useState("");
  const [ts, setTs] = React.useState("");
  const [out, setOut] = React.useState<{ valid: boolean; reason?: string } | null>(null);

  const run = async () => {
    if (provider === "openai") {
      setOut(await verifyOpenAI({ body, secret, signatureHeader: sig }));
    } else {
      setOut(
        await verifyAnthropic({
          body,
          secret,
          signatureHeader: sig,
          timestampHeader: ts,
        })
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["openai", "anthropic"] as const).map((p) => (
          <Button
            key={p}
            variant={p === provider ? "default" : "outline"}
            size="sm"
            onClick={() => setProvider(p)}
          >
            {p === "openai" ? "OpenAI" : "Anthropic"}
          </Button>
        ))}
      </div>
      <label className="block space-y-1 text-sm">
        <span className="font-medium">Webhook secret</span>
        <Input
          type="password"
          autoComplete="off"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="font-mono"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium">Signature header</span>
        <Input
          value={sig}
          onChange={(e) => setSig(e.target.value)}
          placeholder={provider === "openai" ? "t=1700000000,v1=…base64…" : "v1=…hex…"}
          className="font-mono"
        />
      </label>
      {provider === "anthropic" && (
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Timestamp header (anthropic-timestamp)</span>
          <Input value={ts} onChange={(e) => setTs(e.target.value)} className="font-mono" />
        </label>
      )}
      <label className="block space-y-1 text-sm">
        <span className="font-medium">Raw request body</span>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="font-mono text-xs"
        />
      </label>
      <Button onClick={run} disabled={!body || !secret || !sig}>
        Validate
      </Button>
      {out && (
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 ${out.valid ? "border-success/50 bg-success/10" : "border-destructive/50 bg-destructive/10"}`}
        >
          {out.valid ? (
            <ShieldCheck className="mt-0.5 h-5 w-5 text-success" />
          ) : (
            <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
          )}
          <div className="text-sm">
            <strong className="block">{out.valid ? "Signature is valid" : "Signature is invalid"}</strong>
            {!out.valid && out.reason && <span className="text-muted-foreground">{out.reason}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
