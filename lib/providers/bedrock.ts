import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

interface BedrockComposite {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  region?: string; // default us-east-1
}

function parse(key: string): BedrockComposite | null {
  try {
    const obj = JSON.parse(key) as BedrockComposite;
    if (!obj?.accessKeyId || !obj?.secretAccessKey) return null;
    return { region: "us-east-1", ...obj };
  } catch {
    return null;
  }
}

// Minimal SigV4 signing for GET requests (used to call ListFoundationModels).
async function sigv4Get(
  url: URL,
  service: string,
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
  sessionToken: string | undefined,
  signal?: AbortSignal
): Promise<Response> {
  const enc = (s: string) => new TextEncoder().encode(s);
  const sha256Hex = async (data: string | Uint8Array) => {
    const bytes = typeof data === "string" ? enc(data) : data;
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };
  const hmac = async (key: ArrayBuffer | Uint8Array, msg: string) => {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key as BufferSource,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, enc(msg)));
  };

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const host = url.host;
  const canonicalUri = url.pathname || "/";
  const canonicalQuery = url.searchParams.toString();
  const payloadHash = await sha256Hex("");

  const headers: Record<string, string> = {
    host,
    "x-amz-date": amzDate,
    "x-amz-content-sha256": payloadHash,
  };
  if (sessionToken) headers["x-amz-security-token"] = sessionToken;
  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders =
    Object.keys(headers)
      .sort()
      .map((k) => `${k}:${headers[k]}\n`)
      .join("");

  const canonicalRequest = [
    "GET",
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  let kSigning = await hmac(enc("AWS4" + secretAccessKey), dateStamp);
  kSigning = await hmac(kSigning, region);
  kSigning = await hmac(kSigning, service);
  kSigning = await hmac(kSigning, "aws4_request");
  const signature = Array.from(await hmac(kSigning, stringToSign))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return safeFetch(url.toString(), {
    method: "GET",
    headers: { ...headers, Authorization: authorization },
    signal,
  });
}

async function listFoundationModels(c: BedrockComposite, signal?: AbortSignal) {
  const url = new URL(`https://bedrock.${c.region}.amazonaws.com/foundation-models`);
  return sigv4Get(
    url,
    "bedrock",
    c.region!,
    c.accessKeyId,
    c.secretAccessKey,
    c.sessionToken,
    signal
  );
}

const adapter: ProviderAdapter = {
  id: "bedrock",
  name: "AWS Bedrock",
  slug: "bedrock",
  tagline: "Anthropic, Meta, Cohere, Mistral on AWS.",
  keyPattern: /^\{.*"accessKeyId".*"secretAccessKey".*\}$/s,
  keyExample:
    '{"accessKeyId":"AKIA…","secretAccessKey":"…","region":"us-east-1"}',
  docsUrl: "https://docs.aws.amazon.com/bedrock/",
  consoleUrl: "https://console.aws.amazon.com/iam/home#/security_credentials",
  statusPageUrl: "https://health.aws.amazon.com/health/status",
  pricingUrl: "https://aws.amazon.com/bedrock/pricing/",
  categories: ["chat", "embedding", "image"],

  async validateKey(key, opts): Promise<ValidationResult> {
    const c = parse(key);
    if (!c)
      return {
        status: "invalid",
        message: "Credential must be JSON with accessKeyId + secretAccessKey.",
      };
    try {
      const res = await listFoundationModels(c, opts?.signal);
      if (res.ok) return { status: "valid", httpStatus: res.status };
      return {
        status: res.status === 401 || res.status === 403 ? "invalid" : "unknown",
        httpStatus: res.status,
        fix: fixFromStatus(res.status),
      };
    } catch {
      return { status: "network_error", message: "Could not reach AWS Bedrock." };
    }
  },

  async listModels(key, opts): Promise<ModelInfo[]> {
    const c = parse(key);
    if (!c) return [];
    const res = await listFoundationModels(c, opts?.signal);
    if (!res.ok) return [];
    const data = (await res.json()) as {
      modelSummaries?: Array<{
        modelId: string;
        modelName?: string;
        inputModalities?: string[];
        outputModalities?: string[];
      }>;
    };
    return (data.modelSummaries ?? []).map((m) => ({
      id: m.modelId,
      name: m.modelName,
      capabilities: (m.outputModalities ?? []).flatMap<
        NonNullable<ModelInfo["capabilities"]>[number]
      >((mod) => {
        if (mod === "TEXT") return ["chat"];
        if (mod === "IMAGE") return ["image"];
        if (mod === "EMBEDDING") return ["embedding"];
        return [];
      }),
    }));
  },

  async benchmarkLatency(key, samples = 5, opts): Promise<LatencyStats> {
    const c = parse(key);
    if (!c) return { samples: [], p50: 0, p95: 0, p99: 0, mean: 0, min: 0, max: 0 };
    return bench((signal) => listFoundationModels(c, signal), samples, { signal: opts?.signal });
  },

  snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
    const model = exampleModel || "anthropic.claude-3-5-sonnet-20241022-v2:0";
    return {
      curl: `# Bedrock requires SigV4 — use the AWS CLI or SDK instead of raw curl.
aws bedrock-runtime invoke-model \\
  --model-id ${model} \\
  --body '{"messages":[{"role":"user","content":${JSON.stringify(prompt)}}],"max_tokens":256,"anthropic_version":"bedrock-2023-05-31"}' \\
  --region us-east-1 out.json`,
      python: `import boto3, json
client = boto3.client("bedrock-runtime",
    aws_access_key_id="${redactedKey}", region_name="us-east-1")
body = json.dumps({
  "anthropic_version": "bedrock-2023-05-31",
  "max_tokens": 256,
  "messages": [{"role": "user", "content": ${JSON.stringify(prompt)}}],
})
resp = client.invoke_model(modelId="${model}", body=body)
print(resp["body"].read().decode())`,
      nodeFetch: `import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
const client = new BedrockRuntimeClient({ region: "us-east-1",
  credentials: { accessKeyId: "${redactedKey}", secretAccessKey: "…" } });
const cmd = new InvokeModelCommand({
  modelId: "${model}",
  body: JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 256,
    messages: [{ role: "user", content: ${JSON.stringify(prompt)} }],
  }),
});
const out = await client.send(cmd);
console.log(new TextDecoder().decode(out.body));`,
      jsAxios: `// Bedrock SDK is preferred over axios because of SigV4. See nodeFetch above.`,
    };
  },
};

export default adapter;
