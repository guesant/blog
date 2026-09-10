#!/usr/bin/env bash
set -euo pipefail

tool="$1"
shift

case "$tool" in
  lizard)
    exec uv run --project tools/quality lizard "$@"
    ;;
  *)
    echo "Unsupported quality tool: $tool" >&2
    exit 2
    ;;
esac
