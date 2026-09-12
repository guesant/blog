#!/usr/bin/env sh
set -eu

fail() {
    echo "read-only runtime check failed: $1" >&2
    exit 1
}

if grep -REn 'Database\.Migrate|EnsureCreated|dotnet ef|HasData\(|\.Migrate\(|Seed\(' src/Blog/Blog.Blazor --include='*.cs' >/tmp/readonly-runtime-matches; then
    fail "schema migration or seed code was found in the runtime"
fi

database_di=src/Blog/Blog.Blazor/Data/DatabaseServiceCollectionExtensions.cs
grep -q 'default_transaction_read_only=on' "$database_di" ||
    fail "the public context must open connections with default_transaction_read_only=on"
awk '/AddDbContextFactory<BlogPublicDbContext>/,/^        \);$/' "$database_di" >/tmp/readonly-public-registration
grep -q 'default_transaction_read_only=on' /tmp/readonly-public-registration ||
    fail "the public context registration must run read-only transactions"
if grep -qE 'ReadWrite' /tmp/readonly-public-registration; then
    fail "the public context must not open a read-write connection"
fi
if grep -REn 'UseNpgsql|UseSqlite' src/Blog/Blog.Blazor --include='*.cs' |
    grep -v "$database_di" |
    grep -v 'Blog.Blazor.Database/BlogAdminDesignTimeFactory.cs' |
    grep -v 'Blog.Blazor.Data.Tests/'; then
    fail "only the database DI extension and the design-time factory may configure a provider"
fi

public_context=src/Blog/Blog.Blazor/Data/BlogPublicDbContext.cs
grep -q 'QueryTrackingBehavior.NoTracking' "$public_context" || fail "the public context must be no-tracking"
grep -q 'override int SaveChanges' "$public_context" || fail "the public context must override SaveChanges"
grep -q 'override Task<int> SaveChangesAsync' "$public_context" || fail "the public context must override SaveChangesAsync"
if grep -q 'base.SaveChanges' "$public_context"; then
    fail "the public context must not reach the base SaveChanges"
fi
public_read_files="$(find src/Blog/Blog.Blazor/PublicQueries -name '*.cs' 2>/dev/null || true) src/Blog/Blog.Blazor/PublicSiteContentProvider.cs src/Blog/Blog.Blazor/PublicKnowledgeGraphProvider.cs"
# shellcheck disable=SC2086
if grep -En 'SaveChanges|ExecuteUpdate|ExecuteDelete|\.Update\(|\.AddAsync\(|\.AddRange\(|\.RemoveRange\(' $public_read_files; then
    fail "public read code must not write"
fi

if grep -REn '(\.\./laravel/|laravel_[A-Za-z0-9_-]+)' .docker/compose.yaml tools/scripts 2>/dev/null; then
    fail "the Blazor runtime still has an operational Laravel dependency"
fi

echo "read-only runtime checks passed"
