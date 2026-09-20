#!/usr/bin/env bash
set -euo pipefail

SOCKET=/var/run/docker.sock
if [ -S "$SOCKET" ]; then
  SOCKET_GID="$(stat -c '%g' "$SOCKET")"
  if ! getent group "$SOCKET_GID" >/dev/null; then
    groupadd -g "$SOCKET_GID" docker-host
  fi
  usermod -aG "$SOCKET_GID" webhook
fi

exec gosu webhook "$@"
