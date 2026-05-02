import { ImageResponse } from "next/og";
import { getProviderBySlug } from "@/lib/providers/_registry";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "LLM API Key Tester";
  const slug = searchParams.get("provider");
  const provider = slug ? getProviderBySlug(slug) : undefined;

  const headline = provider ? `Test your ${provider.name} API key` : title;
  const sub = provider
    ? `Validate the key, list accessible models, benchmark latency.`
    : "Validate keys for OpenAI, Anthropic, Gemini, Groq, and 13 more providers.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #08080a 0%, #0d1320 60%, #0a1a2a 100%)",
          color: "white",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui",
        }}
      >
        {/* top: brand row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3ec9ff 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#08080a",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              ⌥
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.4 }}>
              <span style={{ color: "#fff" }}>key</span>
              <span style={{ color: "#3ec9ff" }}>/</span>
              <span style={{ color: "#fff" }}>forge</span>
            </div>
          </div>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(62, 201, 255, 0.15)",
              color: "#7fdbff",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "ui-monospace",
            }}
          >
            LLM API key tester
          </div>
        </div>

        {/* middle: huge headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1,
              maxWidth: 1000,
            }}
          >
            {headline}
          </div>
          <div style={{ fontSize: 26, color: "#a3aed0", maxWidth: 1000, lineHeight: 1.3 }}>
            {sub}
          </div>
        </div>

        {/* bottom: provider strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#7d8aab",
            fontSize: 18,
          }}
        >
          <div style={{ display: "flex", gap: 18, fontFamily: "ui-monospace" }}>
            <span>OpenAI</span>
            <span>·</span>
            <span>Anthropic</span>
            <span>·</span>
            <span>Gemini</span>
            <span>·</span>
            <span>Groq</span>
            <span>·</span>
            <span>Mistral</span>
            <span>·</span>
            <span>+12</span>
          </div>
          <span>keyforge.dimssu.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
