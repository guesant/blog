set shell := ["bash", "-uc"]
set positional-arguments


compose := "docker compose -f compose.yaml"
compose_dev := "docker compose -f compose.yaml -f compose.dev.yaml"
compose_pg := compose_dev + " -f compose.postgres.yaml"
docker_run := compose + " run --rm --user 0 --entrypoint sh web -lc"
playwright_image := "mcr.microsoft.com/playwright@sha256:5b8f294aff9041b7191c34a4bab3ac270157a28774d4b0660e9743297b697e48"
harness_docker := "docker run --rm --user 1000:1000 --add-host host.docker.internal:host-gateway -e HOME=/tmp -v \"" + justfile_directory() + "/src/Portfolio/Portfolio.Blazor.LayoutAudit:/tmp/harness\" -w /tmp/harness " + playwright_image
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

build:
    {{docker_run}} 'dotnet build src/Portfolio.Blazor.slnx --configuration Release --no-restore'

restore:
    {{compose}} run --rm --entrypoint sh web -lc 'dotnet restore src/Portfolio.Blazor.slnx --locked-mode'

test:
    {{docker_run}} 'dotnet run --project src/Portfolio/Portfolio.Blazor.Core.Tests/Portfolio.Blazor.Core.Tests.csproj --configuration Release --no-build'

test-data:
    {{docker_run}} 'dotnet run --project src/Portfolio/Portfolio.Blazor.Data.Tests/Portfolio.Blazor.Data.Tests.csproj --configuration Release --no-build'

test-data-postgres:
    {{compose_pg}} up -d --wait postgres
    {{compose_pg}} run --rm -e NUGET_PACKAGES=/src/.nuget-cache --entrypoint sh web -lc 'cd /src && dotnet run --project src/Portfolio/Portfolio.Blazor.Data.Tests/Portfolio.Blazor.Data.Tests.csproj --no-restore'

check: format lint comments duplication duplication-razor build test test-data audit schema tokens ui-imports resx-keys hardcoded-text

format:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'FORMAT_CHECK=1 node tools/scripts/format-razor.mjs && FORMAT_CHECK=1 node tools/scripts/format-razor-attributes.mjs'
    {{docker_run}} 'dotnet tool restore >/dev/null && HOME=/tmp dotnet csharpier check src/Portfolio'
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'npx --yes prettier@3.4.2 --cache --cache-location /tmp/prettier-cache --check "src/Portfolio/Portfolio.Blazor*/**/*.{css,js,ts,html}" "tools/scripts/*.mjs"'
    docker run --rm -v "${PWD}:/workspace:ro" -w /workspace mvdan/shfmt:v3 -i 4 -ci -d tools/scripts

format-fix:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'node tools/scripts/format-razor.mjs && node tools/scripts/format-razor-attributes.mjs'
    {{docker_run}} 'dotnet tool restore >/dev/null && HOME=/tmp dotnet csharpier format src/Portfolio'
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'npx --yes prettier@3.4.2 --cache --cache-location /tmp/prettier-cache --write "src/Portfolio/Portfolio.Blazor*/**/*.{css,js,ts,html}" "tools/scripts/*.mjs"'
    docker run --rm -v "${PWD}:/workspace" -w /workspace mvdan/shfmt:v3 -i 4 -ci -w tools/scripts

lint:
    {{docker_run}} 'dotnet format src/Portfolio.Blazor.slnx analyzers --verify-no-changes --no-restore --severity warn --verbosity minimal && dotnet build src/Portfolio.Blazor.slnx --configuration Release --no-restore --nologo'

comments:
    {{docker_run}} 'sh /src/tools/scripts/verify-csharp-comments.sh'

duplication:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'mkdir -p /tmp/quality-tools && cp tools/quality-tools/package.json tools/quality-tools/package-lock.json /tmp/quality-tools/ && npm ci --prefix /tmp/quality-tools --ignore-scripts --no-audit --no-fund >/dev/null && /tmp/quality-tools/node_modules/.bin/jscpd --config jscpd.json --format csharp'

duplication-razor:
    docker run --rm --user 1000:1000 -v "${PWD}:/workspace:ro" -w /workspace node@sha256:6642ef280aebc09c4541bee0b15c9f89f0f3f3c247ddee79ae1d37eddfdcbbaa sh -lc 'mkdir -p /tmp/quality-tools && cp tools/quality-tools/package.json tools/quality-tools/package-lock.json /tmp/quality-tools/ && npm ci --prefix /tmp/quality-tools --ignore-scripts --no-audit --no-fund >/dev/null && /tmp/quality-tools/node_modules/.bin/jscpd --config jscpd.json --format razor'

schema:
    {{docker_run}} 'sh /src/tools/scripts/verify-schema.sh'

db-migration name provider="sqlite":
    {{ if provider == "postgres" { compose_pg } else { compose_dev } }} run --rm -e NUGET_PACKAGES=/src/.nuget-cache --entrypoint sh web -lc 'cd /src && dotnet tool restore >/dev/null && dotnet tool run dotnet-ef migrations add {{name}} --project src/Portfolio/{{ if provider == "postgres" { "Portfolio.Blazor.Database.Postgres/Portfolio.Blazor.Database.Postgres.csproj" } else { "Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj" } }} --startup-project src/Portfolio/{{ if provider == "postgres" { "Portfolio.Blazor.Database.Postgres/Portfolio.Blazor.Database.Postgres.csproj" } else { "Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj" } }} --context PortfolioAdminDbContext'

db-update provider="sqlite":
    {{ if provider == "postgres" { compose_pg + " up -d --wait postgres" } else { "true" } }}
    {{ if provider == "postgres" { compose_pg } else { compose_dev } }} run --rm -e NUGET_PACKAGES=/src/.nuget-cache --entrypoint sh web -lc 'cd /src && dotnet tool restore >/dev/null && PORTFOLIO_SQLITE_PATH=/data/db/portfolio.sqlite dotnet tool run dotnet-ef database update --project src/Portfolio/{{ if provider == "postgres" { "Portfolio.Blazor.Database.Postgres/Portfolio.Blazor.Database.Postgres.csproj" } else { "Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj" } }} --startup-project src/Portfolio/{{ if provider == "postgres" { "Portfolio.Blazor.Database.Postgres/Portfolio.Blazor.Database.Postgres.csproj" } else { "Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj" } }} --context PortfolioAdminDbContext'

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

shell:
    {{compose}} exec web sh

stories:
    {{compose_dev}} run --rm -p 8081:8081 -e NUGET_PACKAGES=/src/.nuget-cache -e ASPNETCORE_URLS=http://0.0.0.0:8081 web sh -lc 'dotnet watch --project src/Portfolio/Portfolio.Blazor.Stories/Portfolio.Blazor.Stories.csproj --no-launch-profile --no-restore --non-interactive --no-hot-reload -- --urls http://0.0.0.0:8081'

stories-refresh:
    touch src/Portfolio/Portfolio.Blazor.Stories/_Imports.razor

vrt: (_vrt "npm test")

vrt-update: (_vrt "npm run snapshots:update")

_vrt npm_command:
    #!/usr/bin/env sh
    set -eu
    docker rm -f blazor-stories-vrt >/dev/null 2>&1 || true
    {{compose_dev}} run -d --rm --name blazor-stories-vrt -p 8081:8081 -e NUGET_PACKAGES=/src/.nuget-cache -e ASPNETCORE_URLS=http://0.0.0.0:8081 web sh -lc 'dotnet run --project src/Portfolio/Portfolio.Blazor.Stories/Portfolio.Blazor.Stories.csproj --no-restore --urls http://0.0.0.0:8081' >/dev/null
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
    docker run --rm --user 1000:1000 --add-host host.docker.internal:host-gateway -e HOME=/tmp -v "{{justfile_directory()}}/src/Portfolio/Portfolio.Blazor.Stories.VRT:/workspace" -w /workspace {{playwright_image}} sh -lc 'npm ci --no-audit --no-fund && {{npm_command}}'

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
