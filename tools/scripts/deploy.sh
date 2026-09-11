#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

# Pull-based deploy: the image is built by GitHub Actions on every push to main and
# published to ghcr.io/guesant/portfolio. This script only fetches the current tag and
# restarts the service; it never builds, never touches git and never applies migrations.
docker compose --env-file .env -f .docker/compose.prod.yaml pull web
docker compose --env-file .env -f .docker/compose.prod.yaml up -d --remove-orphans
docker image prune -f
