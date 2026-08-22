#!/usr/bin/env node
/**
 * Publish a markdown file to Dev.to.
 *
 * Usage:
 *   DEVTO_API_KEY=xxx node scripts/publish-devto.mjs
 *   DEVTO_API_KEY=xxx node scripts/publish-devto.mjs --draft
 *
 * Get API key: https://dev.to/settings/extensions → DEV Community API Keys
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ARTICLE_PATH = path.join(ROOT, "marketing/devto/01-get-started-with-xflux-api.md");
const COVER_IMAGE = "https://www.xfluxapi.com/opengraph-image.png";

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }

  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key === "tags") {
      meta.tags = value.split(",").map((t) => t.trim()).filter(Boolean);
    } else if (key === "published") {
      meta.published = value === "true";
    } else {
      meta[key] = value;
    }
  }

  return { meta, body: match[2].trim() };
}

async function main() {
  const apiKey = process.env.DEVTO_API_KEY?.trim();
  if (!apiKey) {
    console.error("Missing DEVTO_API_KEY.");
    console.error("Create one at https://dev.to/settings/extensions");
    console.error("Then run:");
    console.error('  DEVTO_API_KEY="your_key" node scripts/publish-devto.mjs');
    process.exit(1);
  }

  const draftFlag = process.argv.includes("--draft");
  const raw = fs.readFileSync(ARTICLE_PATH, "utf8");
  const { meta, body } = parseFrontmatter(raw);

  const payload = {
    article: {
      title: meta.title || "Get Started with XFlux",
      body_markdown: body,
      published: draftFlag ? false : meta.published !== false,
      description: meta.description,
      canonical_url: meta.canonical_url,
      main_image: COVER_IMAGE,
      tags: (meta.tags || ["twitter", "api", "webdev", "tutorial"]).slice(0, 4),
    },
  };

  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Dev.to API error:", res.status, JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log("Published successfully!");
  console.log("URL:", data.url);
  console.log("ID:", data.id);
  if (!payload.article.published) {
    console.log("Saved as draft — review at https://dev.to/dashboard");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
