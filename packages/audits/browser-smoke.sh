#!/usr/bin/env bash
set -euo pipefail

browser="$1"
"${browser}" --version
"${browser}" \
  --headless \
  --no-sandbox \
  --disable-gpu \
  --disable-dev-shm-usage \
  --dump-dom 'data:text/html,<title>portfolio-browser-smoke</title>' \
  | grep -F '<title>portfolio-browser-smoke</title>' >/dev/null
