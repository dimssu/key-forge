import { NextResponse } from "next/server";
import { z } from "zod";
import { isSigningEnabled, signToken } from "@/lib/jwt";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email().max(254),
  providerId: z.string().min(1).max(50),
  days: z.number().int().min(1).max(365).default(90),
});

function reminderEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY) && isSigningEnabled();
}

export async function POST(req: Request) {
  if (!reminderEnabled()) {
    return NextResponse.json(
      { error: "Reminder feature is disabled. Set RESEND_API_KEY and KEYFORGE_SIGNING_SECRET." },
      { status: 503 }
    );
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const expiresAt = Date.now() + body.days * 24 * 60 * 60 * 1000;
  const token = await signToken({ email: body.email, providerId: body.providerId, expiresAt }, `${body.days}d`);
  if (!token) return NextResponse.json({ error: "Sign failed" }, { status: 500 });
  const confirmUrl = siteUrl(`/api/reminder/confirm?token=${encodeURIComponent(token)}`);

  // Schedule by sending an immediate confirmation email; the reminder itself is sent
  // later by a cron / scheduled job calling the Resend API with the same token signature.
  const from = process.env.REMINDER_FROM_EMAIL ?? "no-reply@keyforge.dimssu.com";
  const subject = `KeyForge — confirm rotation reminder for ${body.providerId}`;
  const text = `You asked KeyForge to remind you to rotate your ${body.providerId} key in ${body.days} days.

Click to confirm: ${confirmUrl}

If you didn't request this, ignore this email — no record will be kept.`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from, to: body.email, subject, text }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Email send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
