#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo 'usage: compile.sh <source.tex> <output.pdf>' >&2
  exit 2
fi

source="$1"
output="$2"
output_dir="$(dirname "$output")"
mkdir -p "$output_dir"

cache_flag=()
if [[ "${PORTFOLIO_PDF_OFFLINE:-0}" == "1" ]]; then
  cache_flag+=(--only-cached)
fi

bundle="${TECTONIC_BUNDLE:-}"
if [[ -z "$bundle" ]]; then
  echo 'TECTONIC_BUNDLE must be set to the pinned Tectonic bundle URL or local bundle.' >&2
  exit 1
fi

bundle_flag=(--bundle "$bundle")

# A cold Tectonic cache causes several requests to the bundle host. Serialize
# compilers that share the same cache and retry transient bundle-host failures
# so one successful locale warms the cache for the next one.
cache_dir="${TECTONIC_CACHE_DIR:-${XDG_CACHE_HOME:-$HOME/.cache}/Tectonic}"
mkdir -p "$cache_dir"
lock_file="$cache_dir/.portfolio-tectonic.lock"
exec 9>"$lock_file"
flock 9

max_attempts="${PORTFOLIO_PDF_MAX_ATTEMPTS:-4}"
attempt=1
while true; do
  if tectonic \
    "${bundle_flag[@]}" \
    "${cache_flag[@]}" \
    --outdir "$output_dir" \
    "$source"; then
    exit 0
  fi

  if (( attempt >= max_attempts )); then
    echo "Tectonic failed after ${attempt} attempts." >&2
    exit 1
  fi

  delay=$((5 * (2 ** (attempt - 1))))
  echo "Tectonic attempt ${attempt} failed; retrying after ${delay}s." >&2
  sleep "$delay"
  attempt=$((attempt + 1))
done
