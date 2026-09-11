#!/usr/bin/env sh
set -eu

projects="src/Portfolio/Portfolio.Blazor.Client src/Portfolio/Portfolio.Blazor.Core src/Portfolio/Portfolio.Blazor.Core.Tests src/Portfolio/Portfolio.Blazor.Data.Tests src/Portfolio/Portfolio.Blazor.Import src/Portfolio/Portfolio.Blazor.Sbom src/Portfolio/Portfolio.Blazor src/Portfolio/Portfolio.Blazor.UI"
[ -d src/Portfolio/Portfolio.Blazor.Stories ] && projects="$projects src/Portfolio/Portfolio.Blazor.Stories"

matches="$(find $projects -type f \( -name '*.cs' -o -name '*.razor' \) -not -path '*/bin/*' -not -path '*/obj/*' -print0 | xargs -0 awk '
FNR == 1 { allowed_block = 0; in_block = 0 }
{
    line = $0
    gsub(/"([^"\\]|\\.)*"/, "", line)
    gsub(/\047([^\047\\]|\\.)*\047/, "", line)
    # A leading "*" is a comment continuation only inside an open /* block; a wrapped
    # multiplication that starts a line with "*" is code.
    opens_block = (line ~ /^[[:space:]]*\/\*/)
    is_comment = (line ~ /^[[:space:]]*\/\//) || opens_block || (in_block && line ~ /^[[:space:]]*\*/)
    if (opens_block && line !~ /\*\//) in_block = 1
    else if (in_block && line ~ /\*\//) { in_block = 0; is_comment = 1 }
    if (!is_comment) { allowed_block = 0; next }

    is_doc_comment = (line ~ /^[[:space:]]*\/\/\//)
    in_ui = (FILENAME ~ /^src\/Portfolio\/Portfolio\.Blazor\.UI\//)
    if (in_ui && is_doc_comment) { allowed_block = 0; next }

    # A comment block opening with IMPORTANT: records a non-obvious invariant and is
    # allowed to continue over the following comment lines; anything else is narrative.
    if (line ~ /IMPORTANT:/) { allowed_block = 1; next }
    if (allowed_block) next

    print FILENAME ":" FNR ":" $0
}' || true)"

if [ -n "$matches" ]; then
    echo "C# comment check failed; only IMPORTANT-marked invariants and XML docs in Portfolio.Blazor.UI are allowed:" >&2
    printf '%s\n' "$matches" >&2
    exit 1
fi

echo "C# comment checks passed"
