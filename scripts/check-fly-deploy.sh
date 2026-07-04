#!/usr/bin/env bash
# Post-deploy smoke tests for Fly.io api-server + optional Vercel.
set -euo pipefail

FLY_API_URL="${1:-}"
INTERNAL_KEY="${2:-}"
VERCEL_URL="${3:-}"
API_KEY="${4:-}"

if [[ -z "$FLY_API_URL" || -z "$INTERNAL_KEY" ]]; then
  echo "Usage: ./scripts/check-fly-deploy.sh FLY_API_URL INTERNAL_KEY [VERCEL_URL] [XFLUX_API_KEY]"
  echo "Example: ./scripts/check-fly-deploy.sh https://xflux-api.fly.dev abc123..."
  exit 1
fi

FLY_API_URL="${FLY_API_URL%/}"

echo "==> Fly.io health"
curl -sf "$FLY_API_URL/health" | head -c 200
echo ""

echo "==> Fly.io search (internal key)"
curl -sf -H "x-flux-internal-key: $INTERNAL_KEY" "$FLY_API_URL/v1/search?q=test" | head -c 300
echo ""

if [[ -n "$VERCEL_URL" && -n "$API_KEY" ]]; then
  VERCEL_URL="${VERCEL_URL%/}"
  echo "==> Vercel public API"
  curl -sf -H "Authorization: Bearer $API_KEY" "$VERCEL_URL/api/v1/search?q=test" | head -c 300
  echo ""
fi

echo "OK"
