#!/usr/bin/env sh
set -eu

fail() {
    echo "Admin removal check failed: $1" >&2
    exit 1
}

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
host="$repo_root/src/Blog/Blog.Blazor"

test ! -d "$host/Components/Admin" || fail "Blazor admin components must be removed"
test ! -f "$host/Auth/AdminAuthEndpoints.cs" || fail "Blazor admin authentication must be removed"
if grep -R -nE 'AdminAuthEndpoints|PORTFOLIO_ADMIN_OIDC|@page "/admin' "$host" \
    --include='*.cs' --include='*.razor' --include='*.csproj'; then
    fail "Blazor must not retain admin routes or authentication"
fi

echo "Blazor admin removal checks passed"
