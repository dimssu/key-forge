import { Breadcrumbs } from "@/components/breadcrumbs";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata = buildMetadata({
  title: "Privacy",
  description: "What APIKit does, and does not, do with the API keys you paste.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy" }]} />
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      </header>
      <section className="prose-doc">
        <p>The privacy story is the product. This page lists every fact about what happens to a key you paste into APIKit.</p>

        <h2>What happens when you test a key</h2>
        <ol>
          <li>Your browser POSTs to <code>/api/proxy/&lt;provider&gt;</code> with the key in the <code>x-apikit-key</code> header. The body contains an action like <code>validate</code> or <code>models</code>; it does not contain the key.</li>
          <li>The Next.js route handler reads the key from the header, hands it to the provider adapter, and immediately discards it from local scope.</li>
          <li>The adapter calls the upstream provider (OpenAI, Anthropic, etc.) with the key in the standard auth header for that provider.</li>
          <li>The upstream response is returned to your browser. The key is not retained in any in-memory cache, queue, or log.</li>
          <li>The route handler exits. The key is unreachable.</li>
        </ol>

        <h2>What we do not do with your key</h2>
        <ul>
          <li>We do not log the key, the auth header, the request body, or any field that contains the key.</li>
          <li>We do not persist the key to any database, file, or disk.</li>
          <li>We do not include the key in error messages, OG images, share URLs, JWT payloads, analytics events, or telemetry.</li>
          <li>We do not run analytics on the key value, hash the key, or aggregate keys across users.</li>
        </ul>

        <h2>Shareable result links</h2>
        <p>The optional &quot;share redacted result&quot; feature signs a JWT with the provider id, the last 4 chars of the key (for visual identification), the validation status, and a list of model ids. The full key is never in the JWT. The signing secret never leaves the server. Share links can be revoked by rotating the signing secret.</p>

        <h2>Rotation reminders</h2>
        <p>If <code>RESEND_API_KEY</code> is configured, you can opt into a 90-day rotation reminder. The signed JWT contains your email, the provider id, and the expiry timestamp. The full API key is never sent to the email service. We do not maintain a database of subscribers — the JWT is the only record.</p>

        <h2>Server-side logging</h2>
        <p>Vercel and any deployment platform sees the request method, path, response status, and aggregate latency. Headers — including <code>x-apikit-key</code> — are not included in our application logs. If you self-host, you control the logging stack.</p>

        <h2>Browser-side storage</h2>
        <p>We use <code>localStorage</code> only to remember your theme preference. We use <code>sessionStorage</code> briefly for the paste-to-route handoff (the pasted key is stored once and immediately consumed by the destination page). We never set cookies tied to your key.</p>

        <h2>Page-view analytics</h2>
        <p>We run <strong>first-party page-view analytics</strong> via Vercel Analytics. The script is served from the same origin (your browser POSTs events to <code>/_vercel/insights/event</code> and <code>/_vercel/insights/vitals</code> on this domain — never to a third-party host). No cookies are set. No fingerprinting. No third-party scripts.</p>
        <p><strong>What is collected, per page load:</strong></p>
        <ul>
          <li>The path you visited (e.g. <code>/test/openai-api-key</code>) and the referring page&apos;s host</li>
          <li>Country at country level only (derived at the edge from your IP — the IP itself is not stored)</li>
          <li>Device class (desktop / mobile / tablet) and browser family (Chrome / Firefox / Safari)</li>
          <li>An anonymous, daily-rotated visitor counter (a hashed signal, not a persistent ID)</li>
          <li>Web Vitals: LCP, INP, CLS, FCP, TTFB — to find slow pages and fix them</li>
        </ul>
        <p><strong>What is NOT collected:</strong></p>
        <ul>
          <li>Your API key, any prefix of it, or any redaction of it</li>
          <li>Any request body sent to the proxy</li>
          <li>Your full IP address, user agent string, or any cross-session identifier</li>
          <li>Cookies of any kind</li>
          <li>Mouse movements, clicks, scroll depth, or session replay</li>
        </ul>
        <p>If you want to verify, open your browser&apos;s Network tab and watch for the <code>/_vercel/insights/*</code> requests — that&apos;s the entire surface area of analytics on this site.</p>

        <h2>Third-party requests</h2>
        <p>The browser does not load any third-party scripts. No ad networks, no Google Analytics, no Sentry, no font CDNs (fonts are self-hosted via <code>next/font</code>), no trackers. Outbound requests go from our server to the upstream LLM provider you tested, and that&apos;s it.</p>

        <h2>Reporting a security issue</h2>
        <p>See <a href="/security">the security page</a> and <a href="/.well-known/security.txt">/.well-known/security.txt</a> for our disclosure contact.</p>
      </section>
    </article>
  );
}
