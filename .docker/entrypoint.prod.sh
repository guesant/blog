#!/usr/bin/env sh
set -eu

DB_FILE="${PORTFOLIO_SQLITE_PATH:-/data/sqlite/portfolio.sqlite}"
if [ ! -s "$DB_FILE" ]; then
    if [ "${PORTFOLIO_ALLOW_EMPTY_BOOTSTRAP:-false}" != "true" ]; then
        echo "Refusing to start: SQLite file is missing or empty at $DB_FILE." >&2
        echo "Restore a verified copy of portfolio.sqlite into the persistent volume, or explicitly set PORTFOLIO_ALLOW_EMPTY_BOOTSTRAP=true for local testing only." >&2
        exit 1
    fi
    echo "Starting without a database at $DB_FILE (PORTFOLIO_ALLOW_EMPTY_BOOTSTRAP=true): pages will render without content until a real copy is restored." >&2
fi

# The schema is owned by EF Core migrations in Portfolio.Blazor.Database, but
# they are never applied here: a deploy must not rewrite schema on its own.
# Run 'just db-update' deliberately, after a backup. The admin panel does write
# this file, and backups run in-process before each save (DatabaseBackupService).
exec sh /app/scripts/run-with-tectonic.sh
