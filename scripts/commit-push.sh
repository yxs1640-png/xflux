#!/usr/bin/env bash
# Stage, commit, and push XFlux changes.
#
# Usage:
#   bash scripts/commit-push.sh -m "your commit message"
#   bash scripts/commit-push.sh -m "fix billing" --skip-build
#   bash scripts/commit-push.sh -m "docs cleanup" --dry-run
#   npm run commit:push -- -m "your message"
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DRY_RUN=false
SKIP_BUILD=false
COMMIT_MSG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true ;;
    --skip-build) SKIP_BUILD=true ;;
    -m)
      shift
      COMMIT_MSG="${1:-}"
      ;;
    -h|--help)
      cat <<'EOF'
Usage: commit-push.sh -m "message" [--skip-build] [--dry-run]

Options:
  -m "message"   Commit message (required)
  --skip-build   Skip npm run build
  --dry-run      Show changes only, no commit/push
  -h, --help     Show this help
EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Run with --help for usage."
      exit 1
      ;;
  esac
  shift
done

if [[ -z "$COMMIT_MSG" ]]; then
  echo "Error: commit message required. Example:"
  echo '  bash scripts/commit-push.sh -m "fix checkout and clean up docs"'
  exit 1
fi

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
git reset HEAD .env.local 2>/dev/null || true

if git diff --cached --quiet; then
  echo "Nothing staged after exclusions."
  exit 0
fi

echo ""
echo "==> git commit"
git commit -m "$COMMIT_MSG"

echo ""
echo "==> git push"
git push -u origin HEAD

echo ""
echo "Done. Vercel should auto-deploy if the repo is linked."
echo "Check: https://vercel.com → Deployments"
