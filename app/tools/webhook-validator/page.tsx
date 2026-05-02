import { Breadcrumbs } from "@/components/breadcrumbs";
import { WebhookValidator } from "@/components/webhook-validator";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "OpenAI / Anthropic webhook signature validator",
  description:
    "Paste a webhook signature header, the raw body, and the secret. KeyForge validates the HMAC against the timestamp window.",
  path: "/tools/webhook-validator",
});

export default function Page() {
  return (
    <article className="space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/tools/webhook-validator", label: "Webhook validator" },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Webhook signature validator</h1>
        <p className="max-w-2xl text-muted-foreground">
          Verify a webhook signature locally — runs entirely in your browser. We do not send the body or the
          secret to our server.
        </p>
      </header>
      <WebhookValidator />
    </article>
  );
}
