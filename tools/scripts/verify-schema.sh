#!/usr/bin/env sh
set -eu

fail() {
    echo "schema check failed: $1" >&2
    exit 1
}

dotnet tool restore >/dev/null 2>&1 || fail "could not restore the local dotnet tools"

dotnet tool run dotnet-ef migrations has-pending-model-changes \
    --project Portfolio/Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj \
    --startup-project Portfolio/Portfolio.Blazor.Database/Portfolio.Blazor.Database.csproj \
    --context PortfolioAdminDbContext >/tmp/schema-drift 2>&1 ||
    {
        cat /tmp/schema-drift >&2
        fail "the model has changes with no migration; run 'just db-migration <name>'"
    }

echo "schema checks passed"
