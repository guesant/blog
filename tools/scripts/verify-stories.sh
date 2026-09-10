#!/usr/bin/env sh
set -eu

fail() {
    echo "Stories check failed: $1" >&2
    exit 1
}

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
ui_dir="$repo_root/Portfolio/Portfolio.Blazor.UI"
stories_dir="$repo_root/Portfolio/Portfolio.Blazor.Stories/Stories"

missing=""
count=0

for component in $(find "$ui_dir" -type f -name '*.razor' -not -name '_Imports.razor' -not -path '*/bin/*' -not -path '*/obj/*'); do
    name="$(basename "$component" .razor)"
    if [ -z "$(find "$stories_dir" -type f -name "${name}.stories.razor" -not -path '*/bin/*' -not -path '*/obj/*' 2>/dev/null)" ]; then
        missing="$missing
$component"
        count=$((count + 1))
    fi
done

if [ "$count" -gt 0 ]; then
    fail "$count Portfolio.Blazor.UI component(s) have no matching *.stories.razor:$missing"
fi

echo "Stories checks passed"
