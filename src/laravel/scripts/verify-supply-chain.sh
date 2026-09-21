#!/usr/bin/env sh
set -eu

fail() {
  echo "supply-chain check failed: $1" >&2
  exit 1
}

[ -f composer.lock ] || fail "composer.lock is missing"

for dockerfile in docker/*.Dockerfile; do
  grep -Eq '^FROM .+@sha256:[0-9a-f]{64}' "$dockerfile" || fail "$dockerfile has an unpinned FROM reference"
done

if grep -REn '^[[:space:]]*(image:|FROM ).*:latest([[:space:]]|$)' docker docker-compose*.yml; then
  fail "an image still uses an unpinned latest tag"
fi

echo "Docker references and the Composer lockfile are pinned."
