#!/usr/bin/env sh
set -eu

if [ -z "${PORTFOLIO_CONTENT_API_URL:-}" ]; then
    echo "Refusing to start: PORTFOLIO_CONTENT_API_URL is empty." >&2
    exit 1
fi

exec "$@"
