#!/usr/bin/env sh
set -eu

for file in src/public-app/pnpm-lock.yaml src/laravel/composer.lock src/laravel/package-lock.json; do
    test -s "$file" || {
        echo "missing lockfile: $file" >&2
        exit 1
    }
done

if grep -REn '^FROM[[:space:]]+[^@[:space:]]+[[:space:]]*$|^FROM[[:space:]]+[^@[:space:]]+[[:space:]]+AS' .docker --include='*Dockerfile' 2>/dev/null; then
    echo "every Docker base image must be pinned by digest" >&2
    exit 1
fi

if grep -REn '^[[:space:]]*image:[[:space:]]+[^@[:space:]]+[[:space:]]*$' .docker/compose*.yaml 2>/dev/null | grep -v 'image:[[:space:]]*portfolio-tools[[:space:]]*$'; then
    echo "every compose image must be pinned by digest" >&2
    exit 1
fi
