set shell := ["bash", "-uc"]
set positional-arguments


env_file := if path_exists(".env") == "true" { " --env-file .env" } else { "" }
compose := "docker compose" + env_file + " -f .docker/compose.yaml"
compose_dev := compose + " -f .docker/compose.dev.yaml"
docker_run := compose + " run --rm --entrypoint sh web -lc"
tools_run := compose_dev + " run --rm tools sh -lc"

dotnet_tools_restore := "dotnet tool restore >/dev/null"
prettier_flags := "--config .config/prettierrc.json --ignore-path .config/prettierignore --ignore-path .gitignore"
prettier_globs := '"src/Blog/Blog.Blazor*/**/*.{css,js,ts,html}" "tools/scripts/*.mjs"'
database_project := "src/Blog/Blog.Blazor.Database/Blog.Blazor.Database.csproj"


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


check: tools-build \
    format \
    lint \
    comments \
    duplication \
    duplication-razor \
    build \
    test \
    test-data \
    audit \
    schema \
    tokens \
    ui-imports \
    resx-keys \
    hardcoded-text \
    composition \
    verify-stories \
    vrt

tools-build:
    {{compose_dev}} build tools

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
    {{compose_dev}} run --rm -e NUGET_PACKAGES=/src/.nuget-cache --entrypoint sh web -lc \
        '{{dotnet_tools_restore}} && dotnet tool run dotnet-ef migrations add {{name}} --project {{database_project}} --startup-project {{database_project}} --context BlogAdminDbContext'

db-update:
    {{compose_dev}} up -d --wait postgres
    {{compose_dev}} run --rm -e NUGET_PACKAGES=/src/.nuget-cache --entrypoint sh web -lc \
        '{{dotnet_tools_restore}} && dotnet tool run dotnet-ef database update --project {{database_project}} --startup-project {{database_project}} --context BlogAdminDbContext'

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
            if [ "$attempt" -ge 40 ]; then
                echo "stories did not respond from web after $attempt attempts" >&2
                exit 1
            fi
            sleep 2
        done
        echo "stories reachable from web after $attempt attempts"'; then
        echo "--- loopback curl from inside stories itself ---" >&2
        {{compose}} exec -T stories sh -c 'curl -sv http://127.0.0.1:8081/index.html' >&2 2>&1 || true
        echo "--- ss/proc listing inside stories ---" >&2
        {{compose}} exec -T stories sh -c '(ss -tlnp || cat /proc/net/tcp) 2>&1' >&2 || true
        echo "--- cross-container curl from web, verbose ---" >&2
        {{docker_run}} 'curl -sv http://stories:8081/index.html' >&2 2>&1 || true
        {{compose}} logs --tail 200 --timestamps stories >&2 || true
        exit 1
    fi
    {{compose_dev}} run --rm playwright sh -lc 'npm ci --no-audit --no-fund && {{npm_command}}'
