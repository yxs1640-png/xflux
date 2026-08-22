#!/usr/bin/env bash
# Fork + PR for https://github.com/ripienaar/free-for-dev
#
# Usage:
#   bash scripts/submit-free-for-dev.sh
#
# Optional (if GitHub is slow from CN):
#   git config --global http.proxy http://127.0.0.1:7897

set -euo pipefail

GITHUB_USER="${GITHUB_USER:-yxs1640-png}"
UPSTREAM="https://github.com/ripienaar/free-for-dev.git"
FORK="https://github.com/${GITHUB_USER}/free-for-dev.git"
REPO_DIR="${FREE_FOR_DEV_DIR:-$HOME/Projects/free-for-dev}"
BRANCH="add-xflux"

ENTRY='  * [XFlux](https://www.xfluxapi.com) - X/Twitter read REST API (profiles, search, timelines) plus account monitors. Free tier: 1,000 API calls/month, 1 monitor, instant API key. HTTP webhooks on paid plans from $19/mo.'

PR_BODY='## Requirements

 * [x] This is Software as a Service not self hosted
 * [x] It has a free tier not just a free trial
 * [x] Pricing information is clearly visible without signup or phone calls
 * [x] The submission mentions what is free
 * [x] The submission is not already present in the list
 * [x] The service has contact details of those running it and a privacy policy

## Summary

Adds [XFlux](https://www.xfluxapi.com) — freemium X/Twitter read API with account monitors.

- Website: https://www.xfluxapi.com
- Free tier: 1,000 API calls/month, 1 monitor, no credit card
- Paid from $19/mo (webhooks, higher quotas)'

if ! curl -sf --connect-timeout 10 "https://api.github.com/repos/${GITHUB_USER}/free-for-dev" >/dev/null; then
  echo "Fork not found: https://github.com/${GITHUB_USER}/free-for-dev"
  echo "1. Open https://github.com/ripienaar/free-for-dev and click Fork"
  echo "2. Re-run this script"
  exit 1
fi

if [[ ! -d "$REPO_DIR/.git" ]]; then
  echo "Cloning upstream to $REPO_DIR ..."
  git clone "$UPSTREAM" "$REPO_DIR"
  cd "$REPO_DIR"
  git remote rename origin upstream
  git remote add origin "$FORK"
else
  cd "$REPO_DIR"
  git fetch upstream 2>/dev/null || true
  git fetch origin 2>/dev/null || true
  if git remote get-url origin 2>/dev/null | grep -q ripienaar/free-for-dev; then
    git remote rename origin upstream
    git remote add origin "$FORK" 2>/dev/null || git remote set-url origin "$FORK"
  fi
fi

git checkout master 2>/dev/null || git checkout main
git pull upstream master 2>/dev/null || git pull upstream main

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

README="README.md"
if grep -q '\[XFlux\]' "$README"; then
  echo "XFlux entry already present in README.md"
else
  python3 - "$README" "$ENTRY" <<'PY'
import sys

path, entry = sys.argv[1], sys.argv[2]
lines = open(path, encoding="utf-8").read().splitlines()
needle = "  * [What The Diff]"
insert_at = next(i for i, line in enumerate(lines) if line == needle) + 1
lines.insert(insert_at, entry)
open(path, "w", encoding="utf-8").write("\n".join(lines) + "\n")
print(f"Inserted entry after line {insert_at}")
PY
fi

git add README.md
if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git -c user.name=yxs -c user.email=yxs1640-png@users.noreply.github.com commit -m "Add XFlux — X/Twitter API with free tier"
fi

git push -u origin "$BRANCH"

COMPARE_URL="https://github.com/ripienaar/free-for-dev/compare/master...${GITHUB_USER}:${BRANCH}?expand=1"
echo ""
echo "Open PR:"
echo "  $COMPARE_URL"
echo ""
echo "Title: Add XFlux — X/Twitter API with free tier"
echo ""
echo "Body (copy/paste):"
echo "$PR_BODY"
