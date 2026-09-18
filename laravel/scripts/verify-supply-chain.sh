#!/usr/bin/env sh
set -eu

fail() { echo "supply-chain check failed: $1" >&2; exit 1; }

[ -f package-lock.json ] || fail "package-lock.json is missing"
[ -f composer.lock ] || fail "composer.lock is missing"

for dockerfile in docker/*.Dockerfile; do
    grep -Eq '^FROM .+@sha256:[0-9a-f]{64}' "$dockerfile" || fail "$dockerfile has an unpinned FROM reference"
done

if grep -REn '^[[:space:]]*(image:|FROM ).*:latest([[:space:]]|$)' docker docker-compose*.yml; then
    fail "an image still uses an unpinned latest tag"
fi

if grep -REn 'npm ci( |$)' docker justfile | grep -v -- '--ignore-scripts'; then
    fail "npm ci must use --ignore-scripts unless explicitly reviewed"
fi

echo "Docker references and lockfiles are pinned."
