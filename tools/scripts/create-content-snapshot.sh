#!/usr/bin/env sh
set -eu

snapshot_name="${1:-portfolio-$(date -u +%Y%m%dT%H%M%SZ).sqlite}"
case "$snapshot_name" in
    portfolio-[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]T[0-9][0-9][0-9][0-9][0-9][0-9]Z.sqlite) ;;
    *)
        echo "snapshot name must follow portfolio-YYYYMMDDTHHMMSSZ.sqlite" >&2
        exit 2
        ;;
esac

docker compose run --rm --entrypoint sh web -lc \
    'set -eu
     mkdir -p /src/data/snapshots
     dotnet run --project src/Portfolio/Portfolio.Blazor.Snapshot/Portfolio.Blazor.Snapshot.csproj --no-restore -- /data/db/portfolio.sqlite "/src/data/snapshots/$1"' \
    snapshot "$snapshot_name"
