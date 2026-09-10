#!/usr/bin/env bash
set -euo pipefail

mkdir -p "${HOME}" /var/cache/hermit /var/cache/pnpm /var/cache/moon /var/cache/playwright /var/cache/tectonic
export HERMIT_CACHE_DIR="${HERMIT_CACHE_DIR:-/var/cache/hermit}"
export HERMIT_EXE="${HERMIT_EXE:-/usr/local/hermit/hermit}"
export HERMIT_STATE_DIR="${HERMIT_STATE_DIR:-/var/cache/hermit}"
export PNPM_HOME="${PNPM_HOME:-/var/cache/pnpm/home}"
export PNPM_STORE_DIR="${PNPM_STORE_DIR:-/var/cache/pnpm/store}"
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/var/cache/playwright}"
export TECTONIC_CACHE_DIR="${TECTONIC_CACHE_DIR:-/var/cache/tectonic}"
export MOON_CACHE_DIR="${MOON_CACHE_DIR:-/var/cache/moon}"
export MOON_TOOLCHAIN_FORCE_GLOBALS="${MOON_TOOLCHAIN_FORCE_GLOBALS:-true}"
export PATH="/usr/local/hermit:/workspace/.config/hermit/bin:/workspace/node_modules/.bin:${PNPM_HOME}:${PATH}"

if [[ -f /workspace/.config/hermit/bin/hermit.hcl && ! -x /workspace/.config/hermit/bin/hermit ]]; then
  /usr/local/hermit/hermit init --no-git --sources env:///hermit-packages /workspace/.config/hermit >/dev/null
fi

if [[ $# -eq 0 ]]; then
  exec bash
fi

exec "$@"
