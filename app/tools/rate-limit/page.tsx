import { Breadcrumbs } from "@/components/breadcrumbs";
import { RateLimitCalculator } from "@/components/rate-limit-calculator";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "LLM rate-limit calculator",
  description:
    "Paste response headers from OpenAI, Anthropic, or Groq. APIKit parses your remaining requests and tokens and projects when the limit resets.",
  path: "/tools/rate-limit",
});

export default function Page() {
  return (
    <article className="space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/tools/rate-limit", label: "Rate-limit calculator" },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Rate-limit calculator</h1>
        <p className="max-w-2xl text-muted-foreground">
          Paste raw response headers from your last LLM API call. We parse the {`x-ratelimit-*`} family
          (OpenAI, OpenAI-compatible, Anthropic) and project remaining quota plus reset time.
        </p>
      </header>
      <RateLimitCalculator />
    </article>
  );
}
