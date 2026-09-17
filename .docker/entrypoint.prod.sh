#!/usr/bin/env sh
set -eu

if [ -z "${PORTFOLIO_DB_CONNECTION:-}" ]; then
    echo "Refusing to start: PORTFOLIO_DB_CONNECTION is empty." >&2
    exit 1
fi

# IMPORTANT: the schema is owned by EF Core migrations in Blog.Blazor.Database and is
# never applied by the web process. The deploy runs /app/migrate, the migrations bundle
# built into this image, as its own step before the rollout, so two replicas or a
# restart can never race each other on the schema.
exec sh /app/scripts/run-with-tectonic.sh
