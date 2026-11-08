#!/usr/bin/env bash
set -euo pipefail

mkdir -p .local/reports/sarif
status=0

run() {
  if ! "$@"; then
    status=1
  fi
}

run bash .config/check-shell.sh
run actionlint .github/workflows/*.yml
run zizmor --format sarif .github/workflows >.local/reports/sarif/zizmor.sarif
run yamllint -c .config/yamllint.yml .config .github
run ast-grep test --config .config/ast-grep/sgconfig.yml
run markdownlint-cli2 --config .config/.markdownlint-cli2.jsonc README.md AGENTS.md 'docs/**/*.md'

for path in .github .config .docker scripts README.md AGENTS.md; do
  name=${path//\//-}
  run gitleaks dir --redact=100 --no-banner --report-format sarif --report-path ".local/reports/sarif/gitleaks-$name.sarif" "$path"
done

run ast-grep scan --config .config/ast-grep/sgconfig.yml --globs '!.config/ast-grep/tests/**' .github .config .docker scripts
run hadolint --config .config/hadolint.yaml .docker/Dockerfile

run stylelint --config-basedir /opt/tools/stylelint 'assets/css/**/*.css'
run jscpd --min-lines 5 --min-tokens 50 --threshold 0 --reporters console --skip-comments --ignore '**/test-*.*,**/fixtures/**,**/node_modules/**' scripts .config/*.py .config/*.sh
run bash .config/tool-sboms.sh
run bash .config/check-osv.sh
exit "$status"
