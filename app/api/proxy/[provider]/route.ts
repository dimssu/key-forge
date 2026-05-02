import { NextResponse } from "next/server";
import { z } from "zod";
import { getProvider } from "@/lib/providers/_registry";
import { check, ipFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Action = z.enum(["validate", "models", "quota", "stream", "bench"]);

const Body = z.object({
  action: Action,
  prompt: z.string().max(2000).optional(),
  model: z.string().max(200).optional(),
  samples: z.number().int().min(1).max(10).optional(),
});

/**
 * Stateless proxy for provider adapter calls.
 *
 * The API key MUST arrive in the `x-keyforge-key` header. It is read once,
 * passed straight to the adapter, and discarded. We never persist, log, or
 * echo it back. Errors return generic messages — never the auth header or
 * request body.
 */
export async function POST(req: Request, ctx: { params: { provider: string } }) {
  const ip = ipFromRequest(req);
  const limit = check(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfterMs: limit.resetMs },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  const adapter = getProvider(ctx.params.provider);
  if (!adapter) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  const key = req.headers.get("x-keyforge-key");
  if (!key && !adapter.hostBased) {
    return NextResponse.json({ error: "Missing x-keyforge-key header" }, { status: 400 });
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const start = performance.now();
  try {
    switch (parsed.action) {
      case "validate": {
        const result = await adapter.validateKey(key ?? "");
        return jsonWithLatency(result, start);
      }
      case "models": {
        const models = await adapter.listModels(key ?? "");
        return jsonWithLatency({ models }, start);
      }
      case "quota": {
        if (!adapter.fetchQuota) {
          return NextResponse.json(
            { error: "Provider does not expose quota" },
            { status: 501 }
          );
        }
        const quota = await adapter.fetchQuota(key ?? "");
        return jsonWithLatency({ quota }, start);
      }
      case "bench": {
        const stats = await adapter.benchmarkLatency(key ?? "", parsed.samples ?? 5);
        return jsonWithLatency({ stats }, start);
      }
      case "stream": {
        if (!adapter.streamTest) {
          return NextResponse.json({ error: "Provider does not support streaming" }, { status: 501 });
        }
        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            try {
              for await (const chunk of adapter.streamTest!(key ?? "", parsed.prompt ?? "Hello", {
                model: parsed.model,
              })) {
                controller.enqueue(encoder.encode(chunk));
              }
            } catch {
              controller.enqueue(encoder.encode("\n[error: upstream failed]"));
            } finally {
              controller.close();
            }
          },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "x-keyforge-latency-ms": String(Math.round(performance.now() - start)),
          },
        });
      }
    }
  } catch {
    return NextResponse.json({ error: "Upstream call failed" }, { status: 502 });
  }
}

function jsonWithLatency<T>(body: T, start: number): Response {
  const ms = Math.round(performance.now() - start);
  return NextResponse.json(body, {
    headers: {
      "x-keyforge-latency-ms": String(ms),
      "Cache-Control": "no-store",
    },
  });
}
