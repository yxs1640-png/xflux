#!/usr/bin/env node
/**
 * Stripe test-mode setup helper.
 *
 * Usage:
 *   node scripts/stripe-setup.mjs check       # validate .env
 *   node scripts/stripe-setup.mjs bootstrap   # create test products/prices (needs sk_test_)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env");

const REQUIRED = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_BASIC",
  "STRIPE_PRICE_GROWTH",
  "STRIPE_PRICE_PRO",
  "STRIPE_PRICE_SCALE",
];

const PRODUCTS = [
  { env: "STRIPE_PRICE_BASIC", name: "XFlux Starter", amount: 1900 },
  { env: "STRIPE_PRICE_GROWTH", name: "XFlux Growth", amount: 4900 },
  { env: "STRIPE_PRICE_PRO", name: "XFlux Pro", amount: 9900 },
  { env: "STRIPE_PRICE_SCALE", name: "XFlux Scale", amount: 24900 },
];

function loadEnvFile() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error("Missing .env — copy from .env.example first.");
    process.exit(1);
  }

  const env = {};
  for (const line of fs.readFileSync(ENV_PATH, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function validateEnv(env) {
  const results = [];
  for (const key of REQUIRED) {
    const value = env[key]?.trim() ?? "";
    let ok = Boolean(value);
    let note = "";

    if (!value) {
      note = "missing";
      ok = false;
    } else if (key === "STRIPE_SECRET_KEY") {
      if (!value.startsWith("sk_test_")) {
        ok = value.startsWith("sk_");
        note = value.startsWith("sk_live_")
          ? "live key — use sk_test_ for local testing"
          : "expected sk_test_...";
      }
    } else if (key === "STRIPE_WEBHOOK_SECRET") {
      ok = value.startsWith("whsec_");
      if (!ok) note = "expected whsec_...";
    } else if (key.startsWith("STRIPE_PRICE_")) {
      ok = value.startsWith("price_");
      if (!ok) note = "expected price_...";
    }

    results.push({ key, ok, note });
  }
  return results;
}

function upsertEnvValue(key, value) {
  let content = fs.readFileSync(ENV_PATH, "utf8");
  const pattern = new RegExp(`^${key}=.*$`, "m");
  const line = `${key}="${value}"`;

  if (pattern.test(content)) {
    content = content.replace(pattern, line);
  } else {
    content = content.trimEnd() + `\n${line}\n`;
  }

  fs.writeFileSync(ENV_PATH, content);
}

async function bootstrap(env) {
  const secret = env.STRIPE_SECRET_KEY?.trim();
  if (!secret?.startsWith("sk_test_")) {
    console.error(
      "Set STRIPE_SECRET_KEY=sk_test_... in .env first (Stripe Dashboard → Test mode → API keys)."
    );
    process.exit(1);
  }

  const stripe = new Stripe(secret);
  const existing = await stripe.products.list({ limit: 100, active: true });

  for (const spec of PRODUCTS) {
    const current = env[spec.env]?.trim();
    if (current?.startsWith("price_")) {
      try {
        await stripe.prices.retrieve(current);
        console.log(`✓ ${spec.env} already set (${current})`);
        continue;
      } catch {
        console.log(`! ${spec.env} invalid, recreating...`);
      }
    }

    let product = existing.data.find((p) => p.name === spec.name);
    if (!product) {
      product = await stripe.products.create({
        name: spec.name,
        description: `${spec.name} monthly subscription`,
      });
      console.log(`+ Created product: ${spec.name} (${product.id})`);
    } else {
      console.log(`✓ Found product: ${spec.name} (${product.id})`);
    }

    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 20 });
    let price = prices.data.find(
      (p) =>
        p.recurring?.interval === "month" &&
        p.unit_amount === spec.amount &&
        p.currency === "usd"
    );

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        currency: "usd",
        unit_amount: spec.amount,
        recurring: { interval: "month" },
      });
      console.log(`+ Created price: $${spec.amount / 100}/mo (${price.id})`);
    } else {
      console.log(`✓ Found price: $${spec.amount / 100}/mo (${price.id})`);
    }

    upsertEnvValue(spec.env, price.id);
    console.log(`  → wrote ${spec.env} to .env`);
  }
}

async function verifyPrices(env) {
  const secret = env.STRIPE_SECRET_KEY?.trim();
  if (!secret?.startsWith("sk_")) return;

  const stripe = new Stripe(secret);
  for (const spec of PRODUCTS) {
    const priceId = env[spec.env]?.trim();
    if (!priceId?.startsWith("price_")) continue;
    const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
    const productName =
      typeof price.product === "object" && price.product && "name" in price.product
        ? price.product.name
        : price.product;
    console.log(
      `✓ ${spec.env}: ${priceId} → ${productName} $${(price.unit_amount ?? 0) / 100}/mo`
    );
  }
}

async function main() {
  const cmd = process.argv[2] ?? "check";
  const env = loadEnvFile();

  if (cmd === "bootstrap") {
    await bootstrap(env);
    console.log("\nNext: set STRIPE_WEBHOOK_SECRET (run `stripe listen` in another terminal).");
    return;
  }

  if (cmd !== "check") {
    console.error("Usage: node scripts/stripe-setup.mjs [check|bootstrap]");
    process.exit(1);
  }

  console.log("Stripe test-mode configuration:\n");
  const results = validateEnv(env);
  let allOk = true;
  for (const { key, ok, note } of results) {
    const status = ok ? "ok" : note || "invalid";
    console.log(`  ${ok ? "✓" : "✗"} ${key}: ${status}`);
    if (!ok) allOk = false;
  }

  if (env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
    console.log("");
    try {
      await verifyPrices(env);
    } catch (err) {
      console.error("  ✗ Stripe API error:", err.message);
      allOk = false;
    }
  }

  console.log("");
  if (allOk) {
    console.log("All set. Start webhook forwarding, then run `npm run dev` and test billing.");
  } else {
    console.log("Setup steps:");
    console.log("  1. Stripe Dashboard (Test mode) → copy sk_test_... → STRIPE_SECRET_KEY in .env");
    console.log("  2. Run: npm run stripe:bootstrap");
    console.log("  3. Install Stripe CLI: brew install stripe/stripe-cli/stripe");
    console.log("  4. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe");
    console.log("  5. Copy whsec_... → STRIPE_WEBHOOK_SECRET in .env, restart npm run dev");
  }

  process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
