#!/usr/bin/env sh
set -eu

fail() {
    echo "read-only runtime check failed: $1" >&2
    exit 1
}

if grep -REn 'Database\.Migrate|EnsureCreated|dotnet ef|HasData\(|\.Migrate\(|Seed\(' src/Blog/Blog.Blazor --include='*.cs'; then
    fail "schema migration or seed code was found in the runtime"
fi

runtime_files="$(find src/Blog/Blog.Blazor -type f \( -name '*.cs' -o -name '*.razor' \) \
    -not -path '*/Data/*')"
# shellcheck disable=SC2086
if grep -En 'UseNpgsql|UseSqlite|IDbContextFactory|Blog(Admin|Public)DbContext' $runtime_files; then
    fail "the Blazor runtime must not configure or access an EF Core context"
fi

grep -q 'PORTFOLIO_CONTENT_API_URL' src/Blog/Blog.Blazor/Program.cs ||
    fail "the Blazor runtime must configure the Laravel content API"
grep -q 'LaravelPublicSiteContentProvider' src/Blog/Blog.Blazor/Program.cs ||
    fail "the Blazor runtime must use the Laravel content provider"
grep -q 'LaravelPublicKnowledgeGraphProvider' src/Blog/Blog.Blazor/Program.cs ||
    fail "the Blazor runtime must use the Laravel knowledge graph provider"

echo "read-only runtime checks passed"
