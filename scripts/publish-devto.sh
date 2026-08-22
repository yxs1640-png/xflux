#!/usr/bin/env bash
# Publish Dev.to article via API.
# 1. Get key: https://dev.to/settings/extensions → Generate API Key
# 2. Run: DEVTO_API_KEY="xxx" bash scripts/publish-devto.sh
#    Draft first: DEVTO_API_KEY="xxx" bash scripts/publish-devto.sh --draft

set -euo pipefail
cd "$(dirname "$0")/.."

if [[ "${1:-}" == "--draft" ]]; then
  node scripts/publish-devto.mjs --draft
else
  node scripts/publish-devto.mjs
fi
