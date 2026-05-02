import { Breadcrumbs } from "@/components/breadcrumbs";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "Security",
  description: "KeyForge's threat model, scope of trust, and what we do to keep your API keys safe.",
  path: "/security",
});

export default function SecurityPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/security", label: "Security" }]} />
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Security</h1>
      </header>
      <section className="prose-doc">
        <h2>Threat model</h2>
        <p>The threats this site defends against, in order of priority:</p>
        <ol>
          <li><strong>Server-side key persistence.</strong> A pasted key must not survive the request that tested it. Mitigated by a stateless proxy that never logs or stores headers, and a code-level audit that grep&apos;s for any <code>console.log</code> near auth-handling code.</li>
          <li><strong>Cross-request key leakage.</strong> The shared in-memory rate-limit cache stores only IP timestamps, never request bodies or headers. There is no per-key cache anywhere in the codebase.</li>
          <li><strong>Client-side key exfiltration.</strong> CSP forbids third-party scripts. No analytics, fonts, or ad networks are loaded. The browser only ever talks to our origin.</li>
          <li><strong>Share-link key leakage.</strong> Shareable result URLs encode only the last 4 characters of the key, the provider id, the validation status, and the model id list. The full key is never embedded.</li>
          <li><strong>Email-based key leakage.</strong> The optional reminder feature signs a JWT containing only <code>{`{ email, providerId, expiresAt }`}</code>. The API key never reaches the email service.</li>
        </ol>

        <h2>Out of scope</h2>
        <p>The following are not threats this site protects against:</p>
        <ul>
          <li>A compromised browser, OS, or password manager. If your machine is compromised, anything you paste is already lost.</li>
          <li>A man-in-the-middle on your network. KeyForge is HTTPS-only with HSTS, but if your TLS chain is compromised, all bets are off.</li>
          <li>An upstream provider being breached. KeyForge has no influence on what OpenAI, Anthropic, or any other vendor does with the key once we forward it.</li>
        </ul>

        <h2>Defenses in place</h2>
        <ul>
          <li><strong>HTTPS + HSTS.</strong> All traffic is TLS-only with a 2-year HSTS lifetime + <code>preload</code>.</li>
          <li><strong>Strict CSP.</strong> No third-party scripts. No inline event handlers. <code>frame-ancestors &apos;none&apos;</code>.</li>
          <li><strong>X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy locked down.</strong></li>
          <li><strong>Rate limiting.</strong> Per-IP sliding-window limit on <code>/api/proxy/*</code> at 30 RPM by default. Best-effort across regions; not designed as anti-abuse infrastructure at scale.</li>
          <li><strong>No telemetry.</strong> No analytics SDK, no Sentry, no third-party error tracking that might capture headers.</li>
          <li><strong>Stateless server proxy.</strong> No database, no queue, no persistent storage adjacent to the proxy route.</li>
          <li><strong>Code audit.</strong> The <code>trust-security-completion.md</code> file in the agents directory documents the grep-based audit pass: <code>console.log</code>, <code>localStorage</code>, <code>sessionStorage</code>, error-message echo of headers — all checked.</li>
        </ul>

        <h2>Self-hosting</h2>
        <p>The codebase is MIT-licensed and designed to be self-hostable on Vercel, Netlify, or any Node.js host. If you don&apos;t want to trust any third party with the proxy hop, fork and deploy your own.</p>

        <h2>Reporting a vulnerability</h2>
        <p>Please report security issues to <code>security@dimssu.com</code>. PGP key on request. We commit to acknowledging within 48 hours and patching critical issues within 7 days.</p>
        <p>See <a href="/.well-known/security.txt">/.well-known/security.txt</a> for the machine-readable contact.</p>
      </section>
    </article>
  );
}
