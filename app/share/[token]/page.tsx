import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { readShareToken } from "@/lib/share";
import { getProvider } from "@/lib/providers/_registry";
import { formatMs } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/meta";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Shared key test result",
  description: "Redacted KeyForge test result. The full key is never included in share links.",
});

export default async function SharePage({ params }: { params: { token: string } }) {
  const payload = await readShareToken(params.token);
  if (!payload) notFound();
  const provider = getProvider(payload.providerId);
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Shared test result</h1>
        <p className="text-sm text-muted-foreground">
          Tested {new Date(payload.testedAt).toLocaleString()}.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {provider?.name ?? payload.providerId}
            <Badge variant="secondary">key ending …{payload.keyTail}</Badge>
            <Badge variant={payload.status === "valid" ? "success" : "destructive"}>
              {payload.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {payload.latency && (
            <div className="grid grid-cols-3 gap-2 text-sm font-mono">
              <Stat label="p50" value={formatMs(payload.latency.p50)} />
              <Stat label="p95" value={formatMs(payload.latency.p95)} />
              <Stat label="p99" value={formatMs(payload.latency.p99)} />
            </div>
          )}
          {payload.models.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium">{payload.models.length} models</h2>
              <ul className="grid gap-1 sm:grid-cols-2">
                {payload.models.map((m) => (
                  <li
                    key={m.id}
                    className="truncate rounded border border-border/60 bg-secondary/40 px-2 py-1 font-mono text-xs"
                    title={m.id}
                  >
                    {m.id}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {provider && (
            <Link
              href={`/test/${provider.slug}-api-key`}
              className="inline-flex text-sm underline decoration-dotted underline-offset-4 hover:text-foreground"
            >
              Test your own {provider.name} key →
            </Link>
          )}
        </CardContent>
      </Card>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border/60 bg-secondary/30 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
