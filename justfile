set shell := ["bash", "-uc"]
set positional-arguments

env_file := if path_exists(".env") == "true" { " --env-file .env" } else { "" }
compose := "docker compose" + env_file + " -f .docker/compose.yaml"
compose_dev := compose + " -f .docker/compose.dev.yaml"
tools_compose := "docker compose" + env_file + " -f .tools/docker/compose.yaml"
tools_run := tools_compose + " run --rm tools sh -lc"
compose_run := compose + " run --build --rm"
node_run := compose_run + " --no-deps start sh -lc"
prettier_flags := "--config ../../.config/prettierrc.json --ignore-path ../../.config/prettierignore"
prettier_globs := '"**/*.{css,js,jsx,ts,tsx,json,md}"'
actionlint_image := `grep -oE "rhysd/actionlint:[0-9.]+" .github/workflows/lint-actions.yml | head -1`
zizmor_version := `grep -oE 'version: "[0-9.]+"' .github/workflows/lint-actions.yml | grep -oE "[0-9.]+" | head -1`

default: status

status:
    {{compose}} ps

up:
    {{compose}} up --build -d laravel start

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
    just frontend-node-modules-init
    {{node_run}} 'corepack pnpm install --frozen-lockfile --ignore-scripts'

frontend-node-modules-init:
    {{compose_run}} --no-deps start-node-modules-init

api-spec:
    {{compose_run}} --no-deps -e DB_CONNECTION=unavailable -e CACHE_STORE=array -e SESSION_DRIVER=array -e QUEUE_CONNECTION=sync laravel php artisan scramble:export --path=/app/openapi/public-site.json

api-generate: api-spec
    {{tools_compose}} run --build --rm openapi-ts -f openapi-ts.config.mjs

api-check: api-spec
    {{tools_compose}} run --build --rm --entrypoint sh openapi-ts -lc 'rm -rf /tmp/generated && PORTFOLIO_API_GENERATED_OUTPUT=/tmp/generated /opt/openapi-ts/node_modules/.bin/openapi-ts -f openapi-ts.config.mjs && diff -ru src/data/api/generated /tmp/generated'

frontend-lint: frontend-install frontend-architecture
    {{node_run}} 'corepack pnpm lint'

frontend-lint-fix: frontend-install frontend-architecture
    {{node_run}} 'corepack pnpm lint:fix'

frontend-architecture: frontend-install tools-build
    {{node_run}} 'corepack pnpm lint:architecture:test'
    {{tools_compose}} run --rm ast-grep test --config /workspace/src/public-app/sgconfig.yml
    {{tools_compose}} run --rm ast-grep scan --config /workspace/src/public-app/sgconfig.yml /workspace/src/public-app/src

frontend-typecheck: frontend-install
    {{node_run}} './node_modules/.bin/tsc --noEmit'

frontend-check: frontend-lint frontend-typecheck

frontend-complexity: tools-build
    {{tools_compose}} run --rm lizard -l typescript -C 5 -L 35 -a 3 -w -x '*/generated/*' /workspace/src/public-app/src

frontend-dead-code: frontend-install
    {{node_run}} 'corepack pnpm dead-code'

frontend-build: frontend-install
    {{node_run}} 'corepack pnpm build'

public-site-benchmark:
    just frontend-install
    {{compose_run}} --no-deps \
        -e PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-http://laravel:8000/api/v1/site/chrome?locale=en}" \
        -e PUBLIC_SITE_RUNS="${PUBLIC_SITE_RUNS:-20}" \
        -e PUBLIC_SITE_CONCURRENCY="${PUBLIC_SITE_CONCURRENCY:-4}" \
        start sh -lc 'node audits/benchmark-public-site.mjs'

build: frontend-build

ci: check

action-test:
    {{node_run}} 'node --test ../../.github/actions/push-profile/test/*.test.mjs'

laravel-check:
    if [[ "${CI:-}" == "true" ]]; then {{compose_run}} -v "$PWD/src/laravel/.env.example:/app/.env:ro" laravel php artisan migrate --force; fi
    {{compose_run}} -v "$PWD/src/laravel/.env.example:/app/.env:ro" laravel php artisan migrate:status
    {{compose_run}} -v "$PWD/src/laravel/.env.example:/app/.env:ro" laravel ./vendor/bin/pint --test
    {{compose_run}} -v "$PWD/src/laravel/.env.example:/app/.env:ro" laravel php -d memory_limit=512M vendor/bin/phpunit --configuration phpunit.xml

check: tools-build format api-check frontend-lint frontend-typecheck frontend-complexity frontend-dead-code duplication local-links repository-lint security quality-report lint-actions action-test laravel-check frontend-build

format: frontend-install tools-build
    {{node_run}} 'corepack pnpm format'
    {{tools_run}} 'shfmt -i 2 -ci -d .tools/scripts src/laravel/scripts src/laravel/docker .docker src/public-app/audits'

format-fix: frontend-install tools-build
    {{node_run}} 'corepack pnpm format:fix'
    {{tools_run}} 'shfmt -i 2 -ci -w .tools/scripts src/laravel/scripts src/laravel/docker .docker src/public-app/audits'

lint: frontend-check

duplication: tools-build
    {{tools_compose}} run --rm jscpd --config /workspace/src/public-app/.jscpd.json /workspace/src/public-app
    {{tools_compose}} run --rm jscpd --config /workspace/src/public-app/.jscpd.actions.json /workspace/.github/actions

local-links: tools-build
    {{tools_compose}} run --rm lychee --offline --include-fragments --root-dir /workspace /workspace/README.md /workspace/AGENTS.md /workspace/SECURITY.md /workspace/.github/actions/push-profile/README.md /workspace/src/public-app/README.md /workspace/src/laravel/README.md /workspace/src/laravel/SECURITY.md

repository-lint: tools-build
    {{tools_compose}} run --rm yamllint -c /workspace/.yamllint.yml /workspace/.github /workspace/.docker /workspace/.tools /workspace/.deploy
    {{tools_compose}} run --rm hadolint --config /workspace/.hadolint.yaml .docker/*.Dockerfile .tools/docker/*.Dockerfile src/laravel/docker/*.Dockerfile
    {{tools_compose}} run --rm shellcheck .tools/scripts/*.sh src/laravel/scripts/*.sh src/laravel/docker/*.sh

security: tools-build
    {{tools_compose}} run --rm gitleaks detect --source=/workspace --log-opts='-1' --redact --no-banner
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/.github
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/.tools
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/.docker
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/.deploy
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/src/public-app/src
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/src/laravel/app
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/src/laravel/config
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/src/laravel/routes
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/src/laravel/docker
    {{tools_compose}} run --rm gitleaks dir --redact --no-banner /workspace/src/laravel/scripts
    {{tools_compose}} run --rm osv-scanner scan source --recursive /workspace/src/public-app /workspace/src/laravel
    {{tools_compose}} run --rm trivy fs --no-progress --scanners vuln,secret --severity CRITICAL,HIGH --exit-code 1 --skip-dirs /workspace/src/public-app/node_modules --skip-dirs /workspace/src/public-app/dist --skip-dirs /workspace/src/laravel/node_modules --skip-dirs /workspace/src/laravel/vendor --skip-files '**/*.dockerignore' /workspace
    {{tools_compose}} run --rm semgrep scan --config auto --error --exclude 'node_modules/**' --exclude 'dist/**' /workspace/src/public-app/src /workspace/src/laravel/app /workspace/src/laravel/config /workspace/src/laravel/routes

quality-report: tools-build
    {{tools_compose}} run --rm qlty check --all --no-cache --no-upgrade-check || true
    {{tools_compose}} run --rm scorecard --local /workspace || true

audit: frontend-build frontend-install
    {{node_run}} 'corepack pnpm audit:routes'
    {{compose}} run --build --rm lighthouse sh -lc 'corepack pnpm audit:performance'
    {{tools_run}} 'sh /workspace/.tools/scripts/verify-supply-chain.sh'

tools-build:
    test -n "${PORTFOLIO_TOOLS_PREBUILT:-}" || {{tools_compose}} build tools openapi-ts ast-grep jscpd lychee lizard yamllint shellcheck actionlint zizmor hadolint gitleaks osv-scanner trivy semgrep qlty scorecard

db-migration name:
    {{compose}} up --build -d --wait postgres
    just db-backup
    {{compose_run}} laravel php artisan make:migration {{name}}

db-update:
    {{compose}} up --build -d --wait postgres
    just db-backup
    {{compose_run}} laravel php artisan migrate --force

db-backup:
    #!/usr/bin/env sh
    set -eu
    mkdir -p data/snapshots
    file="data/snapshots/portfolio-$(date -u +%Y%m%dT%H%M%SZ).dump"
    {{compose}} exec -T postgres pg_dump -U portfolio -Fc portfolio > "$file"
    echo "wrote $file"

db-restore file:
    {{compose}} up --build -d --wait postgres
    cat "{{file}}" | {{compose}} exec -T postgres pg_restore -U portfolio -d portfolio --clean --if-exists

start:
    {{compose}} up -d start

start-logs:
    {{compose}} logs -f --tail=100 start

lint-actions:
    {{tools_compose}} run --rm actionlint -color .github/workflows/*.yml
    {{tools_compose}} run --rm zizmor --no-progress /workspace/.github/workflows
