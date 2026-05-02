import { ImageResponse } from "next/og";
import { getProviderBySlug } from "@/lib/providers/_registry";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Test any LLM API key in seconds";
  const slug = searchParams.get("provider");
  const provider = slug ? getProviderBySlug(slug) : undefined;
  const sub = provider
    ? `Verify a ${provider.name} key, list models, benchmark latency.`
    : "KeyForge — free, universal LLM API key tester.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b1220 0%, #1a2540 100%)",
          color: "white",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "linear-gradient(135deg, #fff 0%, #aab 100%)",
              color: "#0b1220",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            ⌥
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>KeyForge</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 24, color: "#a3aed0", maxWidth: 980 }}>{sub}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#a3aed0", fontSize: 18 }}>
          <span>keyforge.dimssu.com</span>
          <span>Free · Open source · No signup</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
