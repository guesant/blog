#!/usr/bin/env bash

set -euo pipefail

production_url=${1:-}

if [[ $production_url != https://* ]]; then
  echo 'PRODUCTION_URL must be a non-empty HTTPS URL.' >&2
  exit 1
fi

base_url=${production_url%/}
readonly routes=(
  '/'
  '/en'
  '/pt-BR'
  '/resume-en.pdf'
  '/resume-pt-BR.pdf'
)

check_route() {
  local route=$1

  curl \
    --fail \
    --location \
    --retry 5 \
    --retry-all-errors \
    --retry-delay 5 \
    --show-error \
    --silent \
    --output /dev/null \
    "${base_url}${route}"
}

for route in "${routes[@]}"; do
  check_route "$route"
done
