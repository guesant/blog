#!/usr/bin/env sh
set -eu

fail() {
    echo "Hidden content check failed: $1" >&2
    exit 1
}

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
host="$repo_root/Portfolio/Portfolio.Blazor"
readers="$host/SqlitePublicSiteContentProvider.cs $host/SqlitePublicKnowledgeGraphProvider.cs $host/PublicMetadataEndpoints.cs $host/Program.cs"

# Every SQL string in a public reader that touches a table with a hidden flag must filter it on the
# same alias, in the same query. Resources additionally need visibility='public'; projects and case
# studies additionally need nda=0. Related-content, pivot and lookup queries count too: a hidden item
# reached through a public one is still a leak.
rules="projects:hidden=0,nda=0
case_studies:hidden=0,nda=0
writings:hidden=0
resources:hidden=0,visibility='public'
reference_collections:hidden=0
experiments:hidden=0
snippets:hidden=0"

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

graph="$host/SqlitePublicKnowledgeGraphProvider.cs"
grep -q "x.hidden=0 and x.visibility='public'" "$graph" || fail "the knowledge graph must exclude hidden and non-public findings"
grep -q "x.hidden=0 and x.nda=0" "$graph" || fail "the knowledge graph must exclude hidden and NDA projects/case studies"
grep -q 'index.ContainsKey(source) && index.ContainsKey(target)' "$graph" || fail "knowledge graph edges must be dropped when either endpoint is not a public node"

for file in "$repo_root"/Portfolio/Portfolio.Blazor.Client/Pages/*.razor "$repo_root"/Portfolio/Portfolio.Blazor.Client/Shared/*.razor; do
    if grep -qE 'IDbContextFactory|PortfolioAdminDbContext' "$file"; then
        fail "$file must read public content through the snapshot, never the admin DbContext"
    fi
done

echo "Hidden content checks passed"
