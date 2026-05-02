/**
 * Verify webhook signatures for OpenAI and Anthropic.
 * Pure functions — no network. Inputs are payload + headers + secret;
 * outputs are { valid: boolean; reason?: string }.
 */
async function hmacHex(secret: string, body: string, alg: "SHA-256" = "SHA-256"): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: alg },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/**
 * Verify Anthropic webhook signature: header "anthropic-signature" of the form
 * "v1=<hex>". Signature is HMAC-SHA256 over `${timestamp}.${body}`.
 */
export async function verifyAnthropic(args: {
  body: string;
  signatureHeader: string;
  timestampHeader: string;
  secret: string;
  toleranceSeconds?: number;
}): Promise<{ valid: boolean; reason?: string }> {
  const tol = args.toleranceSeconds ?? 300;
  const ts = Number(args.timestampHeader);
  if (!Number.isFinite(ts)) return { valid: false, reason: "Missing or invalid timestamp." };
  if (Math.abs(Date.now() / 1000 - ts) > tol)
    return { valid: false, reason: "Timestamp outside tolerance window." };
  const expected = await hmacHex(args.secret, `${args.timestampHeader}.${args.body}`);
  const provided = args.signatureHeader.replace(/^v1=/, "");
  return timingSafeEqual(expected, provided)
    ? { valid: true }
    : { valid: false, reason: "Signature mismatch." };
}

/**
 * Verify OpenAI webhook signature: header "openai-signature" of the form
 * "t=<unix>,v1=<base64>". Signature is HMAC-SHA256 over `${t}.${body}`,
 * encoded base64.
 */
export async function verifyOpenAI(args: {
  body: string;
  signatureHeader: string;
  secret: string;
  toleranceSeconds?: number;
}): Promise<{ valid: boolean; reason?: string }> {
  const tol = args.toleranceSeconds ?? 300;
  const parts = Object.fromEntries(
    args.signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k?.trim() ?? "", v?.trim() ?? ""];
    })
  );
  const t = Number(parts["t"]);
  const provided = parts["v1"];
  if (!Number.isFinite(t)) return { valid: false, reason: "Missing or invalid t value." };
  if (!provided) return { valid: false, reason: "Missing v1 signature." };
  if (Math.abs(Date.now() / 1000 - t) > tol)
    return { valid: false, reason: "Timestamp outside tolerance window." };
  const expectedHex = await hmacHex(args.secret, `${t}.${args.body}`);
  const expectedBase64 = Buffer.from(expectedHex, "hex").toString("base64");
  return timingSafeEqual(expectedBase64, provided)
    ? { valid: true }
    : { valid: false, reason: "Signature mismatch." };
}
