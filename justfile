set shell := ["bash", "-uc"]
set positional-arguments


toolchain_image := "portfolio-toolchain:local"
workspace := `pwd`

compose := "docker compose -f compose.yaml"
compose_dev := "docker compose -f compose.yaml -f compose.dev.yaml"
compose_pg := compose_dev + " -f compose.postgres.yaml"
docker_run := compose + " run --rm --user 0 --entrypoint sh web -lc"
playwright_image := "mcr.microsoft.com/playwright@sha256:5b8f294aff9041b7191c34a4bab3ac270157a28774d4b0660e9743297b697e48"
harness_docker := "docker run --rm --user 1000:1000 --add-host host.docker.internal:host-gateway -e HOME=/tmp -v \"" + justfile_directory() + "/Portfolio/Portfolio.Blazor.LayoutAudit:/tmp/harness\" -w /tmp/harness " + playwright_image
harness_setup := "cp /tmp/harness/package.json /tmp/harness/package-lock.json /tmp/ && (cd /tmp && npm ci --no-audit --no-fund) && "

default: status

status:
    {{compose}} ps

up:
    {{compose}} up -d web

dev:
    {{compose_dev}} up -d web

dev-postgres:
    {{compose_pg}} up -d --wait postgres
    {{compose_pg}} up -d web

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

watch:
    {{compose_dev}} up -d web

build:
    {{docker_run}} 'dotnet build Portfolio.Blazor.slnx --configuration Release --no-restore'

restore:
    {{compose}} run --rm --entrypoint sh web -lc 'dotnet restore Portfolio.Blazor.slnx --locked-mode'

test:
    {{docker_run}} 'dotnet run --project Portfolio/Portfolio.Blazor.Core.Tests/Portfolio.Blazor.Core.Tests.csproj --configuration Release --no-build'

test-data:
    {{docker_run}} 'dotnet run --project Portfolio/Portfolio.Blazor.Data.Tests/Portfolio.Blazor.Data.Tests.csproj --configuration Release --no-build'

test-data-postgres:
    {{compose_pg}} up -d --wait postgres
    {{compose_pg}} run --rm -e NUGET_PACKAGES=/src/.nuget-cache --entrypoint sh web -lc 'cd /src && dotnet run --project Portfolio/Portfolio.Blazor.Data.Tests/Portfolio.Blazor.Data.Tests.csproj --no-restore'

check: format lint comments duplication duplication-razor build test test-data audit schema tokens ui-imports resx-keys hardcoded-text

format:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'FORMAT_CHECK=1 node tools/scripts/format-csharp-statements.mjs && FORMAT_CHECK=1 node tools/scripts/format-csharp-arguments.mjs && FORMAT_CHECK=1 node tools/scripts/format-razor.mjs && FORMAT_CHECK=1 node tools/scripts/format-razor-attributes.mjs'
    {{docker_run}} 'dotnet tool restore >/dev/null && HOME=/tmp dotnet csharpier check Portfolio'
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'npx --yes prettier@3.4.2 --cache --cache-location /tmp/prettier-cache --check "Portfolio/Portfolio.Blazor*/**/*.{css,js,ts,html}" "tools/scripts/*.mjs"'
    docker run --rm -v "${PWD}:/workspace:ro" -w /workspace mvdan/shfmt:v3 -i 4 -ci -d tools/scripts

format-fix:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'node tools/scripts/format-csharp-statements.mjs && node tools/scripts/format-csharp-arguments.mjs && node tools/scripts/format-razor.mjs && node tools/scripts/format-razor-attributes.mjs'
    {{docker_run}} 'dotnet tool restore >/dev/null && HOME=/tmp dotnet csharpier format Portfolio'
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'npx --yes prettier@3.4.2 --cache --cache-location /tmp/prettier-cache --write "Portfolio/Portfolio.Blazor*/**/*.{css,js,ts,html}" "tools/scripts/*.mjs"'
    docker run --rm -v "${PWD}:/workspace" -w /workspace mvdan/shfmt:v3 -i 4 -ci -w tools/scripts

lint:
    {{docker_run}} 'dotnet format Portfolio.Blazor.slnx analyzers --verify-no-changes --no-restore --severity warn --verbosity minimal && dotnet build Portfolio.Blazor.slnx --configuration Release --no-restore --nologo'

comments:
    {{docker_run}} 'sh /src/tools/scripts/verify-csharp-comments.sh'

duplication:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'mkdir -p /tmp/quality-tools && cp tools/quality-tools/package.json tools/quality-tools/package-lock.json /tmp/quality-tools/ && npm ci --prefix /tmp/quality-tools --ignore-scripts --no-audit --no-fund >/dev/null && /tmp/quality-tools/node_modules/.bin/jscpd --config jscpd.json --format csharp'

duplication-razor:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'mkdir -p /tmp/quality-tools && cp tools/quality-tools/package.json tools/quality-tools/package-lock.json /tmp/quality-tools/ && npm ci --prefix /tmp/quality-tools --ignore-scripts --no-audit --no-fund >/dev/null && /tmp/quality-tools/node_modules/.bin/jscpd --config jscpd.json --format razor'

component-complexity:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa node tools/scripts/component-complexity.mjs check

component-weight-report:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa node tools/scripts/component-complexity.mjs weight-report

schema:
    {{docker_run}} 'sh /src/tools/scripts/verify-schema.sh'

db-migration name provider="sqlite":
    {{ if provider == "postgres" { compose_pg } else { compose_dev } }} run --rm -e NUGET_PACKAGES=/src/.nuget-cache --entrypoint sh web -lc 'cd /src && dotnet tool restore >/dev/null && dotnet tool run dotnet-ef migrations add {{name}} --project Portfolio/{{ if provider == "postgres" { "Portfolio.Blazor.Database.Postgres/Portfolio.Blazor.Database.Postgres.csproj" } else { "Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj" } }} --startup-project Portfolio/{{ if provider == "postgres" { "Portfolio.Blazor.Database.Postgres/Portfolio.Blazor.Database.Postgres.csproj" } else { "Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj" } }} --context PortfolioAdminDbContext'

db-update provider="sqlite":
    {{ if provider == "postgres" { compose_pg + " up -d --wait postgres" } else { "true" } }}
    {{ if provider == "postgres" { compose_pg } else { compose_dev } }} run --rm -e NUGET_PACKAGES=/src/.nuget-cache --entrypoint sh web -lc 'cd /src && dotnet tool restore >/dev/null && PORTFOLIO_SQLITE_PATH=/data/db/portfolio.sqlite dotnet tool run dotnet-ef database update --project Portfolio/{{ if provider == "postgres" { "Portfolio.Blazor.Database.Postgres/Portfolio.Blazor.Database.Postgres.csproj" } else { "Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj" } }} --startup-project Portfolio/{{ if provider == "postgres" { "Portfolio.Blazor.Database.Postgres/Portfolio.Blazor.Database.Postgres.csproj" } else { "Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj" } }} --context PortfolioAdminDbContext'

tokens:
    {{docker_run}} 'sh /src/tools/scripts/verify-design-tokens.sh'

ui-imports:
    {{docker_run}} 'sh /src/tools/scripts/verify-ui-imports.sh'

resx-keys:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'node tools/scripts/verify-resx-keys.mjs'

resx-keys-fix:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'FIX=1 node tools/scripts/verify-resx-keys.mjs'

hardcoded-text:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'node tools/scripts/verify-hardcoded-text.mjs'

verify-stories:
    {{docker_run}} 'sh /src/tools/scripts/verify-stories.sh'

composition:
    {{docker_run}} 'sh /src/tools/scripts/verify-composition.sh'

audit:
    {{docker_run}} 'sh /src/tools/scripts/verify-supply-chain.sh && sh /src/tools/scripts/verify-readonly-runtime.sh && sh /src/tools/scripts/verify-admin-guard.sh && sh /src/tools/scripts/verify-hidden-content.sh'

parity:
    {{compose}} exec -T web sh -lc 'sh /src/tools/scripts/verify-structural-parity.sh http://127.0.0.1:8080'

shell:
    {{compose}} exec web sh

stories:
    {{compose_dev}} run --rm -p 8081:8081 -e NUGET_PACKAGES=/src/.nuget-cache -e ASPNETCORE_URLS=http://0.0.0.0:8081 web sh -lc 'dotnet watch --project Portfolio/Portfolio.Blazor.Stories/Portfolio.Blazor.Stories.csproj --no-launch-profile --no-restore --non-interactive --no-hot-reload -- --urls http://0.0.0.0:8081'

stories-refresh:
    touch Portfolio/Portfolio.Blazor.Stories/_Imports.razor

vrt: (_vrt "npm test")

vrt-update: (_vrt "npm run snapshots:update")

_vrt npm_command:
    #!/usr/bin/env sh
    set -eu
    docker rm -f blazor-stories-vrt >/dev/null 2>&1 || true
    {{compose_dev}} run -d --rm --name blazor-stories-vrt -p 8081:8081 -e NUGET_PACKAGES=/src/.nuget-cache -e ASPNETCORE_URLS=http://0.0.0.0:8081 web sh -lc 'dotnet run --project Portfolio/Portfolio.Blazor.Stories/Portfolio.Blazor.Stories.csproj --no-restore --urls http://0.0.0.0:8081' >/dev/null
    trap 'docker rm -f blazor-stories-vrt >/dev/null 2>&1 || true' EXIT
    i=0
    while ! curl -sf http://localhost:8081/ >/dev/null 2>&1; do
        i=$((i + 1))
        if [ "$i" -ge 90 ]; then
            echo "stories server did not start on :8081" >&2
            exit 1
        fi
        sleep 1
    done
    docker run --rm --user 1000:1000 --add-host host.docker.internal:host-gateway -e HOME=/tmp -v "{{justfile_directory()}}/Portfolio/Portfolio.Blazor.Stories.VRT:/workspace" -w /workspace {{playwright_image}} sh -lc 'npm ci --no-audit --no-fund && {{npm_command}}'

_require-dev-server:
    #!/usr/bin/env sh
    set -eu
    curl -sf http://localhost:8080/ >/dev/null || {
        echo "the dev server is not reachable at http://localhost:8080 (run 'just up' or 'just dev' first)" >&2
        exit 1
    }

layout-audit: _require-dev-server
    {{harness_docker}} sh -lc '{{harness_setup}}npm test'

audit-a11y: _require-dev-server
    {{harness_docker}} sh -lc '{{harness_setup}}npm run audit:a11y'

audit-lighthouse: _require-dev-server
    {{harness_docker}} sh -lc '{{harness_setup}}npm run audit:lighthouse'

audit-seo: _require-dev-server
    {{harness_docker}} sh -lc '{{harness_setup}}npm run audit:seo'

audit-all:
    #!/usr/bin/env sh
    set -eu
    curl -sf http://localhost:8080/ >/dev/null || {
        echo "the dev server is not reachable at http://localhost:8080 (run 'just up' or 'just dev' first)" >&2
        exit 1
    }
    recipes="layout-audit audit-a11y audit-seo composition duplication-razor"
    overall=0
    summary=""
    for recipe in $recipes; do
        echo "=== $recipe ==="
        log=$(mktemp)
        if just "$recipe" >"$log" 2>&1; then
            status="pass"
        else
            status="FAIL"
            overall=1
        fi
        tail -n 20 "$log"
        rm -f "$log"
        summary=$(printf '%s\n%s:%s' "$summary" "$recipe" "$status")
    done
    echo ""
    echo "=== summary ==="
    printf '%s\n' "$summary" | sed '/^$/d' | sed 's/^/  /'
    echo ""
    echo "note: just audit-lighthouse is slower and not included here, run it separately"
    exit $overall

# The workspace toolchain: Hermit-pinned tools, Moon, and the shared quality
# gates that apply to any code in the repository.
_ensure-docker:
    @command -v docker >/dev/null 2>&1 || { echo 'Docker is required; install it before using this recipe.' >&2; exit 1; }
    @docker info >/dev/null 2>&1 || { echo 'Docker is unavailable; start Docker before using this recipe.' >&2; exit 1; }

_ensure-image: _ensure-docker
    docker build --file .devcontainer/toolchain/Containerfile --target browser --tag {{ toolchain_image }} .

_toolchain *args: _ensure-image
    command=("$@"); \
    docker run --rm --init \
      --env HOME=/var/cache/hermit \
      --env PNPM_HOME=/var/cache/pnpm/home \
      --env PLAYWRIGHT_BROWSERS_PATH=/var/cache/playwright \
      --env TECTONIC_CACHE_DIR=/var/cache/tectonic \
      --env TECTONIC_BUNDLE=https://data1.fullyjustified.net/tlextras-2022.0r0.tar \
      --env MOON_CACHE_DIR=/var/cache/moon \
      --env MOON_TOOLCHAIN_FORCE_GLOBALS=true \
      --env PORTFOLIO_PDF_COMPILER=/workspace/tools/pdf/compile.sh \
      --volume "{{ workspace }}:/workspace" \
      --volume portfolio-hermit:/var/cache/hermit \
      --volume portfolio-pnpm:/var/cache/pnpm \
      --volume portfolio-node-modules:/workspace/node_modules \
      --volume portfolio-moon:/var/cache/moon \
      --volume portfolio-playwright:/var/cache/playwright \
      --volume portfolio-tectonic:/var/cache/tectonic \
      --volume portfolio-quality:/workspace/tools/quality/.venv \
      --workdir /workspace \
      {{ toolchain_image }} "${command[@]}"

_toolchain-ports *args: _ensure-image
    command=("$@"); \
    docker run --rm --init \
      --publish 3000:3000 \
      --publish 127.0.0.1:4001:4001 \
      --publish 127.0.0.1:9000:9000 \
      --publish 127.0.0.1:4100:4100 \
      --env HOME=/var/cache/hermit \
      --env PNPM_HOME=/var/cache/pnpm/home \
      --env PLAYWRIGHT_BROWSERS_PATH=/var/cache/playwright \
      --env TECTONIC_CACHE_DIR=/var/cache/tectonic \
      --env TECTONIC_BUNDLE=https://data1.fullyjustified.net/tlextras-2022.0r0.tar \
      --env MOON_CACHE_DIR=/var/cache/moon \
      --env MOON_TOOLCHAIN_FORCE_GLOBALS=true \
      --env PORTFOLIO_PDF_COMPILER=/workspace/tools/pdf/compile.sh \
      --env CHOKIDAR_USEPOLLING=true \
      --env WATCHPACK_POLLING=true \
      --volume "{{ workspace }}:/workspace" \
      --volume portfolio-hermit:/var/cache/hermit \
      --volume portfolio-pnpm:/var/cache/pnpm \
      --volume portfolio-node-modules:/workspace/node_modules \
      --volume portfolio-moon:/var/cache/moon \
      --volume portfolio-playwright:/var/cache/playwright \
      --volume portfolio-tectonic:/var/cache/tectonic \
      --volume portfolio-quality:/workspace/tools/quality/.venv \
      --workdir /workspace \
      {{ toolchain_image }} "${command[@]}"

_install:
    just _toolchain bash -c 'printf "y\ny\n" | script -qefc ".config/hermit/bin/hermit install --quiet moon-2.4.6 node-24.18.0 pnpm-11.17.0" /dev/null && pnpm install --frozen-lockfile'

_install-quality: _install
    just _toolchain bash -c 'printf "y\ny\n" | script -qefc ".config/hermit/bin/hermit install --quiet actionlint-1.7.12 shellcheck-0.11.0 qlty-0.640.0 zizmor-1.29.0 uv-0.12.1" /dev/null'

_install-pdf: _install
    just _toolchain bash -c 'printf "y\ny\n" | script -qefc ".config/hermit/bin/hermit install --quiet tectonic-0.16.9 tectonic-bundle-2022.0r0" /dev/null'

workspace-install: _install

workspace-check: _install-quality
    just _toolchain bash -c 'MOON_TOOLCHAIN_FORCE_GLOBALS=true moon exec ":#check" --on-failure continue'

workspace-format: _install
    just _toolchain bash -c 'moon run workspace:format'

workspace-ci: workspace-check

workspace-clean: _ensure-docker
    docker run --rm --volume "{{ workspace }}:/workspace" --workdir /workspace {{ toolchain_image }} bash -c 'rm -rf .config/moon/cache tools/quality/.venv'

workspace-cache-clean: _ensure-docker
    for volume in portfolio-hermit portfolio-pnpm portfolio-node-modules portfolio-moon portfolio-playwright portfolio-tectonic portfolio-quality; do docker volume inspect "$volume" >/dev/null 2>&1 && docker volume rm "$volume" || true; done

workspace-moon *args: _install
    just _toolchain bash -c 'moon {{ args }}'
