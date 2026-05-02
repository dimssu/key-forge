import { providers } from "./providers/_registry";
import { safeFetch } from "./providers/_helpers";

export type StatusValue = "operational" | "degraded" | "down" | "unknown";

export interface ProviderStatus {
  id: string;
  name: string;
  status: StatusValue;
  url?: string;
  checkedAt: string;
}

/**
 * Best-effort status check. We only follow the public statuspage.io / similar
 * `summary.json` endpoints that are CORS-friendly; otherwise we return "unknown".
 */
export async function getStatuses(): Promise<ProviderStatus[]> {
  const now = new Date().toISOString();
  const results = await Promise.all(
    providers.map(async (p): Promise<ProviderStatus> => {
      const base: ProviderStatus = {
        id: p.id,
        name: p.name,
        status: "unknown",
        url: p.statusPageUrl,
        checkedAt: now,
      };
      if (!p.statusPageUrl) return base;
      try {
        const url = p.statusPageUrl.replace(/\/+$/, "") + "/api/v2/status.json";
        const res = await safeFetch(url, { timeoutMs: 4000 });
        if (!res.ok) return base;
        const json = (await res.json()) as { status?: { indicator?: string } };
        const ind = json.status?.indicator;
        const map: Record<string, StatusValue> = {
          none: "operational",
          minor: "degraded",
          major: "down",
          critical: "down",
        };
        return { ...base, status: map[ind ?? "none"] ?? "unknown" };
      } catch {
        return base;
      }
    })
  );
  return results;
}
