#!/usr/bin/env bash
# XFlux smoke tests — run with dev server up: npm run dev
set -euo pipefail

BASE="${BASE_URL:-http://localhost:3000}"

pass() { echo "✓ $1"; }
fail() { echo "✗ $1"; exit 1; }

status() {
  curl -sS -o /dev/null -w "%{http_code}" -m 15 "$1"
}

echo "XFlux smoke tests @ $BASE"
echo ""

# Pages
for p in / /pricing /docs /terms /privacy /login /register; do
  code=$(status "$BASE$p")
  [[ "$code" == "200" ]] && pass "GET $p" || fail "GET $p -> $code"
done

# Health
health=$(curl -sS -m 15 "$BASE/api/health")
echo "$health" | grep -q '"status":"ok"' && pass "GET /api/health" || fail "GET /api/health"

# Auth required
code=$(curl -sS -o /dev/null -w "%{http_code}" -m 10 "$BASE/api/v1/search?q=test")
[[ "$code" == "401" ]] && pass "API rejects missing key" || fail "API missing key -> $code"

# Register test user
EMAIL="smoke-$(date +%s)@xflux-test.dev"
REG=$(curl -sS -m 15 -X POST "$BASE/api/register" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"testpass123\"}")
KEY=$(node -e "const j=JSON.parse(process.argv[1]); if(!j.apiKey) process.exit(1); console.log(j.apiKey)" "$REG")
pass "POST /api/register"

# API search
code=$(curl -sS -o /dev/null -w "%{http_code}" -m 30 \
  -H "Authorization: Bearer $KEY" "$BASE/api/v1/search?q=test&limit=1")
[[ "$code" == "200" ]] && pass "GET /api/v1/search" || fail "GET /api/v1/search -> $code"

# API user profile
code=$(curl -sS -o /dev/null -w "%{http_code}" -m 30 \
  -H "Authorization: Bearer $KEY" "$BASE/api/v1/users/elonmusk")
[[ "$code" == "200" ]] && pass "GET /api/v1/users/:username" || fail "GET /api/v1/users/:username -> $code"

# API user tweets (empty ok, 500 not ok)
code=$(curl -sS -o /dev/null -w "%{http_code}" -m 30 \
  -H "Authorization: Bearer $KEY" "$BASE/api/v1/users/elonmusk/tweets?limit=2")
[[ "$code" == "200" || "$code" == "400" || "$code" == "502" ]] && pass "GET /api/v1/users/:username/tweets ($code)" || fail "GET user tweets -> $code"

# Post tweet not implemented
code=$(curl -sS -o /dev/null -w "%{http_code}" -m 10 \
  -X POST -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"text":"hello"}' "$BASE/api/v1/tweets")
[[ "$code" == "501" ]] && pass "POST /api/v1/tweets returns 501" || fail "POST /api/v1/tweets -> $code"

echo ""
echo "Smoke tests passed."
