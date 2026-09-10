#!/usr/bin/env bash
set -eu

apt_get() {
  if [ "$(id -u)" -eq 0 ]; then
    apt-get "$@"
  else
    sudo apt-get "$@"
  fi
}

apt_get update
for file in "$@"; do
  while IFS= read -r pkg; do
    [ -z "$pkg" ] && continue
    apt_get install --yes --no-install-recommends "$pkg" \
      || apt_get install --yes --no-install-recommends "${pkg}t64"
  done < <(grep -hv '^#' "$file")
done
