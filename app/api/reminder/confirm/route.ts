import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
  const payload = await verifyToken<{ providerId: string; expiresAt: number }>(token);
  if (!payload) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  return NextResponse.json({
    ok: true,
    providerId: payload.providerId,
    rotateAt: new Date(payload.expiresAt).toISOString(),
  });
}
