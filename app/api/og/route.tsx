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
    ? "Validate the key, list accessible models, benchmark latency."
    : "Validate keys for OpenAI, Anthropic, Gemini, Groq + 13 more providers.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08080a",
          backgroundImage:
            "linear-gradient(135deg, #08080a 0%, #0d1320 60%, #0a1a2a 100%)",
          color: "white",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                backgroundColor: "#3ec9ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                fontWeight: 600,
                letterSpacing: "-0.4px",
              }}
            >
              <span style={{ color: "#ffffff" }}>key</span>
              <span style={{ color: "#3ec9ff" }}>/</span>
              <span style={{ color: "#ffffff" }}>forge</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              borderRadius: "999px",
              backgroundColor: "rgba(62, 201, 255, 0.15)",
              color: "#7fdbff",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            LLM API key tester
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1,
              maxWidth: "1000px",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              color: "#a3aed0",
              maxWidth: "1000px",
              lineHeight: 1.3,
            }}
          >
            {sub}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#7d8aab",
            fontSize: "18px",
          }}
        >
          <div style={{ display: "flex", gap: "18px" }}>
            <span>OpenAI</span>
            <span>·</span>
            <span>Anthropic</span>
            <span>·</span>
            <span>Gemini</span>
            <span>·</span>
            <span>Groq</span>
            <span>·</span>
            <span>+13 more</span>
          </div>
          <span>keyforge.dimssu.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
