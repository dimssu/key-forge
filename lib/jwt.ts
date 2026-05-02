import { SignJWT, jwtVerify } from "jose";

function secret(): Uint8Array | null {
  const raw = process.env.KEYFORGE_SIGNING_SECRET;
  if (!raw) return null;
  return new TextEncoder().encode(raw);
}

export function isSigningEnabled(): boolean {
  return Boolean(process.env.KEYFORGE_SIGNING_SECRET);
}

/** Sign a JWT with HS256. Returns null if no signing secret configured. */
export async function signToken(
  payload: Record<string, unknown>,
  expiresIn: string | number = "90d"
): Promise<string | null> {
  const s = secret();
  if (!s) return null;
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("keyforge")
    .setExpirationTime(expiresIn)
    .sign(s);
}

export async function verifyToken<T extends Record<string, unknown> = Record<string, unknown>>(
  token: string
): Promise<T | null> {
  const s = secret();
  if (!s) return null;
  try {
    const { payload } = await jwtVerify(token, s, { issuer: "keyforge" });
    return payload as T;
  } catch {
    return null;
  }
}
