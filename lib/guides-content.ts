/**
 * Guide bodies as React-render-ready strings (HTML-ish; rendered with `dangerouslySetInnerHTML`
 * inside a styled `.prose-doc` container). We deliberately avoid MDX to keep build dependencies tight.
 */
export const GUIDE_BODIES: Record<string, string> = {
  "how-to-get-an-openai-api-key": `
<p>You can get an OpenAI API key in under three minutes. The full path is platform.openai.com → log in → API keys → Create new secret key. The clicks are easy. The decisions you make along the way determine whether the key you walk away with is safe to ship.</p>
<h2>Set up the account</h2>
<p>If you have a ChatGPT account, the same login works for the developer platform. The two are separate billing surfaces — your ChatGPT Plus subscription does not give you API credits, and your API spend does not unlock ChatGPT Plus. The first time you log into platform.openai.com, you'll be asked to either join an existing organization (if your employer already has one) or create a personal one.</p>
<p>Add a payment method before generating the key. New accounts get a small one-time starter credit, but it expires after a few months. Most production workloads burn through the starter in a single afternoon.</p>
<h2>Create a project</h2>
<p>Don't skip this step. Projects let you scope keys to a specific app, set per-project spend limits, and audit usage independently. The default <em>Default project</em> exists for convenience but treating everything as one bucket is the fastest way to get a $4,000 bill from a key that leaked into a stale CI job.</p>
<p>From the platform sidebar, click <strong>Settings → Projects → Create project</strong>. Give it a name that matches your repo. Set a monthly spend cap. The cap is the most important setting on this entire page; pick something a few times your expected spend so a misconfigured retry loop can't drain your bank account.</p>
<h2>Create the key</h2>
<p>Open <strong>API keys</strong> from the sidebar, click <strong>Create new secret key</strong>, and pick:</p>
<ul>
  <li><strong>Project</strong>: the one you just created.</li>
  <li><strong>Permissions</strong>: <em>Restricted</em>, then check only the scopes the app actually needs (Models, Chat completions, Embeddings — uncheck Audio, Files, Fine-tuning unless you use them).</li>
  <li><strong>Name</strong>: something descriptive like <code>kf-prod-2026</code>. You'll thank yourself when you're staring at a list of 14 keys two years from now.</li>
</ul>
<p>The key is shown <em>once</em>. Copy it into your secret manager (1Password, Vault, AWS Secrets Manager, Doppler — anywhere except a chat thread or a config commit).</p>
<h2>Verify it works</h2>
<p>Paste the key into the <a href="/test/openai-api-key">OpenAI tester</a>. We'll call <code>/v1/models</code> with your key, list the models it can access, and time the round trip. If you see a 200 and a list of model ids, you're done.</p>
<p>If you see a 401, double-check that nothing got truncated on copy. If you see a 200 but no GPT-4o, your account hasn't unlocked that tier yet — top up another five dollars and the gate usually opens within an hour.</p>
<h2>Service accounts vs project keys vs user keys</h2>
<p>Service account keys (<code>sk-svcacct-...</code>) belong to the project, not to you. Use them for backend services so a key doesn't die when an employee leaves. Project keys (<code>sk-proj-...</code>) belong to the user but are scoped to a single project. Plain <code>sk-...</code> keys are legacy and still work, but you should migrate.</p>
<h2>What to do next</h2>
<p>Set up <a href="/guides/api-key-security-best-practices">key security</a>. Schedule a 90-day rotation. Add the same key to your dev and prod secret stores under different names so you can rotate one without touching the other. And go ship something.</p>
`,

  "how-to-get-an-anthropic-api-key": `
<p>Getting an Anthropic API key takes about as long as making a coffee. The interesting part is what you do with workspaces and spend limits before you hand the key to your code.</p>
<h2>Sign in</h2>
<p>Go to <strong>console.anthropic.com</strong>. If you've used Claude.ai for chatting, that's a separate product — you'll still need to authenticate the developer console with the same email, but billing and rate limits live here, not there.</p>
<p>Anthropic gives new accounts a small block of starter credits. They expire on a clock, not on usage, so don't sit on them.</p>
<h2>Create a workspace</h2>
<p>Workspaces are Anthropic's mechanism for isolating environments. The default workspace is fine for tinkering, but for anything production-grade you want at least <em>dev</em> and <em>prod</em>, with their own keys, spend limits, and rate-limit ceilings.</p>
<p>From the sidebar pick <strong>Settings → Workspaces → Create workspace</strong>. Give it a clear name. Set a monthly spend cap right then; you can change it later, but having a number in place from minute one prevents accidents.</p>
<h2>Generate the key</h2>
<p>Switch into the new workspace, then open <strong>API Keys</strong>. Click <strong>Create Key</strong>, name it (<code>kf-prod-2026</code> works), and copy it. The format is <code>sk-ant-api03-...</code>. As with every API key on every platform, this is the one and only chance you'll get to see the full value.</p>
<p>Drop the key straight into your secret manager. Do not paste it into Slack, even your private DMs to yourself, even if you trust your team — Slack message history is searchable by anyone with admin access and many companies surface DMs in legal holds.</p>
<h2>Verify</h2>
<p>Paste the key into the <a href="/test/anthropic-api-key">Anthropic tester</a>. We hit <code>/v1/models</code> through a stateless proxy, return the list of Opus / Sonnet / Haiku variants you have access to, and time the call. A typical response from a US-deployed account is under 250ms.</p>
<p>If you get back a 403, your workspace probably needs model access enabled. From the workspace settings, toggle on the model families you want.</p>
<h2>Headers, not Bearer</h2>
<p>One detail that trips people up: Anthropic uses an <code>x-api-key</code> header, not <code>Authorization: Bearer</code>. The Anthropic SDK handles this for you. If you're calling raw HTTP, remember to also send <code>anthropic-version: 2023-06-01</code> (the date is a header value, not a path version).</p>
<h2>Prompt caching is the cheap trick</h2>
<p>If your prompts have a long static prefix — a system prompt, a tool spec, a long retrieval context — turn on prompt caching. Cached input tokens cost ~10% of normal input price. The savings on a real workload are usually 60–80% off the bill.</p>
<h2>What to do next</h2>
<p>Read the <a href="/guides/api-key-security-best-practices">security best practices</a> and the <a href="/guides/openai-vs-anthropic-pricing">OpenAI vs Anthropic pricing</a> guide if you're choosing between the two. Then go ship.</p>
`,

  "how-to-get-a-gemini-api-key": `
<p>Google's Gemini API has the friendliest free tier of any major provider, and the gnarliest auth model. The "easy path" through Google AI Studio is fine for prototypes; for production you'll want to graduate to Vertex AI or at least understand the difference.</p>
<h2>The two-minute path: Google AI Studio</h2>
<p>Open <strong>aistudio.google.com/app/apikey</strong>. Click <strong>Create API key</strong>. Pick a Cloud project (or let it create a new one). Copy the <code>AIza…</code> key. That's it.</p>
<p>The free tier on this key gives you small but real RPM and TPM caps on Flash. Plenty for a weekend project. As soon as you ship to anyone real, link a billing account from <em>console.cloud.google.com</em> — same key, suddenly the rate limits are 10–100× higher.</p>
<h2>Restrict the key</h2>
<p>An <code>AIza...</code> key is a generic Google API key. By default it can call any Google API your project has enabled. Don't leave it that wide. From <em>console.cloud.google.com → APIs &amp; Services → Credentials</em>, click your key and under <em>API restrictions</em> select <strong>Restrict key</strong>, then enable only the <strong>Generative Language API</strong>. Set <strong>Application restrictions</strong> to <em>HTTP referrers</em> for browser keys or <em>IP addresses</em> for server keys.</p>
<h2>Verify it works</h2>
<p>Paste the key into the <a href="/test/gemini-api-key">Gemini tester</a>. The validator hits the <code>?key=…</code> models list, prints which Gemini variants you have access to, and times the call. If you're outside <em>us-central1</em> you'll see ~200ms of extra latency.</p>
<h2>Vertex AI is the production answer</h2>
<p>For real production traffic, switch from API keys to Vertex AI. It runs the same models, but auth is Google Cloud — service accounts, ADC, IAM roles. You get regional endpoints, VPC controls, audit logs, and the rate limits scale with your GCP quota. The Gemini SDK automatically handles the auth swap; the only code change is the constructor.</p>
<h2>What to do next</h2>
<p>Read the <a href="/guides/api-key-security-best-practices">security guide</a> and consider <a href="/guides/free-llm-api-keys-for-testing">other free tiers</a> if you're just exploring.</p>
`,

  "api-key-security-best-practices": `
<p>An LLM API key is a credit card with a memory. If it leaks, the attacker can mint tokens until your spend cap kicks in (or your bank account empties, if you didn't set one). The mechanics of keeping a key safe are not exotic — they're the same secrets-handling discipline you'd apply to any production credential — but enough teams skip them that "leaked LLM key" is now a regular occurrence on Hacker News.</p>
<h2>Where to keep keys</h2>
<p>Pick one secrets manager and use it for everything. Pre-baked options: AWS Secrets Manager, Google Secret Manager, HashiCorp Vault, 1Password Secrets Automation, Doppler, Infisical. Roll-your-own options: <em>none, please</em>. The win from a real secrets manager is not the storage — it's the rotation, the audit trail, and the ability to revoke a key without touching code.</p>
<p>For local development, use <code>direnv</code> with an <code>.envrc</code> that's gitignored. Never put a real key in <code>.env.example</code>; that file gets committed. (Search GitHub for "OPENAI_API_KEY=sk-" — the live keys you'll find are a constant stream of accidents.)</p>
<h2>Scope the key</h2>
<p>Every modern provider supports per-project or per-workspace keys. Use them. The blast radius of a leaked key is bounded by how widely it's been authorized: a single-project, $50/month-capped key is a survivable mistake; a root-org key with no spend limit is a Slack post to the legal team.</p>
<p>OpenAI: project keys + restricted permissions + per-project spend caps. Anthropic: workspaces + spend limits. Gemini: API key restrictions to the Generative Language API only. Bedrock: IAM policies scoped to specific model ARNs. The pattern is the same; the verbs differ.</p>
<h2>Rotate on a schedule</h2>
<p>90 days is the boring default. Pin a calendar event or schedule a task. The mechanism: provision the new key, deploy code that reads <em>both</em> old and new for a window, switch the prod env var to the new key, watch the dashboard to confirm zero traffic on the old key, then revoke. This pattern is called <em>blue/green secrets</em>; we cover it in <a href="/guides/rotating-api-keys-safely">Rotating API keys safely</a>.</p>
<h2>Detect leaks</h2>
<p>GitHub's secret scanning catches OpenAI, Anthropic, and HF tokens automatically and notifies the provider, which auto-revokes. That's a great backstop, not a primary defense — by the time GitHub catches it, the key is already in the public timeline of someone's commit history. Treat any key that touches a public repo as compromised, even if scanners auto-revoke it.</p>
<p>Add a pre-commit hook (<code>gitleaks</code>, <code>trufflehog</code>) so leaked keys never reach <code>git push</code> in the first place.</p>
<h2>Watch your bill</h2>
<p>The first sign of a key compromise is usually the bill, not a security alert. Set up provider-side spend alerts (every provider has them). Set them low — 25%, 50%, 75% of monthly cap. If you get the 25% alert on day 2 of the month, something is off.</p>
<h2>Don't log the key</h2>
<p>It sounds obvious. It happens constantly. Express's default error handler will dump the request headers including <code>Authorization</code> if you let an exception bubble. Sentry will too. Most APM tools do, unless you explicitly redact <code>authorization</code> and <code>x-api-key</code>. <a href="/test/openai-api-key">KeyForge</a> itself was designed around this — the proxy never logs headers, never persists keys, never echoes them in error messages. You should hold your own code to the same bar.</p>
<h2>What to do next</h2>
<p>Set up <a href="/guides/rotating-api-keys-safely">rotation</a>, watch <a href="/tools/status">provider status</a> so you can tell apart "my key is broken" from "OpenAI is having a day", and consider an <a href="/tools/rate-limit">in-pipeline rate-limit calculator</a> to detect rogue clients early.</p>
`,

  "openai-vs-anthropic-pricing": `
<p>OpenAI and Anthropic publish per-million-token prices on dedicated pricing pages, and both move them around two or three times a year. Rather than memorise current numbers (they'll be out of date by the time you read this), the framework that matters is: pick a tier, then pick whichever provider is cheaper inside that tier today.</p>
<h2>The three tiers</h2>
<p>Both providers organize their lineup into three tiers, even though the names differ:</p>
<ul>
  <li><strong>Cheap and fast.</strong> OpenAI: <code>gpt-4o-mini</code>. Anthropic: <code>claude-haiku-4-5</code>. Penny-per-million-input-tokens territory. Use this as the default for high-throughput, latency-sensitive, simpler tasks.</li>
  <li><strong>Workhorse.</strong> OpenAI: <code>gpt-4o</code>. Anthropic: <code>claude-sonnet-4-6</code>. The default "good model" for most production workloads. Order-of-magnitude more expensive than the cheap tier.</li>
  <li><strong>Heavy reasoning.</strong> OpenAI: <code>o1</code> / <code>o3</code> family. Anthropic: <code>claude-opus-4-7</code>. Reserve for genuinely hard problems where the latency and cost are worth it.</li>
</ul>
<h2>Compare like-for-like</h2>
<p>When you do compare, normalize on input + output combined cost per million tokens for a representative ratio (1:1 is fine for chat; 5:1 input-heavy is fine for retrieval). Don't pick on input cost alone — providers periodically lower input and quietly raise output, or vice versa, to look better on superficial comparisons.</p>
<h2>Caching is the bigger lever</h2>
<p>Both providers ship prompt caching: Anthropic at ~10% of normal input cost, OpenAI at a similar discount tier. If your prompts have a stable prefix (system prompt + retrieval context + tool spec), caching cuts 60–80% off your bill in practice. This usually dwarfs the per-token gap between providers.</p>
<h2>Batch APIs cut another 50%</h2>
<p>If your workload tolerates a 24-hour SLA, both providers run a batch endpoint at a flat 50% discount on all tokens (cached or not). Useful for nightly summarization, classification, evals, fine-tuning data prep.</p>
<h2>Hidden lines</h2>
<ul>
  <li><strong>Image input</strong>: charged as token equivalents. A high-res image can be 1,500+ tokens.</li>
  <li><strong>Tool use</strong>: function call parameters and outputs are billed as input/output tokens like any other content.</li>
  <li><strong>Reasoning tokens</strong>: o1/o3-style thinking tokens count toward output cost even if you don't see them in the response.</li>
</ul>
<h2>What to do next</h2>
<p>Run the same evaluation prompt through both providers using <a href="/playground">the playground</a> to compare quality before chasing pennies. The provider that's slightly cheaper but worse at your task ends up costing more in retries.</p>
`,

  "free-llm-api-keys-for-testing": `
<p>You don't need a credit card to prototype with most major LLM providers. The free tiers are usually generous enough for a weekend, sometimes a month. Here's the honest landscape, and where each provider's "free" actually starts and ends.</p>
<h2>Google Gemini</h2>
<p>The most generous free tier of any major provider. AI Studio (<code>aistudio.google.com/app/apikey</code>) issues a key tied to a free GCP project with real RPM and TPM caps on Flash. No credit card. The catch: rate limits are aggressive enough that any real chat product will trip them on a slow Tuesday. Still, "free chat completions for prototyping" is a real thing on Gemini.</p>
<h2>Groq</h2>
<p>Sign up at <code>console.groq.com</code> with a Google account, no card. The free tier gives you per-day token caps per model. Llama 3.3 70B at 300+ tokens/sec for free is a stunning bargain. Limits reset daily, so you can't sustain production traffic, but it's perfect for development.</p>
<h2>OpenRouter</h2>
<p>OpenRouter exposes a handful of community-hosted models for free (with watermarking), plus low-cost routing across paid models. Useful if you want to bounce between Llama, Mistral, and Gemma without standing up three separate accounts.</p>
<h2>Hugging Face</h2>
<p>The Inference API is free for hundreds of thousands of models. Rate limits are per-user-per-hour and pretty tight. Cold-start delay is real (the first call can take 10+ seconds while the model loads). Pro accounts get higher caps. Great for occasional inference; not great for any latency-sensitive flow.</p>
<h2>Ollama (running locally)</h2>
<p>The actual cheapest option: run models on your own machine. Ollama on Apple Silicon runs Llama 3.2 3B and Phi-3-mini comfortably at usable speeds. Zero cost, full privacy, terrible if you don't have the RAM. <a href="/test/ollama-api-key">Test your Ollama daemon</a> to confirm it's reachable.</p>
<h2>OpenAI &amp; Anthropic starter credits</h2>
<p>Both ship small one-time starter credits to new accounts. They expire after a few months — calendar-time expiry, not on usage. Treat as "play money for the first weekend"; they won't carry a real workload.</p>
<h2>What's not actually free</h2>
<ul>
  <li>Replicate, Fireworks, Together, Mistral, DeepSeek, xAI, Perplexity, Cohere — all have promotional credits that come and go, but no permanent free tier you can build on.</li>
  <li>"Free with attribution" model listings on third-party platforms are usually paid behind the scenes.</li>
</ul>
<h2>What to do next</h2>
<p>Pick one free option (Gemini Flash or Groq are the pragmatic picks) for development, and budget for paid keys before you ship to real users. Use <a href="/compare">the comparison table</a> to pick the right paid provider when you're ready.</p>
`,

  "llm-rate-limits-explained": `
<p>Every LLM provider rate-limits you. The mechanism, the headers, and the granularity differ. Reading the actual headers from your responses will tell you more than any docs page.</p>
<h2>The two units</h2>
<p>Almost every provider rate-limits on two axes:</p>
<ul>
  <li><strong>RPM</strong> — Requests Per Minute. How many HTTP calls you can make.</li>
  <li><strong>TPM</strong> — Tokens Per Minute. How many tokens (input + output combined) you can move.</li>
</ul>
<p>You hit whichever ceiling comes first. A handful of small chats hit the RPM cap; a long retrieval prompt hits the TPM cap on a single call.</p>
<h2>The headers</h2>
<p>OpenAI and OpenAI-compatible providers (Groq, Together, Fireworks, OpenRouter) return:</p>
<pre><code>x-ratelimit-limit-requests: 5000
x-ratelimit-remaining-requests: 4998
x-ratelimit-reset-requests: 12s
x-ratelimit-limit-tokens: 200000
x-ratelimit-remaining-tokens: 198432
x-ratelimit-reset-tokens: 6m0s</code></pre>
<p>Anthropic uses a different naming convention:</p>
<pre><code>anthropic-ratelimit-tokens-limit: 200000
anthropic-ratelimit-tokens-remaining: 198432
anthropic-ratelimit-tokens-reset: 2026-01-15T12:34:56Z</code></pre>
<p>Use <a href="/tools/rate-limit">the rate-limit calculator</a> to paste the headers and parse them automatically.</p>
<h2>Tiers</h2>
<p>OpenAI bumps your tier — and your rate limits — based on cumulative spend. The first $5 unlocks tier 1; subsequent thresholds unlock 2, 3, 4, 5. Same key, more headroom over time. Anthropic uses workspace-level limits you can request increases on.</p>
<h2>What 429 actually means</h2>
<p>A 429 Too Many Requests can mean three different things:</p>
<ol>
  <li>You burst past RPM. Wait the reset window.</li>
  <li>You burst past TPM on a single huge call. Trim the prompt.</li>
  <li>The provider is shedding load globally and 429ing everyone. Check the <a href="/tools/status">status page</a>.</li>
</ol>
<p>Don't blindly retry on 429. Backoff with jitter, and respect the <code>retry-after</code> header if present.</p>
<h2>Stopping the bleed</h2>
<p>If you're hitting limits in production, the order of escalation is: 1) batch + cache, 2) move to a faster tier, 3) request a limit increase, 4) move to a different provider for that workload, 5) actually fix your code if you're calling 5× too often.</p>
<h2>What to do next</h2>
<p>Read about <a href="/guides/rotating-api-keys-safely">rotating keys</a> — high-throughput workloads sometimes split across multiple keys to multiply the effective limit, which only works if you can rotate cleanly.</p>
`,

  "rotating-api-keys-safely": `
<p>Rotating an API key without dropping traffic is a five-minute job done correctly and a 4am pager going off done incorrectly. Here's the pattern that holds.</p>
<h2>Blue/green secrets</h2>
<p>The mental model is the same as a blue/green deployment, but for credentials. At any moment, two keys exist for the same scope: the one currently in use (blue), and a new one ready to take over (green). Code reads from a single env var; that var gets switched from blue to green in a single deploy.</p>
<h2>The five steps</h2>
<ol>
  <li><strong>Provision the new key.</strong> Same scope, same project, same workspace. Drop it into your secret manager under a versioned key (<code>OPENAI_API_KEY_v2</code>) — not by overwriting the old one.</li>
  <li><strong>Deploy code that reads either.</strong> Many teams skip this. Don't. The fallback is what makes the rotation safe: <code>OPENAI_API_KEY = OPENAI_API_KEY_v2 ?? OPENAI_API_KEY_v1</code>. Now you can swap secret manager values without a code deploy.</li>
  <li><strong>Roll the secret manager value.</strong> Point <code>OPENAI_API_KEY</code> at v2.</li>
  <li><strong>Verify zero traffic on the old key.</strong> Open the provider console; watch the per-key usage chart for a full hour. If you see any traffic on v1 after the switch, something is using a stale env that hasn't restarted.</li>
  <li><strong>Revoke v1.</strong> Only after the verification window passes. Don't be tempted to do it earlier "to clean up."</li>
</ol>
<h2>Cron the rotation</h2>
<p>Manual rotations don't happen. They get postponed; the postponement is forgotten; the key sits for a year. Schedule it: a quarterly Github Action that opens a PR with a TODO; or, better, a fully automated pipeline that uses the provider's management API to mint a new key, write it to your secret manager, and trigger redeploy.</p>
<h2>Per-environment, not per-build</h2>
<p>Don't rotate prod and staging at the same time. Stagger by a week. If the rotation breaks something, you want staging to be the canary.</p>
<h2>Emergency rotation</h2>
<p>If a key is leaked, skip the gradual dance: revoke immediately and accept the brief outage. The data exfiltration risk vastly outweighs the inconvenience. After the emergency, audit how the key escaped and tighten the gap (pre-commit hooks, secret scanning, log redaction).</p>
<h2>What about user keys?</h2>
<p>If you let end-users store their own LLM keys with your app — common pattern for "bring your own key" SaaS — be very careful with rotation. Your job is to securely store them; the user's job is to rotate them. Push reminders, but don't try to rotate on their behalf.</p>
<h2>What to do next</h2>
<p>Make sure the key you're testing here is the one in your secrets manager. Use the <a href="/test/openai-api-key">KeyForge tester</a> to confirm v2 is alive before you flip the switch on v1.</p>
`,
};
