import { BulkTester } from "@/components/bulk-tester";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PrivacyBanner } from "@/components/privacy-banner";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "Bulk LLM API key tester",
  description:
    "Paste many LLM API keys at once. KeyForge detects each provider, validates every key, and exports the results to CSV.",
  path: "/bulk",
});

export default function BulkPage() {
  return (
    <article className="space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/bulk", label: "Bulk tester" },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Bulk key tester</h1>
        <p className="max-w-2xl text-muted-foreground">
          Paste one key per line. We auto-detect each provider, validate each key in parallel, and export the results to CSV.
        </p>
      </header>
      <PrivacyBanner />
      <BulkTester />
    </article>
  );
}
