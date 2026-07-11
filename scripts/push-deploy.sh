#!/usr/bin/env bash
# Backward-compatible alias — prefer scripts/commit-push.sh
#
# Usage:
#   npm run deploy:push -- -m "your commit message"
#   npm run deploy:push -- -m "fix" --skip-build
#   npm run deploy:push -- -m "test" --dry-run
#
exec "$(cd "$(dirname "$0")" && pwd)/commit-push.sh" "$@"
