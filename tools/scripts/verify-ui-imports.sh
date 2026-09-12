#!/usr/bin/env sh
set -eu

fail() {
    echo "UI imports check failed: $1" >&2
    exit 1
}

ui_namespaces="$(find src/Blog/Blog.Blazor.UI -mindepth 1 -maxdepth 1 -type d \
    ! -name bin ! -name obj ! -name wwwroot -exec basename {} \; | sort)"

imports_files="src/Blog/Blog.Blazor.UI/_Imports.razor src/Blog/Blog.Blazor.Client/_Imports.razor src/Blog/Blog.Blazor/Components/_Imports.razor src/Blog/Blog.Blazor.Stories/_Imports.razor"

failed=0
for file in $imports_files; do
    [ -f "$file" ] || continue
    for ns in $ui_namespaces; do
        if ! grep -q "^@using Blog\.Blazor\.UI\.$ns\$" "$file"; then
            echo "$file is missing \"@using Blog.Blazor.UI.$ns\"" >&2
            failed=1
        fi
    done
done

[ "$failed" -eq 0 ] || fail "one or more _Imports.razor files don't import every Blog.Blazor.UI namespace — a component in an unimported namespace silently renders as a literal HTML tag instead of failing to build"

echo "UI imports check passed"
