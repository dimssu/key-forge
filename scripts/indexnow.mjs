#!/usr/bin/env node
// Ping IndexNow (used by Bing, Yandex, and an emerging set of LLM crawlers) with
// every URL in our sitemap. Run after a deploy to nudge re-crawl. Safe to run
// repeatedly — IndexNow is idempotent.
//
//   pnpm run indexnow

import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HOST = process.env.INDEXNOW_HOST ?? "keyforge.dimssu.com";
const SITE = `https://${HOST}`;

// Generate a stable per-host key. IndexNow requires the same UUID-ish string
// to be exposed at https://<host>/<key>.txt for verification.
function makeKey() {
  const seed = `keyforge-${HOST}`;
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  // 32-char hex-ish, IndexNow accepts 8-128 hex chars.
  return Array.from({ length: 32 }, (_, i) =>
    ((hash >>> ((i * 5) % 31)) & 0xf).toString(16)
  ).join("");
}

const KEY = process.env.INDEXNOW_KEY ?? makeKey();
const here = dirname(fileURLToPath(import.meta.url));
const keyFile = resolve(here, "..", "public", `${KEY}.txt`);
if (!existsSync(keyFile)) {
  writeFileSync(keyFile, KEY, "utf8");
  console.log(`Wrote IndexNow key file → ${keyFile}`);
  console.log("Commit + redeploy so it's reachable, then re-run this script.");
  process.exit(0);
}

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
}

async function ping(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return { status: res.status, statusText: res.statusText };
}

(async () => {
  const urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap.`);
  const result = await ping(urls);
  console.log(`IndexNow: ${result.status} ${result.statusText}`);
  if (result.status >= 400) process.exit(1);
})();
