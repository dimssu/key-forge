# keyforge (CLI)

Test any LLM API key from your terminal.

```sh
npx keyforge --help
KEYFORGE_KEY=sk-... npx keyforge validate openai
KEYFORGE_KEY=sk-ant-... npx keyforge models anthropic
KEYFORGE_KEY=gsk_... npx keyforge bench groq 10
```

By default the CLI calls the public KeyForge proxy at `https://keyforge.dimssu.com`.
Override with `KEYFORGE_BASE_URL` to point at a self-hosted instance.

The CLI is a wrapper around the `/api/proxy/<provider>` endpoint — your key is sent through the proxy and forwarded upstream, exactly like the web tester.
