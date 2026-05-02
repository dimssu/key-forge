import { Breadcrumbs } from "@/components/breadcrumbs";
import { Playground } from "@/components/playground";
import { PrivacyBanner } from "@/components/privacy-banner";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "LLM playground — send a real prompt",
  description:
    "Test your LLM API key with a real prompt. Streams the response from any of 17 providers. No signup, no logging.",
  path: "/playground",
});

export default function PlaygroundPage() {
  return (
    <article className="space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/playground", label: "Playground" },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
        <p className="max-w-2xl text-muted-foreground">
          Send a real prompt and watch the response stream. Pick any of the 17 supported providers — the proxy
          forwards your request and streams chunks back token-by-token.
        </p>
      </header>
      <PrivacyBanner />
      <Playground />
    </article>
  );
}
