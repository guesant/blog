#!/usr/bin/env bash
set -euo pipefail

expected_node="$(tr -d '[:space:]' < .nvmrc)"
actual_node="$(node --version | sed 's/^v//')"
[[ "$actual_node" == "$expected_node" ]] || {
  echo "Node mismatch: expected $expected_node, got $actual_node" >&2
  exit 1
}

node -e 'const p=require("./package.json"); if (p.engines.node !== ">=24.18.0 <25") process.exit(1); if (p.packageManager !== "pnpm@11.17.0+sha512.cca3cea332ad254bb84145f966d19f4879615210346fc92c79a047f23a0d7b3cca3c3792f0076ba1f1831d277efbcf0a9119b31a9a60eca7fb3d6231f331ef72") process.exit(1)'
pnpm --version | grep -qx '11.17.0'
moon --version | grep -qx 'moon 2.4.6'
