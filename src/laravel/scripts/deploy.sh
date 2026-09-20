#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
git pull --ff-only origin "$DEPLOY_BRANCH"

# Record what's actually being deployed so the public footer can show it
# (config/app.php reads these; docker-compose.prod.yml loads .env as-is).
COMMIT_SHA="$(git rev-parse --short HEAD)"
BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
for var in "APP_COMMIT_SHA=${COMMIT_SHA}" "APP_BUILD_TIME=${BUILD_TIME}"; do
  key="${var%%=*}"
  if grep -q "^${key}=" .env 2>/dev/null; then
    sed -i.bak "s|^${key}=.*|${var}|" .env && rm -f .env.bak
  else
    echo "$var" >>.env
  fi
done

docker compose -f docker-compose.prod.yml build app
docker compose -f docker-compose.prod.yml up -d
docker image prune -f
