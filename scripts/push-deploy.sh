#!/usr/bin/env bash
# Stage, commit, and push XFlux changes for Vercel production deploy.
#
# Usage:
#   npm run deploy:push              # build + commit + push
#   npm run deploy:push -- --dry-run # preview only, no git write
#   npm run deploy:push -- --skip-build
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DRY_RUN=false
SKIP_BUILD=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --skip-build) SKIP_BUILD=true ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--skip-build]"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      exit 1
      ;;
  esac
done

if [[ -f .env ]] && git status --porcelain .env 2>/dev/null | grep -q .; then
  echo "Note: .env is gitignored and will not be committed."
fi

if [[ "$SKIP_BUILD" != true ]]; then
  echo "==> npm run build"
  npm run build
fi

echo ""
echo "==> Changes"
git status --short

if [[ "$DRY_RUN" == true ]]; then
  echo ""
  echo "Dry run complete — no commit or push."
  exit 0
fi

if [[ -z "$(git status --porcelain)" ]]; then
  echo "Working tree clean — nothing to push."
  exit 0
fi

git add -A
git reset HEAD .env 2>/dev/null || true
git reset HEAD api-server/.env 2>/dev/null || true

if git diff --cached --quiet; then
  echo "Nothing staged after exclusions."
  exit 0
fi

git commit -m "$(cat <<'EOF'
Ship pricing overhaul, feedback, legal pages, and production polish.

Expand to five subscription tiers with Stripe Growth/Scale, honest marketing copy,
user feedback with Resend email, signup/feedback source attribution, PostHog hooks,
legal pages, API/monitor fixes, and xfluxapi.com config.
EOF
)"

echo ""
echo "==> git push"
git push -u origin HEAD

echo ""
echo "Done. If Vercel is linked to this repo, a production deploy should start."
echo "Post-push checklist:"
echo "  - Vercel env: NEXTAUTH_URL=https://xfluxapi.com"
echo "  - Vercel env: STRIPE_*, RESEND_API_KEY, STRIPE_PRICE_* (all 4 tiers)"
echo "  - Stripe webhook: https://xfluxapi.com/api/webhooks/stripe"
echo "  - Verify: https://xfluxapi.com"
