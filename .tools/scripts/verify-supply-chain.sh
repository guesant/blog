#!/usr/bin/env sh
set -eu

for file in src/public-app/pnpm-lock.yaml src/laravel/composer.lock; do
  test -s "$file" || {
    echo "missing lockfile: $file" >&2
    exit 1
  }
done

unpinned_docker_images="$(awk '
  /^FROM[[:space:]]+/ {
    image = $2
    if ($3 == "AS") {
      stages[$4] = 1
    }
    if (image ~ /^\$\{/ || image ~ /@sha256:/ || stages[image]) {
      next
    }
    print FILENAME ":" FNR ":" $0
  }
' .docker/Dockerfile .docker/*.Dockerfile .tools/docker/*.Dockerfile src/laravel/docker/*.Dockerfile)"
if test -n "$unpinned_docker_images"; then
  printf '%s\n' "$unpinned_docker_images"
  echo "every Docker base image must be pinned by digest" >&2
  exit 1
fi

remote_compose_images="$(grep -hREn '^[[:space:]]*image:[[:space:]]+' \
  .docker/compose*.yaml .tools/docker/compose*.yaml 2>/dev/null |
  grep -vE 'image:[[:space:]]+portfolio-[A-Za-z0-9._-]+[[:space:]]*$' || true)"
if test -n "$remote_compose_images"; then
  printf '%s\n' "$remote_compose_images"
  echo "compose services must build local images from Dockerfiles" >&2
  exit 1
fi
