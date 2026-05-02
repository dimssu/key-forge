import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatuses, type StatusValue } from "@/lib/status-pages";
import { buildMetadata } from "@/lib/seo/meta";

export const revalidate = 300;
export const metadata = buildMetadata({
  title: "LLM provider status — is your provider down?",
  description:
    "Live status for OpenAI, Anthropic, Gemini, Groq, and 13 more LLM providers. Pulled from each provider's public status page.",
  path: "/tools/status",
});

const colour: Record<StatusValue, "success" | "warning" | "destructive" | "secondary"> = {
  operational: "success",
  degraded: "warning",
  down: "destructive",
  unknown: "secondary",
};

export default async function StatusPage() {
  const statuses = await getStatuses();
  return (
    <article className="space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/tools/status", label: "Provider status" },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Is your LLM provider down?</h1>
        <p className="max-w-2xl text-muted-foreground">
          Cached for 5 minutes. Each row pulls the public statuspage.io feed for that provider.
          &quot;Unknown&quot; means the provider doesn&apos;t expose a machine-readable status feed.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {statuses.map((s) => (
          <li key={s.id}>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{s.name}</span>
                  <Badge variant={colour[s.status]}>{s.status}</Badge>
                </CardTitle>
              </CardHeader>
              {s.url && (
                <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                  >
                    {s.url}
                  </a>
                </CardContent>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </article>
  );
}
