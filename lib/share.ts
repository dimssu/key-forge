import { signToken, verifyToken } from "./jwt";
import { lastFour } from "./providers/_helpers";
import type { LatencyStats, ModelInfo } from "./providers/_types";

export interface SharePayload {
  providerId: string;
  /** Last 4 chars only — never the full key. */
  keyTail: string;
  status: string;
  models: Pick<ModelInfo, "id" | "capabilities">[];
  latency?: Pick<LatencyStats, "p50" | "p95" | "p99" | "mean">;
  testedAt: string;
}

export async function makeShareToken(args: {
  key: string;
  providerId: string;
  status: string;
  models: ModelInfo[];
  latency?: LatencyStats;
}): Promise<string | null> {
  const payload: SharePayload = {
    providerId: args.providerId,
    keyTail: lastFour(args.key),
    status: args.status,
    models: args.models.slice(0, 50).map((m) => ({ id: m.id, capabilities: m.capabilities })),
    latency: args.latency
      ? { p50: args.latency.p50, p95: args.latency.p95, p99: args.latency.p99, mean: args.latency.mean }
      : undefined,
    testedAt: new Date().toISOString(),
  };
  return signToken({ ...payload }, "30d");
}

export async function readShareToken(token: string): Promise<SharePayload | null> {
  const decoded = await verifyToken<SharePayload & Record<string, unknown>>(token);
  if (!decoded) return null;
  if (typeof decoded.providerId !== "string") return null;
  return decoded;
}
