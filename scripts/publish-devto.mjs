#!/usr/bin/env node
/**
 * Publish or update a markdown file on Dev.to.
 *
 * Usage:
 *   DEVTO_API_KEY=xxx node scripts/publish-devto.mjs              # quickstart (article 01)
 *   DEVTO_API_KEY=xxx node scripts/publish-devto.mjs --article=02-xflux-make-com-webhook
 *   DEVTO_API_KEY=xxx node scripts/publish-devto.mjs --draft
 *   DEVTO_API_KEY=xxx node scripts/publish-devto.mjs --update    # update existing (default id below)
 *   DEVTO_API_KEY=xxx node scripts/publish-devto.mjs --update --id=4393165
 *
 * Get API key: https://dev.to/settings/extensions → DEV Community API Keys
 *
 * Prefer --update for the quickstart article to avoid duplicate posts.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ARTICLE_CATALOG = {
  "01-get-started-with-xflux-api": {
    md: "01-get-started-with-xflux-api.md",
    body: "01-get-started-with-xflux-api-body.md",
    defaultUpdateId: "4393165",
  },
  "02-xflux-make-com-webhook": {
    md: "02-xflux-make-com-webhook.md",
    body: "02-xflux-make-com-webhook-body.md",
    defaultUpdateId: null,
  },
};

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

function resolveArticle(argv) {
  const articleArg = argv.find((a) => a.startsWith("--article="));
  const slug = articleArg
    ? articleArg.slice("--article=".length).replace(/\.md$/, "")
    : "01-get-started-with-xflux-api";
  const entry = ARTICLE_CATALOG[slug];
  if (!entry) {
    console.error(`Unknown article "${slug}". Available: ${Object.keys(ARTICLE_CATALOG).join(", ")}`);
    process.exit(1);
  }
  return {
    slug,
    articlePath: path.join(ROOT, "marketing/devto", entry.md),
    bodyPath: path.join(ROOT, "marketing/devto", entry.body),
    defaultUpdateId: entry.defaultUpdateId,
  };
}

function readArticleBody(articlePath, bodyPath) {
  if (fs.existsSync(bodyPath)) {
    return fs.readFileSync(bodyPath, "utf8").trim();
  }
  const raw = fs.readFileSync(articlePath, "utf8");
  return parseFrontmatter(raw).body;
}

function parseArgs(argv) {
  const draftFlag = argv.includes("--draft");
  const updateFlag = argv.includes("--update");
  const idArg = argv.find((a) => a.startsWith("--id="));
  const article = resolveArticle(argv);
  const articleId = idArg
    ? idArg.slice("--id=".length)
    : article.defaultUpdateId;
  if (updateFlag && !articleId) {
    console.error(`--update requires --id= for article "${article.slug}" (no default yet).`);
    process.exit(1);
  }
  return { draftFlag, updateFlag, articleId, article };
}

async function main() {
  const apiKey = process.env.DEVTO_API_KEY?.trim();
  if (!apiKey) {
    console.error("Missing DEVTO_API_KEY.");
    console.error("Create one at https://dev.to/settings/extensions");
    console.error("Then run:");
    console.error('  DEVTO_API_KEY="your_key" node scripts/publish-devto.mjs --update');
    process.exit(1);
  }

  const { draftFlag, updateFlag, articleId, article } = parseArgs(process.argv.slice(2));
  const raw = fs.readFileSync(article.articlePath, "utf8");
  const { meta } = parseFrontmatter(raw);
  const body = readArticleBody(article.articlePath, article.bodyPath);

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

  const url = updateFlag
    ? `https://dev.to/api/articles/${articleId}`
    : "https://dev.to/api/articles";
  const method = updateFlag ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
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

  console.log(updateFlag ? "Updated successfully!" : "Published successfully!");
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
