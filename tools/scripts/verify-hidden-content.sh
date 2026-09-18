#!/usr/bin/env sh
set -eu

fail() {
    echo "Hidden content check failed: $1" >&2
    exit 1
}

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
client="$repo_root/src/Blog/Blog.Blazor.Client"
host="$repo_root/src/Blog/Blog.Blazor"

test ! -e "$host/PublicSiteContentProvider.cs" || fail "the EF public site provider must be removed"
test ! -e "$host/PublicKnowledgeGraphProvider.cs" || fail "the EF knowledge graph provider must be removed"
test ! -d "$host/PublicQueries" || fail "the EF public query layer must be removed"

if grep -REn 'IDbContextFactory|Blog(Admin|Public)DbContext|IgnoreQueryFilters' "$client" \
    --include='*.cs' --include='*.razor'; then
    fail "the browser client must read public content through the API contract"
fi

grep -q 'LaravelPublicSiteContentProvider' "$host/Program.cs" ||
    fail "the server must use the Laravel public site provider"
grep -q 'LaravelPublicKnowledgeGraphProvider' "$host/Program.cs" ||
    fail "the server must use the Laravel knowledge graph provider"

echo "Hidden content checks passed"
