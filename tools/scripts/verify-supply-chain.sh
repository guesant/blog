#!/usr/bin/env sh
set -eu

fail() {
    echo "Blazor supply-chain check failed: $1" >&2
    exit 1
}

for compose_file in compose.yaml compose.dev.yaml; do
    [ -f "$compose_file" ] || fail "$compose_file is missing"
done

if grep -REn '(\.\./laravel/|laravel_[A-Za-z0-9_-]+)' compose*.yaml tools/scripts 2>/dev/null; then
    fail "the Blazor runtime must not mount Laravel paths or volumes"
fi

grep -Eq '^[[:space:]]*image:[[:space:]]*[^@[:space:]]+@sha256:[0-9a-f]{64}[[:space:]]*$' compose*.yaml ||
    fail "the development image must be pinned by digest"

if grep -En '^[[:space:]]*(image:|FROM[[:space:]]).*(^|:)latest([[:space:]]|$)' compose*.yaml Dockerfile* 2>/dev/null; then
    fail "an image still uses an unpinned latest tag"
fi

# IMPORTANT: scoped to the .NET projects rather than the whole tree. The
# repository root is a pnpm workspace with its own node_modules, and the two
# Playwright harnesses materialise theirs on demand; neither is part of the
# application, and compose bind-mounts the tree rather than using a build
# context, so .dockerignore cannot exclude them here.
if find Portfolio/Portfolio.Blazor Portfolio/Portfolio.Blazor.Client Portfolio/Portfolio.Blazor.Core Portfolio/Portfolio.Blazor.Core.Tests \
    Portfolio/Portfolio.Blazor.Database Portfolio/Portfolio.Blazor.Sbom Portfolio/Portfolio.Blazor.Snapshot Portfolio/Portfolio.Blazor.Stories \
    Portfolio/Portfolio.Blazor.UI -type d -name node_modules -print -quit 2>/dev/null | grep -q .; then
    fail "node_modules must not be part of a .NET project"
fi

if grep -REn -i 'https?://[^" ]*(cdn|unpkg|jsdelivr)|curl[[:space:]].*\|[[:space:]]*(sh|bash)|wget[[:space:]].*\|[[:space:]]*(sh|bash)' \
    Portfolio/Portfolio.Blazor Portfolio/Portfolio.Blazor.Client Portfolio/Portfolio.Blazor.Core Portfolio/Portfolio.Blazor.UI compose.yaml 2>/dev/null; then
    fail "remote scripts or CDN assets are not allowed"
fi

if grep -REn '@using[[:space:]]+BlazorBootstrap|<(Button|NumberInput|TextInput|TextAreaInput|AutoComplete|Pagination|Card|Form|Dropdown)([[:space:]]|>)' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Pages and Layout must use site-owned wrappers instead of direct BlazorBootstrap components"
fi

if grep -REn '@using[[:space:]]+BlazorBootstrap|<(Button|NumberInput|TextInput|TextAreaInput|AutoComplete|Pagination|Card|Form|Dropdown)([[:space:]]|>)' \
    Portfolio/Portfolio.Blazor.Client --include='*.razor' --include='*.cs' 2>/dev/null |
    grep -v '/Shared/'; then
    fail "only the site-owned Shared UI layer may access BlazorBootstrap components"
fi

if grep -REn -i 'ChartComponent|pax\\.BlazorChartJs|window\\.cytoscape|cytoscape' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "pages and layouts must use site-owned visual components instead of direct Chart.js/Cytoscape integrations"
fi

if grep -REn '<Site(NativeButton|LinkButton|FooterLink)[^>]*class="[^"]*btn' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Pages and Layout must use semantic site button variants instead of Bootstrap button classes"
fi

if grep -REn '<(button|select)([[:space:]]|>|$)|</(button|select)>' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Pages and Layout must use site-owned wrappers for buttons and selects"
fi

if grep -REn '<main([[:space:]]|>|$)|</main>' Portfolio/Portfolio.Blazor.Client/Pages 2>/dev/null; then
    fail "Pages must use the site-owned page shell instead of raw main elements"
fi

if ! grep -Eq '^@inherits[[:space:]]+InputBase<string>' Portfolio/Portfolio.Blazor.UI/Forms/SiteSelect.razor; then
    fail "SiteSelect must integrate with Blazor InputBase validation"
fi

if ! grep -q 'SiteValidationMessage' Portfolio/Portfolio.Blazor.UI/Forms/SiteSelect.razor; then
    fail "SiteSelect must render the site-owned validation message"
fi

if ! grep -q 'name="@Name"' Portfolio/Portfolio.Blazor.UI/Forms/SiteSelect.razor; then
    fail "SiteSelect must preserve named values for interactive form POSTs"
fi

if grep -REn '<(input|textarea)([[:space:]]|>|$)|</textarea>' \
    Portfolio/Portfolio.Blazor.Client/Pages 2>/dev/null; then
    fail "Pages must use site-owned wrappers for inputs and textareas"
fi

# IMPORTANT: the home feed's markup lives in Shared/ContentFeed.razor; Pages/Home.razor is only the
# routable wrapper that forwards the query string, so the listing rules check the component.
home_feed="Portfolio/Portfolio.Blazor.Client/Shared/ContentFeed.razor"
for page in Portfolio/Portfolio.Blazor.Client/Pages/Cases.razor Portfolio/Portfolio.Blazor.Client/Pages/Credits.razor Portfolio/Portfolio.Blazor.Client/Pages/Projects.razor Portfolio/Portfolio.Blazor.Client/Pages/Snippets.razor Portfolio/Portfolio.Blazor.Client/Pages/Technologies.razor Portfolio/Portfolio.Blazor.Client/Pages/Topics.razor Portfolio/Portfolio.Blazor.Client/Pages/Tools.razor "$home_feed"; do
    grep -Eq '<SitePagination\b|<SiteListingShell\b' "$page" || fail "${page} must use the shared pagination component or listing shell"
done

for page in "$home_feed" Portfolio/Portfolio.Blazor.Client/Pages/Topics.razor Portfolio/Portfolio.Blazor.Client/Pages/Snippets.razor Portfolio/Portfolio.Blazor.Client/Pages/Tools.razor; do
    grep -Eq '<SiteListingShell\b' "$page" || fail "${page} must use the shared filter/listing/pagination shell"
    grep -Eq '<FilterContent>' "$page" || fail "${page} must expose filters through the shared listing shell"
done

if grep -REn '<Site(ListHeader|Pagination)\b' Portfolio/Portfolio.Blazor.Client/Pages 2>/dev/null; then
    fail "Pages must not render list headers or pagination outside SiteListingShell"
fi

if grep -n '<svg' \
    Portfolio/Portfolio.Blazor.Client/Pages/Cases.razor \
    Portfolio/Portfolio.Blazor.Client/Pages/ContentDetail.razor \
    Portfolio/Portfolio.Blazor.Client/Pages/FindingTypeStub.razor \
    Portfolio/Portfolio.Blazor.Client/Pages/Projects.razor \
    Portfolio/Portfolio.Blazor.Client/Pages/Resume.razor \
    Portfolio/Portfolio.Blazor.Client/Pages/Snippets.razor \
    Portfolio/Portfolio.Blazor.Client/Layout/MainLayout.razor; then
    fail "public pages and layouts must use SiteIcon instead of inline UI SVGs"
fi

if grep -REn '<svg' Portfolio/Portfolio.Blazor.Client/Shared --include='*.razor' 2>/dev/null; then
    fail "shared UI components must use SiteIcon instead of inline UI SVGs"
fi

# SiteClickableCard for catalog-style listings, SiteFeedCard for the editorial feed: both are the
# shared, whole-surface-clickable cards the listings must go through instead of ad-hoc markup.
renders_clickable_card() {
    if grep -qE '<Site(Clickable|Feed)Card\b' "$1"; then
        return 0
    fi
    for component in $(grep -oE '<[A-Z][A-Za-z0-9]*' "$1" | tr -d '<' | sort -u); do
        composed="Portfolio/Portfolio.Blazor.Client/Shared/${component}.razor"
        if [ -f "$composed" ] && grep -qE '<Site(Clickable|Feed)Card\b' "$composed"; then
            return 0
        fi
    done
    return 1
}

for page in Portfolio/Portfolio.Blazor.Client/Pages/Cases.razor "$home_feed" Portfolio/Portfolio.Blazor.Client/Pages/Projects.razor Portfolio/Portfolio.Blazor.Client/Pages/Snippets.razor Portfolio/Portfolio.Blazor.Client/Pages/Technologies.razor Portfolio/Portfolio.Blazor.Client/Pages/Topics.razor Portfolio/Portfolio.Blazor.Client/Pages/Tools.razor; do
    renders_clickable_card "$page" ||
        fail "${page} must render entity listings through clickable site cards"
done

if grep -Eq '@using[[:space:]]+BlazorBootstrap|<Pagination([[:space:]]|>)|role="button"' \
    Portfolio/Portfolio.Blazor.UI/Navigation/SitePagination.razor; then
    fail "SitePagination must preserve semantic links instead of BB's button-based pagination"
fi

grep -Eq 'href="@Href\(|Href="@Href\(' Portfolio/Portfolio.Blazor.UI/Navigation/SitePagination.razor ||
    fail "SitePagination must emit real hrefs for progressive navigation"

app_shell_css="Portfolio/Portfolio.Blazor.UI/Templates/SiteAppShell.razor.css"
site_page_css="Portfolio/Portfolio.Blazor.UI/Layout/SitePage.razor.css"
sidebar_css="Portfolio/Portfolio.Blazor.Client/Shared/SiteSidebar.razor.css"

rule_declares() {
    tr '\n' ' ' <"$1" | grep -Eq "$2"
}

rule_declares "$app_shell_css" '\.page-shell \{[^}]*height: 100dvh' ||
    fail "the split-view root must own the viewport boundary"
rule_declares "$app_shell_css" '\.page-body \{[^}]*overflow: hidden' ||
    fail "the split-view wrapper must define the scrolling region"
rule_declares "$app_shell_css" '\.site-main-scroll \{[^}]*overflow-y: auto' ||
    fail "the split-view wrapper must be vertically scrollable"
rule_declares "$app_shell_css" '\.page-content \{[^}]*overflow-y: visible' ||
    fail "the page content region must not create a second vertical scrollbar"
rule_declares "$site_page_css" '\.site-page[^{]*\{[^}]*max-width: var\(--site-page-max\)' ||
    fail "the normal shell must preserve the centered max-width"
rule_declares "$sidebar_css" '\.site-nav \{[^}]*border-right: (0\.0625rem|var\(--site-border-width\)) solid' ||
    fail "the sidebar must preserve the separator border"

if grep -REn '[✉↗→➜➤]' Portfolio/Portfolio.Blazor.Client/Shared/SiteFooter.razor Portfolio/Portfolio.Blazor.Client/Shared/ContactChannels.razor 2>/dev/null; then
    fail "footer actions must use SiteIcon instead of Unicode icon characters"
fi

if grep -REn '<a([[:space:]]|>|$)|</a>' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Pages and Layout must use site-owned navigation link components"
fi

if grep -REn '<form([[:space:]>]|$)|</form>' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Pages and Layout must use site-owned form components"
fi

if grep -REn --include='*.razor' '<(button|select|input|textarea|form)([[:space:]>]|$)|</(button|select|input|textarea|form)>' \
    Portfolio/Portfolio.Blazor.Client 2>/dev/null |
    grep -v '/Shared/'; then
    fail "all client components outside Shared must use site-owned controls"
fi

if grep -REn --include='*.razor' '<a([[:space:]]|>|$)|</a>' \
    Portfolio/Portfolio.Blazor.Client 2>/dev/null |
    grep -v '/Shared/'; then
    fail "all client components outside Shared must use site-owned navigation links"
fi

if grep -REn '<label([[:space:]]|>|$)|</label>' \
    Portfolio/Portfolio.Blazor.Client/Pages 2>/dev/null; then
    fail "Pages must use site-owned form-field components for labels"
fi

if grep -REn '<(dl|dt|dd)([[:space:]>]|$)|</(dl|dt|dd)>' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Pages and Layout must use site-owned key-value/stat composition wrappers"
fi

if grep -REn '<(details|summary)([[:space:]>]|$)|</(details|summary)>' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Pages and Layout must use site-owned disclosure components"
fi

if grep -REn '<p[[:space:]][^>]*class="[^"]*alert[^"]*"' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Pages and Layout must use site-owned notice and error components"
fi

if grep -REn -i 'virtual[- ]select|VirtualSelect' \
    Portfolio/Portfolio.Blazor.Client/Pages Portfolio/Portfolio.Blazor.Client/Layout 2>/dev/null; then
    fail "Virtual Select integrations must stay inside the site UI layer"
fi

for lockfile in Portfolio/Portfolio.Blazor.Core/packages.lock.json \
    Portfolio/Portfolio.Blazor.Snapshot/packages.lock.json \
    Portfolio/Portfolio.Blazor.Sbom/packages.lock.json \
    Portfolio/Portfolio.Blazor.Core.Tests/packages.lock.json \
    Portfolio/Portfolio.Blazor.Client/packages.lock.json \
    Portfolio/Portfolio.Blazor/packages.lock.json \
    Portfolio/Portfolio.Blazor.UI/packages.lock.json \
    Portfolio/Portfolio.Blazor.Database/packages.lock.json \
    Portfolio/Portfolio.Blazor.Database.Postgres/packages.lock.json \
    Portfolio/Portfolio.Blazor.Data.Tests/packages.lock.json; do
    [ -f "$lockfile" ] || fail "$lockfile is missing"
done

sh -n tools/scripts/create-content-snapshot.sh || fail "the snapshot script has invalid shell syntax"
if sh tools/scripts/create-content-snapshot.sh 'portfolio-20260831T000000Z.sqlite;echo-pwned' >/dev/null 2>&1; then
    fail "the snapshot script accepted a shell metacharacter in its filename"
fi

echo "Blazor supply-chain checks passed"
