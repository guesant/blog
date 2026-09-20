set shell := ["bash", "-uc"]
set positional-arguments

env_file := if path_exists(".env") == "true" { " --env-file .env" } else { "" }
compose := "docker compose" + env_file + " -f .docker/compose.yaml"
compose_dev := compose + " -f .docker/compose.dev.yaml"
tools_compose := "docker compose" + env_file + " -f .tools/docker/compose.yaml"
tools_run := tools_compose + " run --rm tools sh -lc"
node_run := compose + " run --rm --no-deps start sh -lc"
prettier_flags := "--config ../../.config/prettierrc.json --ignore-path ../../.config/prettierignore"
prettier_globs := '"**/*.{css,js,jsx,ts,tsx,json,md}"'
actionlint_image := `grep -oE "rhysd/actionlint:[0-9.]+" .github/workflows/lint-actions.yml | head -1`
zizmor_version := `grep -oE 'version: "[0-9.]+"' .github/workflows/lint-actions.yml | grep -oE "[0-9.]+" | head -1`

default: status

status:
    {{compose}} ps

up:
    {{compose}} up -d laravel start

dev: up

dev-logs:
    {{compose}} logs -f --tail=100 laravel start

dev-restart:
    {{compose}} restart laravel start

dev-stop:
    {{compose}} stop laravel start

dev-status:
    {{compose}} ps laravel start

down:
    {{compose}} down

restart: dev-restart

logs: dev-logs

shell:
    {{compose}} exec start sh

frontend-install:
    {{node_run}} 'corepack pnpm install --frozen-lockfile --ignore-scripts'

frontend-lint: frontend-install frontend-architecture
    {{node_run}} 'corepack pnpm lint'

frontend-architecture: frontend-install tools-build
    {{node_run}} 'corepack pnpm lint:architecture:test'
    {{tools_compose}} run --rm ast-grep test --config /workspace/src/public-app/sgconfig.yml
    {{tools_compose}} run --rm ast-grep scan --config /workspace/src/public-app/sgconfig.yml /workspace/src/public-app/src

frontend-check: frontend-lint
    {{node_run}} './node_modules/.bin/tsc --noEmit'

frontend-complexity: tools-build
    {{tools_compose}} run --rm lizard -l typescript -C 10 -L 60 -a 3 -w -x '*/generated/*' -x '*/knowledge-map-content/*' /workspace/src/public-app/src

frontend-dead-code: frontend-install
    {{node_run}} 'corepack pnpm dead-code'

frontend-build: frontend-install
    {{node_run}} 'corepack pnpm build'

action-test:
    {{node_run}} 'node --test ../../.github/actions/push-profile/test/*.test.mjs'

laravel-check:
    {{compose}} run --rm laravel php artisan migrate:status
    {{compose}} run --rm laravel ./vendor/bin/pint --test
    {{compose}} run --rm laravel php artisan test

check: tools-build format frontend-check frontend-complexity frontend-dead-code duplication repository-lint security quality-report audit lint-actions action-test laravel-check frontend-build

format: frontend-install tools-build
    {{node_run}} 'corepack pnpm exec prettier {{prettier_flags}} --check {{prettier_globs}}'
    {{tools_run}} 'shfmt -i 4 -ci -d .tools/scripts'

format-fix: frontend-install tools-build
    {{node_run}} 'corepack pnpm exec prettier {{prettier_flags}} --write {{prettier_globs}}'
    {{tools_run}} 'shfmt -i 4 -ci -w .tools/scripts'

lint: frontend-check

duplication: tools-build
    {{tools_compose}} run --rm jscpd --config /workspace/src/public-app/.jscpd.json /workspace/src/public-app/src
    {{tools_compose}} run --rm jscpd --config /workspace/src/public-app/.jscpd.actions.json /workspace/.github/actions

repository-lint: tools-build
    {{tools_compose}} run --rm yamllint -c /workspace/.yamllint.yml /workspace/.github /workspace/.docker /workspace/.tools /workspace/.deploy
    {{tools_compose}} run --rm hadolint --config /workspace/.hadolint.yaml .docker/Dockerfile .docker/tools.Dockerfile .tools/docker/Dockerfile src/laravel/docker/*.Dockerfile
    {{tools_compose}} run --rm shellcheck .tools/scripts/*.sh src/laravel/scripts/*.sh src/laravel/docker/*.sh

security: tools-build
    {{tools_compose}} run --rm gitleaks detect --source=/workspace --redact --no-banner
    {{tools_compose}} run --rm osv-scanner scan source --recursive /workspace/src/public-app /workspace/src/laravel
    {{tools_compose}} run --rm trivy fs --no-progress --scanners vuln,secret,misconfig --severity CRITICAL,HIGH --exit-code 1 /workspace
    {{tools_compose}} run --rm semgrep scan --config auto --error --exclude 'node_modules/**' --exclude 'dist/**' /workspace/src/public-app/src /workspace/src/laravel/app /workspace/src/laravel/config /workspace/src/laravel/routes

quality-report: tools-build
    {{tools_compose}} run --rm qlty check --all || true
    {{tools_compose}} run --rm scorecard --local /workspace || true

audit:
    {{tools_run}} 'sh /src/.tools/scripts/verify-supply-chain.sh'

tools-build:
    test -n "${PORTFOLIO_TOOLS_PREBUILT:-}" || {{tools_compose}} build tools ast-grep jscpd lizard yamllint shellcheck actionlint zizmor hadolint gitleaks osv-scanner trivy semgrep qlty scorecard

db-migration name:
    {{compose}} up -d --wait postgres
    just db-backup
    {{compose}} run --rm laravel php artisan make:migration {{name}}

db-update:
    {{compose}} up -d --wait postgres
    just db-backup
    {{compose}} run --rm laravel php artisan migrate --force

db-backup:
    #!/usr/bin/env sh
    set -eu
    mkdir -p data/snapshots
    file="data/snapshots/portfolio-$(date -u +%Y%m%dT%H%M%SZ).dump"
    {{compose}} exec -T postgres pg_dump -U portfolio -Fc portfolio > "$file"
    echo "wrote $file"

db-restore file:
    {{compose}} up -d --wait postgres
    cat "{{file}}" | {{compose}} exec -T postgres pg_restore -U portfolio -d portfolio --clean --if-exists

start:
    {{compose}} up -d start

start-logs:
    {{compose}} logs -f --tail=100 start

lint-actions:
    {{tools_compose}} run --rm actionlint -color .github/workflows/*.yml
    {{tools_compose}} run --rm zizmor --no-progress /workspace/.github/workflows
