import { NextResponse } from "next/server";
import { z } from "zod";
import { isSigningEnabled } from "@/lib/jwt";
import { makeShareToken } from "@/lib/share";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  providerId: z.string().min(1).max(50),
  key: z.string().min(1).max(2000),
  status: z.string().min(1).max(40),
  models: z
    .array(
      z.object({
        id: z.string().max(200),
        capabilities: z.array(z.string()).optional(),
      })
    )
    .max(200)
    .default([]),
  latency: z
    .object({
      samples: z.array(z.number()).optional(),
      p50: z.number(),
      p95: z.number(),
      p99: z.number(),
      mean: z.number(),
      min: z.number(),
      max: z.number(),
    })
    .nullable()
    .optional(),
});

export async function POST(req: Request) {
  if (!isSigningEnabled()) {
    return NextResponse.json(
      { error: "Sharing is disabled. Set APIKIT_SIGNING_SECRET to enable." },
      { status: 503 }
    );
  }
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const token = await makeShareToken({
    key: body.key,
    providerId: body.providerId,
    status: body.status,
    models: body.models.map((m) => ({ id: m.id, capabilities: undefined })),
    latency: body.latency
      ? { ...body.latency, samples: body.latency.samples ?? [] }
      : undefined,
  });
  if (!token) {
    return NextResponse.json({ error: "Sign failed" }, { status: 500 });
  }
  return NextResponse.json({ url: siteUrl(`/share/${token}`) });
}
