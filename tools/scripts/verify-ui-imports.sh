#!/usr/bin/env sh
set -eu

fail() {
    echo "UI imports check failed: $1" >&2
    exit 1
}

ui_namespaces="$(find Portfolio/Portfolio.Blazor.UI -mindepth 1 -maxdepth 1 -type d \
    ! -name bin ! -name obj ! -name wwwroot -exec basename {} \; | sort)"

imports_files="Portfolio/Portfolio.Blazor.UI/_Imports.razor Portfolio/Portfolio.Blazor.Client/_Imports.razor Portfolio/Portfolio.Blazor/Components/_Imports.razor Portfolio/Portfolio.Blazor.Stories/_Imports.razor"

failed=0
for file in $imports_files; do
    [ -f "$file" ] || continue
    for ns in $ui_namespaces; do
        if ! grep -q "^@using Portfolio\.Blazor\.UI\.$ns\$" "$file"; then
            echo "$file is missing \"@using Portfolio.Blazor.UI.$ns\"" >&2
            failed=1
        fi
    done
done

[ "$failed" -eq 0 ] || fail "one or more _Imports.razor files don't import every Portfolio.Blazor.UI namespace — a component in an unimported namespace silently renders as a literal HTML tag instead of failing to build"

echo "UI imports check passed"
