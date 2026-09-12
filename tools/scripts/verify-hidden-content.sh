#!/usr/bin/env sh
set -eu

fail() {
    echo "Hidden content check failed: $1" >&2
    exit 1
}

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
host="$repo_root/src/Blog/Blog.Blazor"

public_code="$host/PublicSiteContentProvider.cs $host/PublicKnowledgeGraphProvider.cs $host/PublicMetadataEndpoints.cs $(find "$host/PublicQueries" -name '*.cs')"
# shellcheck disable=SC2086
if grep -En '"(select|SELECT)[[:space:]]|FromSql|SqlQuery|ExecuteSql|DbConnection|BlogAdminDbContext' $public_code; then
    fail "public readers must query through BlogPublicDbContext, never raw SQL or the admin context"
fi

filters="$host/Data/PublicVisibilityFilters.cs"
[ "$(grep -c 'HasQueryFilter' "$filters")" -eq 8 ] || fail "PublicVisibilityFilters must declare exactly eight query filters"
grep -q 'Entity<Project>().HasQueryFilter(project => !project.Hidden && !project.Nda)' "$filters" || fail "projects must be filtered on hidden and nda"
grep -q 'HasQueryFilter(caseStudy => !caseStudy.Hidden && !caseStudy.Nda)' "$filters" || fail "case studies must be filtered on hidden and nda"
grep -q 'HasQueryFilter(resource => !resource.Hidden && resource.Visibility == "public")' "$filters" || fail "resources must be filtered on hidden and public visibility"
grep -q 'HasQueryFilter(credit => credit.Active)' "$filters" || fail "credits must be filtered on active"
for entity in Writing Experiment Snippet ReferenceCollection; do
    grep -A1 "Entity<$entity>()" "$filters" | grep -q 'Hidden' || fail "$entity must be filtered on hidden"
done
grep -q 'PublicVisibilityFilters.Apply(modelBuilder)' "$host/Data/BlogPublicDbContext.cs" || fail "the public context must apply the visibility filters"
if grep -REn 'IgnoreQueryFilters' "$host" --include='*.cs' --include='*.razor'; then
    fail "IgnoreQueryFilters is forbidden in the runtime"
fi
if grep -RlE 'BlogPublicDbContext' "$host" --include='*.cs' --include='*.razor' | grep -vE '/(Data/|PublicQueries/|PublicSiteContentProvider\.cs|PublicKnowledgeGraphProvider\.cs)'; then
    fail "BlogPublicDbContext may only be used by the public readers and the data layer"
fi

graph="$host/PublicKnowledgeGraphProvider.cs"
grep -q 'index.ContainsKey(source) && index.ContainsKey(target)' "$graph" || fail "knowledge graph edges must be dropped when either endpoint is not a public node"

for file in "$repo_root"/src/Blog/Blog.Blazor.Client/Pages/*.razor "$repo_root"/src/Blog/Blog.Blazor.Client/Shared/*.razor; do
    if grep -qE 'IDbContextFactory|BlogAdminDbContext|BlogPublicDbContext' "$file"; then
        fail "$file must read public content through the snapshot, never the admin DbContext"
    fi
done

echo "Hidden content checks passed"
