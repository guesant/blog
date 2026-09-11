#!/usr/bin/env sh
set -eu

fail() {
    echo "Admin guard check failed: $1" >&2
    exit 1
}

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
host="$repo_root/src/Portfolio/Portfolio.Blazor"

grep -q 'path.StartsWithSegments("/admin"' "$host/Program.cs" ||
    fail "Program.cs must keep the /admin authentication middleware"
grep -q 'IsAnonymousAdminPath' "$host/Program.cs" ||
    fail "the /admin middleware must consult AdminAuthEndpoints.IsAnonymousAdminPath"
grep -q '^@attribute \[Authorize\]' "$host/Components/Admin/_Imports.razor" ||
    fail "Components/Admin/_Imports.razor must apply [Authorize] to every admin component"

for file in $(grep -rl '@page "/admin' "$host/Components/Admin" --include='*.razor'); do
    case "$file" in
        */AdminLogin.razor)
            grep -q '\[AllowAnonymous\]' "$file" || fail "AdminLogin.razor must opt out with [AllowAnonymous]"
            ;;
        *)
            if grep -q 'AllowAnonymous' "$file"; then
                fail "$file must not opt out of [Authorize]"
            fi
            ;;
    esac
done

anonymous_endpoints="$(find "$host" -name '*.cs' -not -path '*/obj/*' -not -path '*/bin/*' -exec grep -hoE 'Map(Get|Post|Put|Delete|Patch)\("/admin[^"]*"' {} + | sed -E 's/.*\("([^"]*)"/\1/' | sort -u)"
for endpoint in $anonymous_endpoints; do
    case "$endpoint" in
        /admin/sign-in | /admin/sign-out) ;;
        *) fail "minimal API endpoint $endpoint under /admin is not in the anonymous allowlist; the middleware still protects it, but list it explicitly if it is meant to be public" ;;
    esac
done

echo "Admin guard checks passed"
