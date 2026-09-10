#!/usr/bin/env bash
# Publish or update Dev.to article via API.
# 1. Get key: https://dev.to/settings/extensions → Generate API Key
# 2. Update existing post (recommended):
#    DEVTO_API_KEY="xxx" bash scripts/publish-devto.sh --update
# 3. Create new post:
#    DEVTO_API_KEY="xxx" bash scripts/publish-devto.sh
#    Draft first: DEVTO_API_KEY="xxx" bash scripts/publish-devto.sh --draft

set -euo pipefail
cd "$(dirname "$0")/.."

if [[ "${1:-}" == "--draft" ]]; then
  node scripts/publish-devto.mjs --draft "${@:2}"
elif [[ "${1:-}" == "--update" ]]; then
  node scripts/publish-devto.mjs --update "${@:2}"
else
  node scripts/publish-devto.mjs "$@"
fi
