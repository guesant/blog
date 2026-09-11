#!/usr/bin/env sh
set -eu

fail() {
    echo "read-only runtime check failed: $1" >&2
    exit 1
}

if grep -REn 'Database\.Migrate|EnsureCreated|dotnet ef|HasData\(|\.Migrate\(|Seed\(' Portfolio/Portfolio.Blazor --include='*.cs' >/tmp/readonly-runtime-matches; then
    fail "schema migration or seed code was found in the runtime"
fi

if grep -En 'SqliteOpenMode\.(ReadWrite|ReadWriteCreate)|OpenReadOnlyConnectionAsync[^;]*ReadWrite' Portfolio/Portfolio.Blazor/Public*Provider.cs >/tmp/readonly-sqlite-matches; then
    fail "a public provider opens the database writable"
fi
grep -q 'Mode = SqliteOpenMode.ReadOnly' Portfolio/Portfolio.Blazor/Data/Providers/SqliteDatabaseProvider.cs ||
    fail "the SQLite provider must open public connections read-only"
grep -q 'default_transaction_read_only=on' Portfolio/Portfolio.Blazor/Data/Providers/PostgresDatabaseProvider.cs ||
    fail "the PostgreSQL provider must open public connections with default_transaction_read_only=on"

# NOTE: since the admin panel's EF Core layer needs to write the DB (and WAL
# mode needs sidecar files alongside it), the SQLite mount is a directory
# bind, not a read-only single-file bind. This section now only guards that
# the mount exists and can't silently materialize as an empty directory —
# the public read path's own read-only-ness is still enforced above, by the
# SqliteOpenMode check scoped to Portfolio/Portfolio.Blazor/Public*Provider.cs.
grep -q 'target: /data/db' compose.yaml ||
    fail "the SQLite bind mount target is missing"
grep -q 'create_host_path: false' compose.yaml ||
    fail "a missing SQLite source could be silently created as a directory"

if grep -REn '(\.\./laravel/|laravel_[A-Za-z0-9_-]+)' compose.yaml tools/scripts 2>/dev/null; then
    fail "the Blazor runtime still has an operational Laravel dependency"
fi

echo "read-only runtime checks passed"
