#!/usr/bin/env bash
set -euo pipefail

fixture_output="$(mktemp -d)"
trap 'rm -r -- "$fixture_output"' EXIT
hugo --contentDir tests/fixtures --destination "$fixture_output" --buildDrafts --buildFuture --buildExpired --minify
test -s "$fixture_output/lobby.json"
grep -q 'fixture-public' "$fixture_output/lobby.json"
! grep -q 'fixture-private\|fixture-disabled\|fixture-draft\|fixture-future\|fixture-expired' "$fixture_output/lobby.json"
grep -q '"type":"case"' "$fixture_output/lobby.json"
