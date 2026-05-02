import { NextResponse } from "next/server";
import { getStatuses } from "@/lib/status-pages";

export const runtime = "nodejs";
export const revalidate = 300; // 5 min cache

export async function GET() {
  const data = await getStatuses();
  return NextResponse.json({ providers: data, generatedAt: new Date().toISOString() });
}
