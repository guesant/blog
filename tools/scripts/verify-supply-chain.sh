#!/usr/bin/env sh
set -eu

fail() {
    echo "Blazor supply-chain check failed: $1" >&2
    exit 1
}

for compose_file in .docker/compose.yaml .docker/compose.dev.yaml .docker/compose.postgres.yaml .docker/compose.prod.yaml; do
    [ -f "$compose_file" ] || fail "$compose_file is missing"
done

grep -Eq '^[[:space:]]*image:[[:space:]]*[^@[:space:]]+@sha256:[0-9a-f]{64}[[:space:]]*$' .docker/compose.yaml ||
    fail "the development image must be pinned by digest"

if grep -En '^[[:space:]]*(image:|FROM[[:space:]]).*(^|:)latest([[:space:]]|$)' .docker/compose*.yaml .docker/Dockerfile 2>/dev/null; then
    fail "an image still uses an unpinned latest tag"
fi

if grep -En '^[[:space:]]*FROM[[:space:]]' .docker/Dockerfile | grep -Ev '@sha256:[0-9a-f]{64}'; then
    fail "every Dockerfile base image must be pinned by digest"
fi

if find src/Portfolio -path '*/Portfolio.Blazor.Stories.VRT' -prune -o -type d -name node_modules -print -quit 2>/dev/null | grep -q .; then
    fail "node_modules must not be part of a .NET project"
fi

if grep -REn -i 'https?://[^" ]*(cdn|unpkg|jsdelivr)|curl[[:space:]].*\|[[:space:]]*(sh|bash)|wget[[:space:]].*\|[[:space:]]*(sh|bash)' \
    src/Portfolio/Portfolio.Blazor src/Portfolio/Portfolio.Blazor.Client src/Portfolio/Portfolio.Blazor.Core src/Portfolio/Portfolio.Blazor.UI .docker/compose.yaml 2>/dev/null; then
    fail "remote scripts or CDN assets are not allowed"
fi

for project in src/Portfolio/*/*.csproj; do
    lockfile="$(dirname "$project")/packages.lock.json"
    [ -f "$lockfile" ] || fail "$lockfile is missing"
done

sh -n tools/scripts/create-content-snapshot.sh || fail "the snapshot script has invalid shell syntax"
if sh tools/scripts/create-content-snapshot.sh 'portfolio-20260831T000000Z.sqlite;echo-pwned' >/dev/null 2>&1; then
    fail "the snapshot script accepted a shell metacharacter in its filename"
fi

echo "Blazor supply-chain checks passed"
