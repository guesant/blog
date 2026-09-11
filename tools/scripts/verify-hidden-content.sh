#!/usr/bin/env sh
set -eu

fail() {
    echo "Hidden content check failed: $1" >&2
    exit 1
}

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
host="$repo_root/Portfolio/Portfolio.Blazor"
readers="$host/PublicSiteContentProvider.cs $host/PublicMetadataEndpoints.cs $host/Program.cs"

# Every SQL string in a public reader that touches a table with a hidden flag must filter it on the
# same alias, in the same query. Resources additionally need visibility='public'; projects and case
# studies additionally need nda=false. Related-content, pivot and lookup queries count too: a hidden item
# reached through a public one is still a leak.
rules="projects:hidden=false,nda=false
case_studies:hidden=false,nda=false
writings:hidden=false
resources:hidden=false,visibility='public'
reference_collections:hidden=false
experiments:hidden=false
snippets:hidden=false"

problems=0
for file in $readers; do
    grep -noE '"(select|SELECT)[^"]*"' "$file" | while IFS= read -r hit; do
        line="${hit%%:*}"
        query="${hit#*:}"
        printf '%s\n' "$rules" | while IFS=: read -r table conditions; do
            printf '%s\n' "$query" | grep -oE "(from|join) +$table +[A-Za-z_][A-Za-z0-9_]*" | while read -r _ _ alias; do
                old_ifs="$IFS"
                IFS=,
                for condition in $conditions; do
                    IFS="$old_ifs"
                    if ! printf '%s\n' "$query" | grep -qE "\b$alias\.${condition}"; then
                        echo "${file#"$repo_root"/}:$line $table as $alias lacks $condition"
                    fi
                done
                IFS="$old_ifs"
            done
        done
    done
done >/tmp/hidden-content-problems

if [ -s /tmp/hidden-content-problems ]; then
    cat /tmp/hidden-content-problems >&2
    fail "a public query reads a hidden-capable table without filtering it"
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
grep -q 'PublicVisibilityFilters.Apply(modelBuilder)' "$host/Data/PortfolioPublicDbContext.cs" || fail "the public context must apply the visibility filters"
if grep -REn 'IgnoreQueryFilters' "$host" --include='*.cs' --include='*.razor'; then
    fail "IgnoreQueryFilters is forbidden in the runtime"
fi
if grep -RlE 'PortfolioPublicDbContext' "$host" --include='*.cs' --include='*.razor' | grep -vE '/(Data/|PublicQueries/|PublicSiteContentProvider\.cs|PublicKnowledgeGraphProvider\.cs)'; then
    fail "PortfolioPublicDbContext may only be used by the public readers and the data layer"
fi

graph="$host/PublicKnowledgeGraphProvider.cs"
grep -q 'index.ContainsKey(source) && index.ContainsKey(target)' "$graph" || fail "knowledge graph edges must be dropped when either endpoint is not a public node"

for file in "$repo_root"/Portfolio/Portfolio.Blazor.Client/Pages/*.razor "$repo_root"/Portfolio/Portfolio.Blazor.Client/Shared/*.razor; do
    if grep -qE 'IDbContextFactory|PortfolioAdminDbContext|PortfolioPublicDbContext' "$file"; then
        fail "$file must read public content through the snapshot, never the admin DbContext"
    fi
done

echo "Hidden content checks passed"
