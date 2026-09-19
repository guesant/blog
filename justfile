set shell := ["bash", "-uc"]
set positional-arguments


env_file := if path_exists(".env") == "true" { " --env-file .env" } else { "" }
compose := "docker compose" + env_file + " -f .docker/compose.yaml"
compose_dev := compose + " -f .docker/compose.dev.yaml"
docker_run := compose + " run --rm --entrypoint sh web -lc"
tools_run := compose_dev + " run --rm tools sh -lc"
node_image := "node:24.18-bookworm-slim"
node_run := "docker run --rm -v " + justfile_directory() + ":/workspace -w /workspace " + node_image + " sh -lc"

dotnet_tools_restore := "dotnet tool restore >/dev/null"
prettier_flags := "--config .config/prettierrc.json --ignore-path .config/prettierignore --ignore-path .gitignore"
prettier_globs := '"src/Blog/Blog.Blazor*/**/*.{css,js,ts,html}" "tools/scripts/*.mjs"'
actionlint_image := `grep -oE "rhysd/actionlint:[0-9.]+" .github/workflows/lint-actions.yml | head -1`
zizmor_version := `grep -oE 'version: "[0-9.]+"' .github/workflows/lint-actions.yml | grep -oE "[0-9.]+" | head -1`


default: status


status:
    {{compose}} ps

up:
    {{compose}} up -d web

dev:
    {{compose_dev}} up -d web

dev-logs:
    {{compose_dev}} logs -f --tail=100 web

dev-restart:
    {{compose_dev}} restart web

dev-stop:
    {{compose_dev}} stop web

dev-status:
    {{compose_dev}} ps web

down:
    {{compose}} down

restart:
    {{compose}} restart web

logs:
    {{compose}} logs -f web

shell:
    {{compose}} exec web sh


restore:
    {{docker_run}} 'dotnet restore src/Blog.Blazor.slnx --locked-mode'

build:
    {{docker_run}} 'dotnet build src/Blog.Blazor.slnx --configuration Release --no-restore'

test:
    {{docker_run}} 'dotnet run --project src/Blog/Blog.Blazor.Core.Tests/Blog.Blazor.Core.Tests.csproj --configuration Release --no-build'

test-data:
    {{docker_run}} 'dotnet run --project src/Blog/Blog.Blazor.Data.Tests/Blog.Blazor.Data.Tests.csproj --configuration Release --no-build'

popularity-refresh *args:
    {{docker_run}} 'dotnet run --project src/Blog/Blog.Blazor.Popularity/Blog.Blazor.Popularity.csproj --configuration Release --no-build -- {{args}}'


check: check-core check-data check-ui laravel-check frontend-check

check-core: tools-build \
    format \
    lint \
    comments \
    duplication \
    duplication-razor \
    build \
    test \
    audit

check-data: tools-build \
    build \
    test-data \
    schema

check-ui: tools-build \
    build \
    tokens \
    ui-imports \
    resx-keys \
    hardcoded-text \
    composition \
    verify-stories \
    vrt

tools-build:
    test -n "${PORTFOLIO_TOOLS_PREBUILT:-}" || {{compose_dev}} build tools

format:
    {{tools_run}} 'FORMAT_CHECK=1 node tools/scripts/format-razor.mjs'
    {{tools_run}} 'FORMAT_CHECK=1 node tools/scripts/format-razor-attributes.mjs'
    {{docker_run}} '{{dotnet_tools_restore}} && HOME=/tmp dotnet csharpier check src/Blog'
    {{tools_run}} 'prettier {{prettier_flags}} --check {{prettier_globs}}'
    {{tools_run}} 'shfmt -i 4 -ci -d tools/scripts'

format-fix:
    {{tools_run}} 'node tools/scripts/format-razor.mjs'
    {{tools_run}} 'node tools/scripts/format-razor-attributes.mjs'
    {{docker_run}} '{{dotnet_tools_restore}} && HOME=/tmp dotnet csharpier format src/Blog'
    {{tools_run}} 'prettier {{prettier_flags}} --write {{prettier_globs}}'
    {{tools_run}} 'shfmt -i 4 -ci -w tools/scripts'

lint:
    {{docker_run}} 'dotnet format src/Blog.Blazor.slnx analyzers --verify-no-changes --no-restore --severity warn --verbosity minimal'
    {{docker_run}} 'dotnet build src/Blog.Blazor.slnx --configuration Release --no-restore --nologo'

comments:
    {{docker_run}} 'sh /src/tools/scripts/verify-csharp-comments.sh'

duplication:
    {{tools_run}} 'jscpd --config .config/jscpd.json --format csharp'

duplication-razor:
    {{tools_run}} 'jscpd --config .config/jscpd.json --format razor'

schema:
    {{docker_run}} 'sh /src/tools/scripts/verify-schema.sh'

tokens:
    {{docker_run}} 'sh /src/tools/scripts/verify-design-tokens.sh'

ui-imports:
    {{docker_run}} 'sh /src/tools/scripts/verify-ui-imports.sh'

resx-keys:
    {{tools_run}} 'node tools/scripts/verify-resx-keys.mjs'

resx-keys-fix:
    {{tools_run}} 'FIX=1 node tools/scripts/verify-resx-keys.mjs'

hardcoded-text:
    {{tools_run}} 'node tools/scripts/verify-hardcoded-text.mjs'

verify-stories:
    {{docker_run}} 'sh /src/tools/scripts/verify-stories.sh'

composition:
    {{docker_run}} 'sh /src/tools/scripts/verify-composition.sh'

audit:
    {{docker_run}} 'sh /src/tools/scripts/verify-supply-chain.sh'
    {{docker_run}} 'sh /src/tools/scripts/verify-readonly-runtime.sh'
    {{docker_run}} 'sh /src/tools/scripts/verify-admin-guard.sh'
    {{docker_run}} 'sh /src/tools/scripts/verify-hidden-content.sh'


db-migration name:
    {{compose_dev}} up -d --wait postgres
    just db-backup
    {{compose_dev}} run --rm laravel php artisan make:migration {{name}}

db-update:
    {{compose_dev}} up -d --wait postgres
    just db-backup
    {{compose_dev}} run --rm laravel php artisan migrate --force

db-backup:
    #!/usr/bin/env sh
    set -eu
    mkdir -p data/snapshots
    file="data/snapshots/portfolio-$(date -u +%Y%m%dT%H%M%SZ).dump"
    {{compose_dev}} exec -T postgres pg_dump -U portfolio -Fc portfolio > "$file"
    echo "wrote $file"

db-restore file:
    {{compose_dev}} up -d --wait postgres
    cat "{{file}}" | {{compose_dev}} exec -T postgres pg_restore -U portfolio -d portfolio --clean --if-exists

laravel-check:
    {{compose_dev}} run --rm laravel php artisan migrate:status
    {{compose_dev}} run --rm laravel ./vendor/bin/pint --test
    {{compose_dev}} run --rm laravel php artisan test

frontend-install:
    {{node_run}} 'corepack pnpm install --frozen-lockfile --ignore-scripts'

frontend-check: frontend-install
    {{node_run}} 'corepack pnpm --filter @portfolio/content exec tsc --noEmit'
    {{node_run}} 'corepack pnpm --filter portfolio exec tsc --noEmit'

start:
    {{compose_dev}} up -d start

start-logs:
    {{compose_dev}} logs -f --tail=100 start

stories:
    {{compose_dev}} run --rm -p 8081:8081 -e NUGET_PACKAGES=/src/.nuget-cache -e ASPNETCORE_URLS=http://0.0.0.0:8081 web sh -lc \
        'dotnet watch --project src/Blog/Blog.Blazor.Stories/Blog.Blazor.Stories.csproj --no-launch-profile --no-restore --non-interactive --no-hot-reload -- --urls http://0.0.0.0:8081'

stories-refresh:
    touch src/Blog/Blog.Blazor.Stories/_Imports.razor

vrt: (_vrt "npm test")

vrt-update: (_vrt "npm run snapshots:update")

_vrt npm_command:
    #!/usr/bin/env sh
    set -eu
    trap '{{compose}} rm -sf stories >/dev/null 2>&1 || true' EXIT
    {{compose}} up -d stories
    if ! {{docker_run}} 'attempt=0
        until curl -sf http://stories:8081/index.html >/dev/null 2>&1; do
            attempt=$((attempt + 1))
            if [ "$attempt" -ge 150 ]; then
                echo "stories did not respond after $attempt attempts" >&2
                exit 1
            fi
            sleep 2
        done'; then
        {{compose}} logs --tail 100 --timestamps stories >&2 || true
        exit 1
    fi
    {{compose_dev}} run --rm playwright sh -lc 'npm ci --no-audit --no-fund && {{npm_command}}'

lint-actions:
    test -n "{{actionlint_image}}" || (echo "could not extract the actionlint image from lint-actions.yml" >&2 && exit 1)
    test -n "{{zizmor_version}}" || (echo "could not extract the zizmor version from lint-actions.yml" >&2 && exit 1)
    docker run --rm -v "{{justfile_directory()}}":/repo -w /repo --entrypoint sh {{actionlint_image}} \
        -c "actionlint -color .github/workflows/*.yml"
    docker run --rm -v "{{justfile_directory()}}":/repo -w /repo ghcr.io/zizmorcore/zizmor:{{zizmor_version}} \
        --no-progress /repo/.github/workflows
