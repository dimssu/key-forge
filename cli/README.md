# apikit (CLI)

Test any LLM API key from your terminal.

```sh
npx apikit --help
APIKIT_KEY=sk-... npx apikit validate openai
APIKIT_KEY=sk-ant-... npx apikit models anthropic
APIKIT_KEY=gsk_... npx apikit bench groq 10
```

By default the CLI calls the public APIKit proxy at `https://keyforge.dimssu.com`.
Override with `APIKIT_BASE_URL` to point at a self-hosted instance.

The CLI is a wrapper around the `/api/proxy/<provider>` endpoint — your key is sent through the proxy and forwarded upstream, exactly like the web tester.
