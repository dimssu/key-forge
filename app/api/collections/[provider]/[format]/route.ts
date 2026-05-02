import { NextResponse } from "next/server";
import { getProvider } from "@/lib/providers/_registry";
import { postmanCollection } from "@/lib/collections/postman";
import { insomniaExport } from "@/lib/collections/insomnia";
import { brunoExport } from "@/lib/collections/bruno";

export const runtime = "nodejs";

export function GET(
  _req: Request,
  ctx: { params: { provider: string; format: string } }
) {
  const adapter = getProvider(ctx.params.provider);
  if (!adapter) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });

  let body: unknown;
  switch (ctx.params.format) {
    case "postman":
      body = postmanCollection(adapter);
      break;
    case "insomnia":
      body = insomniaExport(adapter);
      break;
    case "bruno":
      body = brunoExport(adapter);
      break;
    default:
      return NextResponse.json({ error: "Unknown format" }, { status: 404 });
  }
  return new NextResponse(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${adapter.slug}-${ctx.params.format}.json"`,
    },
  });
}
