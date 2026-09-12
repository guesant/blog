#!/usr/bin/env sh
set -eu

root="${PORTFOLIO_RESUME_PDF_ROOT:-/data/resume-cache}"
tooling="$root/.tooling"
binary="$tooling/tectonic"
version="0.17.0"
machine="$(uname -m)"
# IMPORTANT: two checksums, not one. expected_archive verifies the download;
# expected_binary verifies what the cache already holds. Comparing the cached
# binary against the archive's checksum can never match, so the cache always
# missed and every container start re-downloaded 25MB from GitHub, which also
# made startup fail outright whenever the container had no egress.
case "$machine" in
    x86_64)
        target="x86_64-unknown-linux-musl"
        expected_archive="8533d07f9ccbd7a65824b9e0459041bca34af1eb33daba48f59215593753a3b7"
        expected_binary="a98aa59ad5c1df39a6c9e56cbfc5088f2b11d6c179c0130b97998e4bd46a46da"
        ;;
    aarch64)
        target="aarch64-unknown-linux-musl"
        expected_archive="b10954a95404f3ab2328d2fa59a5ebab8e657f893fab096f98be8db7c0c979b8"
        expected_binary="19a2b763e5875fffefaa193c42e460ceba5983d027b6d50b0094130d26ba4e4a"
        ;;
    *)
        echo "Unsupported architecture: $machine" >&2
        exit 1
        ;;
esac

mkdir -p "$tooling"
if [ ! -x "$binary" ] || [ "$(sha256sum "$binary" | awk '{print $1}')" != "$expected_binary" ]; then
    archive="$tooling/tectonic.tar.gz"
    url="https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${version}/tectonic-${version}-${target}.tar.gz"
    curl --proto '=https' -fsSL "$url" -o "$archive"
    actual="$(sha256sum "$archive" | awk '{print $1}')"
    [ "$actual" = "$expected_archive" ] || {
        echo "Tectonic checksum mismatch" >&2
        exit 1
    }
    tar -xzf "$archive" -C "$tooling"
    rm -f "$archive"
    chmod 0555 "$binary"
    [ "$(sha256sum "$binary" | awk '{print $1}')" = "$expected_binary" ] || {
        echo "Tectonic binary checksum mismatch" >&2
        exit 1
    }
fi

export TECTONIC_PATH="$binary"

# Production images run the published output instead of `dotnet run`/`dotnet
# watch` against source: those need the SDK and a checked-out csproj,
# neither of which the runtime-only prod image has. The Tectonic fetch and
# checksum verification above are identical in both cases; only the final
# exec differs.
if [ "${PORTFOLIO_RUN_PUBLISHED:-0}" = "1" ]; then
    exec dotnet "${PORTFOLIO_APP_DLL:-/app/Blog.Blazor.dll}"
fi

if [ "${PORTFOLIO_WATCH:-0}" = "1" ]; then
    exec dotnet watch --project src/Blog/Blog.Blazor/Blog.Blazor.csproj --no-launch-profile --no-restore --non-interactive --no-hot-reload
fi
exec dotnet run --project src/Blog/Blog.Blazor/Blog.Blazor.csproj --no-launch-profile --no-restore
