set shell := ["bash", "-uc"]
set positional-arguments


env_file := if path_exists(".env") == "true" { " --env-file .env" } else { "" }
compose := "docker compose" + env_file + " -f .docker/compose.yaml"
compose_dev := compose + " -f .docker/compose.dev.yaml"
compose_pg := compose_dev + " -f .docker/compose.postgres.yaml"
docker_run := compose + " run --rm --entrypoint sh web -lc"
tools_run := compose_dev + " run --rm tools sh -lc"

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

check: tools-build format lint comments duplication duplication-razor build test test-data audit schema tokens ui-imports resx-keys hardcoded-text composition verify-stories vrt

tools-build:
    {{compose_dev}} build tools

format:
    {{tools_run}} 'FORMAT_CHECK=1 node tools/scripts/format-razor.mjs && FORMAT_CHECK=1 node tools/scripts/format-razor-attributes.mjs'
    {{docker_run}} 'dotnet tool restore >/dev/null && HOME=/tmp dotnet csharpier check src/Portfolio'
    {{tools_run}} 'prettier --config .config/prettierrc.json --ignore-path .config/prettierignore --ignore-path .gitignore --check "src/Portfolio/Portfolio.Blazor*/**/*.{css,js,ts,html}" "tools/scripts/*.mjs"'
    {{tools_run}} 'shfmt -i 4 -ci -d tools/scripts'

format-fix:
    {{tools_run}} 'node tools/scripts/format-razor.mjs && node tools/scripts/format-razor-attributes.mjs'
    {{docker_run}} 'dotnet tool restore >/dev/null && HOME=/tmp dotnet csharpier format src/Portfolio'
    {{tools_run}} 'prettier --config .config/prettierrc.json --ignore-path .config/prettierignore --ignore-path .gitignore --write "src/Portfolio/Portfolio.Blazor*/**/*.{css,js,ts,html}" "tools/scripts/*.mjs"'
    {{tools_run}} 'shfmt -i 4 -ci -w tools/scripts'

lint:
    {{docker_run}} 'dotnet format src/Portfolio.Blazor.slnx analyzers --verify-no-changes --no-restore --severity warn --verbosity minimal && dotnet build src/Portfolio.Blazor.slnx --configuration Release --no-restore --nologo'

comments:
    {{docker_run}} 'sh /src/tools/scripts/verify-csharp-comments.sh'

duplication:
    {{tools_run}} 'jscpd --config .config/jscpd.json --format csharp'

duplication-razor:
    {{tools_run}} 'jscpd --config .config/jscpd.json --format razor'

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
    trap '{{compose}} rm -sf stories >/dev/null 2>&1 || true' EXIT
    if ! {{compose}} up -d --wait stories; then
        {{compose}} logs --tail 50 stories >&2 || true
        exit 1
    fi
    {{compose_dev}} run --rm playwright sh -lc 'npm ci --no-audit --no-fund && {{npm_command}}'
