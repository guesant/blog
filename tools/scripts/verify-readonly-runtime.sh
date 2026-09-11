#!/usr/bin/env sh
set -eu

fail() {
    echo "read-only runtime check failed: $1" >&2
    exit 1
}

if grep -REn 'Database\.Migrate|EnsureCreated|dotnet ef|HasData\(|\.Migrate\(|Seed\(' src/Portfolio/Portfolio.Blazor --include='*.cs' >/tmp/readonly-runtime-matches; then
    fail "schema migration or seed code was found in the runtime"
fi

grep -q 'Mode = SqliteOpenMode.ReadOnly' src/Portfolio/Portfolio.Blazor/Data/Providers/SqliteDatabaseProvider.cs ||
    fail "the SQLite provider must open public connections read-only"
grep -q 'default_transaction_read_only=on' src/Portfolio/Portfolio.Blazor/Data/Providers/PostgresDatabaseProvider.cs ||
    fail "the PostgreSQL provider must open public connections with default_transaction_read_only=on"
awk '/ConfigurePublicRead/,/;$/' src/Portfolio/Portfolio.Blazor/Data/Providers/SqliteDatabaseProvider.cs >/tmp/readonly-sqlite-public
grep -q 'Mode = SqliteOpenMode.ReadOnly' /tmp/readonly-sqlite-public ||
    fail "the SQLite public context must open the database read-only"
if grep -qE 'AddInterceptors|ReadWrite' /tmp/readonly-sqlite-public; then
    fail "the SQLite public context must not attach writers or open read-write"
fi
awk '/ConfigurePublicRead/,/;$/' src/Portfolio/Portfolio.Blazor/Data/Providers/PostgresDatabaseProvider.cs >/tmp/readonly-postgres-public
grep -q 'default_transaction_read_only=on' /tmp/readonly-postgres-public ||
    fail "the PostgreSQL public context must run read-only transactions"
public_context=src/Portfolio/Portfolio.Blazor/Data/PortfolioPublicDbContext.cs
grep -q 'QueryTrackingBehavior.NoTracking' "$public_context" || fail "the public context must be no-tracking"
grep -q 'override int SaveChanges' "$public_context" || fail "the public context must override SaveChanges"
grep -q 'override Task<int> SaveChangesAsync' "$public_context" || fail "the public context must override SaveChangesAsync"
if grep -q 'base.SaveChanges' "$public_context"; then
    fail "the public context must not reach the base SaveChanges"
fi
public_read_files="$(find src/Portfolio/Portfolio.Blazor/PublicQueries -name '*.cs' 2>/dev/null || true) src/Portfolio/Portfolio.Blazor/PublicSiteContentProvider.cs src/Portfolio/Portfolio.Blazor/PublicKnowledgeGraphProvider.cs"
# shellcheck disable=SC2086
if grep -En 'SaveChanges|ExecuteUpdate|ExecuteDelete|\.Update\(|\.AddAsync\(|\.AddRange\(|\.RemoveRange\(' $public_read_files; then
    fail "public read code must not write"
fi

# The admin context writes the SQLite file (WAL needs sidecar files), so the mount is a directory
# bind. This section only guards that the mount exists and cannot silently materialize as an
# empty directory; the public read path is kept read-only by the ConfigurePublicRead checks above.
grep -q 'target: /data/db' .docker/compose.yaml ||
    fail "the SQLite bind mount target is missing"
grep -q 'create_host_path: false' .docker/compose.yaml ||
    fail "a missing SQLite source could be silently created as a directory"

if grep -REn '(\.\./laravel/|laravel_[A-Za-z0-9_-]+)' .docker/compose.yaml tools/scripts 2>/dev/null; then
    fail "the Blazor runtime still has an operational Laravel dependency"
fi

echo "read-only runtime checks passed"
