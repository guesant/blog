#!/usr/bin/env sh
set -eu

if [ -z "${PORTFOLIO_DB_CONNECTION:-}" ]; then
    echo "Refusing to start: PORTFOLIO_DB_CONNECTION is empty." >&2
    exit 1
fi

# The schema is owned by EF Core migrations in Blog.Blazor.Database, but
# they are never applied here: a deploy must not rewrite schema on its own.
# Run 'just db-update' deliberately, after a backup taken by the host (the app never
# copies or dumps its own database).
exec sh /app/scripts/run-with-tectonic.sh
