#!/bin/sh

set -eu

base_url="${1:-http://127.0.0.1:8080}"
verify_content="${VERIFY_CONTENT_PARITY:-true}"

fetch() {
    wget -qO- "${base_url}${1}"
}

contains() {
    route="$1"
    needle="$2"
    page="$(fetch "$route")"

    case "$page" in
        *"$needle"*) ;;
        *)
            echo "structural parity check failed: ${route} is missing ${needle}" >&2
            exit 1
            ;;
    esac
}

assert_once() {
    route="$1"
    needle="$2"
    page="$(fetch "$route")"
    count="$(printf '%s' "$page" | grep -o "$needle" | wc -l | tr -d ' ')"

    if [ "$count" -ne 1 ]; then
        echo "structural parity check failed: ${route} contains ${count} occurrences of ${needle}, expected one" >&2
        exit 1
    fi
}

not_contains() {
    route="$1"
    needle="$2"
    page="$(fetch "$route")"

    case "$page" in
        *"$needle"*)
            echo "structural parity check failed: ${route} contains forbidden ${needle}" >&2
            exit 1
            ;;
        *) ;;
    esac
}

assert_local_assets() {
    route="$1"
    page="$(fetch "$route")"
    external="$(printf '%s' "$page" | grep -Eo '<script[^>]*src="[^"]+|<link[^>]*rel="stylesheet"[^>]*href="[^"]+' | grep -E 'https?://|//' || true)"

    if [ -n "$external" ]; then
        echo "structural parity check failed: ${route} references an external script or stylesheet" >&2
        exit 1
    fi
}

assert_no_razor_literals() {
    route="$1"
    page="$(fetch "$route")"

    if printf '%s' "$page" | grep -Eq '>[[:space:]]*(\}|else)([[:space:]]*<|[[:space:]]*$)'; then
        echo "structural parity check failed: ${route} contains unrendered Razor control-flow text" >&2
        exit 1
    fi
}

assert_order() {
    route="$1"
    shift
    page="$(fetch "$route" | tr -d '\r\n')"
    offset=0

    for needle in "$@"; do
        position="$(printf '%s' "$page" | perl -0777 -e '
            my $content = do { local $/; <STDIN> };
            my $position = index($content, $ARGV[0], $ARGV[1]);
            print $position >= 0 ? $position + 1 : 0;
        ' "$needle" "$offset")"

        if [ "$position" -eq 0 ]; then
            echo "structural parity check failed: ${route} has the wrong order around ${needle}" >&2
            exit 1
        fi

        offset="$position"
    done
}

assert_sidebar_link_once() {
    route="$1"
    href="$2"
    page="$(fetch "$route")"
    sidebar="$(printf '%s' "$page" | perl -0777 -ne 'if (/<aside class="site-nav\b(.*?)<\/aside>/s) { my $value = $1; $value =~ s/<header.*?<\/header>//s; print $value }')"
    count="$(printf '%s' "$sidebar" | grep -o "href=\"${href}\"" | wc -l | tr -d ' ')"

    if [ "$count" -ne 1 ]; then
        echo "structural parity check failed: ${route} sidebar contains ${count} occurrences of ${href}, expected one" >&2
        exit 1
    fi
}

assert_secondary_sidebar_link_once() {
    route="$1"
    href="$2"
    page="$(fetch "$route")"
    sidebar="$(printf '%s' "$page" | perl -0777 -ne 'if (/<aside class="site-nav site-sidebar-right\b(.*?)<\/aside>/s) { print $1 }')"
    count="$(printf '%s' "$sidebar" | grep -o "href=\"${href}\"" | wc -l | tr -d ' ')"

    if [ "$count" -ne 1 ]; then
        echo "structural parity check failed: ${route} right sidebar contains ${count} occurrences of ${href}, expected one" >&2
        exit 1
    fi
}

assert_sidebar_links_unique() {
    route="$1"
    page="$(fetch "$route")"
    sidebar="$(printf '%s' "$page" | perl -0777 -ne '
        while (/<(?:nav class="site-nav-links\b|div class="site-sidebar-secondary\b)(.*?)<\/(?:nav|div)>/sg) {
            print $1;
        }
    ')"
    duplicates="$(printf '%s' "$sidebar" | grep -o 'href="/[^"]*"' | sort | uniq -d || true)"

    if [ -n "$duplicates" ]; then
        echo "structural parity check failed: ${route} sidebar contains duplicate links: ${duplicates}" >&2
        exit 1
    fi
}

assert_redirect() {
    route="$1"
    target="$2"
    headers="$(wget -S -O /dev/null --max-redirect=0 "${base_url}${route}" 2>&1 || true)"

    case "$headers" in
        *'HTTP/1.1 301 Moved Permanently'*"Location: ${target}"*) ;;
        *)
            echo "structural parity check failed: ${route} did not redirect permanently to ${target}" >&2
            exit 1
            ;;
    esac
}

assert_temporary_redirect() {
    route="$1"
    target="$2"
    headers="$(wget -S -O /dev/null --max-redirect=0 "${base_url}${route}" 2>&1 || true)"

    case "$headers" in
        *'HTTP/1.1 302 Found'*"Location: ${target}"*) ;;
        *)
            echo "structural parity check failed: ${route} did not redirect temporarily to ${target}" >&2
            exit 1
            ;;
    esac
}

assert_stable_response() {
    route="$1"
    first="$(fetch "$route" | sha256sum | awk '{print $1}')"
    second="$(fetch "$route" | sha256sum | awk '{print $1}')"
    if [ "$first" != "$second" ]; then
        echo "structural parity check failed: ${route} changed between immediate reads and is not using the runtime cache" >&2
        exit 1
    fi
}

assert_shell_once() {
    route="$1"
    page="$(fetch "$route")"

    count="$(printf '%s' "$page" | grep -o '<aside class="site-nav' | wc -l | tr -d ' ')"
    if [ "$count" -ne 2 ]; then
        echo "structural parity check failed: ${route} contains ${count} occurrences of <aside class=\"site-nav, expected two" >&2
        exit 1
    fi

    for marker in '<nav class="site-nav-links' '<footer class="site-footer'; do
        count="$(printf '%s' "$page" | grep -o "$marker" | wc -l | tr -d ' ')"
        if [ "$count" -ne 1 ]; then
            echo "structural parity check failed: ${route} contains ${count} occurrences of ${marker}, expected one" >&2
            exit 1
        fi
    done
}

assert_listing_contract() {
    route="$1"
    expected_shells="$2"
    page="$(fetch "$route")"

    for marker in 'class="site-listing-shell' 'class="site-listing-summary' 'class="site-listing-filters' 'class="site-listing-toolbar' 'class="site-listing-results' 'class="site-listing-pagination'; do
        count="$(printf '%s' "$page" | grep -o "$marker" | wc -l | tr -d ' ')"
        if [ "$count" -ne "$expected_shells" ]; then
            echo "structural parity check failed: \${route} contains \${count} occurrences of \${marker}, expected \${expected_shells}" >&2
            exit 1
        fi
    done

    # IMPORTANT: filters now precede the summary. SiteListingShell puts the count
    # directly above the results it describes, instead of above the filter card as
    # the pre-migration markup did.
    assert_order "$route" \
        'class="site-listing-filters' \
        'class="site-listing-summary' \
        'class="site-listing-toolbar' \
        'class="site-listing-results' \
        'class="site-listing-pagination'
}

assert_index_order() {
    route="$1"
    items_marker="$2"
    page="$(fetch "$route")"

    case "$page" in
        *'class="index-empty'*)
            assert_order "$route" \
                'class="breadcrumb-bar"' \
                'class="hero' \
                'class="index-empty'
            ;;
        *)
            assert_order "$route" \
                'class="breadcrumb-bar"' \
                'class="hero' \
                'data-layout-region="list-header"' \
                "$items_marker"
            ;;
    esac
}

attempt=0
until wget -qO- "${base_url}/" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 30 ]; then
        echo "structural parity check failed: ${base_url} did not become ready" >&2
        exit 1
    fi
    sleep 1
done

for public_route in \
    / /about /portfolio /now /license /follow /resume /contact /credits /knowledge-map \
    /projects /projects/meu-caderno /cases /cases/scrap-rain /writing/engenharia-do-portfolio \
    /findings/ddia /collections/distributed-systems-starter-kit \
    /topics /topics/ai /technologies /technologies/dotnet /snippets /snippets/example \
    /tools /tools/age-calculator /tools/linear-systems /tools/linear-system-2x2 /tools/linear-system-3x3 \
    /pt-BR/ /pt-BR/about /pt-BR/portfolio /pt-BR/now /pt-BR/license /pt-BR/follow /pt-BR/resume /pt-BR/contact /pt-BR/credits /pt-BR/knowledge-map \
    /pt-BR/projects /pt-BR/projects/meu-caderno /pt-BR/cases /pt-BR/cases/scrap-rain /pt-BR/writing/engenharia-do-portfolio \
    /pt-BR/findings/ddia /pt-BR/collections/distributed-systems-starter-kit \
    /pt-BR/topics /pt-BR/topics/ai /pt-BR/technologies /pt-BR/technologies/dotnet /pt-BR/snippets /pt-BR/snippets/example \
    /pt-BR/tools /pt-BR/tools/age-calculator /pt-BR/tools/linear-systems /pt-BR/tools/linear-system-2x2 /pt-BR/tools/linear-system-3x3; do
    assert_local_assets "$public_route"
    assert_no_razor_literals "$public_route"
    not_contains "$public_route" 'href="/home"'
    contains "$public_route" 'id="main-content" tabindex="-1"'
    contains "$public_route" 'class="breadcrumb-bar"'
    assert_once "$public_route" 'class="breadcrumb-bar"'
done

for listing_route in \
    / /findings/types/book /topics /technologies /snippets /projects /cases /credits /tools \
    /pt-BR/ /pt-BR/findings/types/book /pt-BR/topics /pt-BR/technologies /pt-BR/snippets /pt-BR/projects /pt-BR/cases /pt-BR/credits /pt-BR/tools; do
    contains "$listing_route" 'data-layout-region="pagination"'
done

for listing_route in \
    / /findings/types/book /topics /technologies /snippets /cases /credits /tools \
    /pt-BR/ /pt-BR/findings/types/book /pt-BR/topics /pt-BR/technologies /pt-BR/snippets /pt-BR/cases /pt-BR/credits /pt-BR/tools; do
    assert_listing_contract "$listing_route" 1
done
assert_listing_contract "/projects" 2
assert_listing_contract "/pt-BR/projects" 2

for localized_route in /pt-BR/ /pt-BR/projects /pt-BR/cases /pt-BR/topics /pt-BR/technologies /pt-BR/snippets; do
    not_contains "$localized_route" 'href="/pt-BR/home"'
done

assert_order "/" \
    '<a class="skip-link"' \
    '<div class="page' \
    '<aside class="site-nav' \
    '<div class="page-body' \
    '<main' \
    'id="main-content"' \
    '<footer class="site-footer'
assert_order "/pt-BR/" \
    '<a class="skip-link"' \
    '<div class="page' \
    '<aside class="site-nav' \
    '<div class="page-body' \
    '<main' \
    'id="main-content"' \
    '<footer class="site-footer'
contains "/projects/experiments/demo" 'data-page-template="project-detail"'
contains "/projects/meu-caderno" 'data-page-template="content-detail"'
contains "/cases/scrap-rain" 'data-page-template="content-detail"'
contains "/writing/engenharia-do-portfolio" 'data-page-template="content-detail"'
contains "/writing/engenharia-do-portfolio" 'data-layout-region="topics"'
contains "/findings/types/book" 'data-page-template="finding-list"'
contains "/findings/ddia" 'data-page-template="finding-detail"'
contains "/about" 'data-page-template="about"'
contains "/portfolio" 'data-page-template="portfolio"'
contains "/" 'href="/"'
contains "/pt-BR/portfolio" 'href="/pt-BR"'
assert_temporary_redirect "/now" "http://127.0.0.1:8080/about#now"
assert_temporary_redirect "/pt-BR/now" "http://127.0.0.1:8080/pt-BR/about#now"
contains "/license" 'data-page-template="license"'
contains "/follow" 'data-page-template="follow"'
contains "/resume" 'data-page-template="resume"'
contains "/resume" 'href="/storage/resume-en.pdf"'
contains "/resume" 'href="/storage/resume-pt-BR.pdf"'
contains "/contact" 'data-page-template="contact"'
contains "/credits" 'data-page-template="credits"'
contains "/knowledge-map" 'data-page-template="knowledge-map"'
contains "/knowledge-map/data" '"nodes"'
contains "/pt-BR/knowledge-map/data" '"nodes"'
assert_stable_response "/_content/public-site?locale=en"
assert_stable_response "/_content/public-site?locale=pt-BR"
assert_stable_response "/knowledge-map/data"
assert_stable_response "/pt-BR/knowledge-map/data"
contains "/feed.xml" '<rss'
contains "/pt-BR/feed.xml" '<rss'
contains "/atom.xml" '<feed'
contains "/pt-BR/atom.xml" '<feed'
contains "/feed.json" 'jsonfeed.org'
contains "/pt-BR/feed.json" 'jsonfeed.org'
contains "/sitemap.xml" 'urlset'
contains "/robots.txt" 'Sitemap:'
contains "/projects" 'data-page-template="projects-index"'
contains "/cases" 'data-page-template="cases-index"'
contains "/technologies" 'data-page-template="technologies-index"'
contains "/snippets" 'data-page-template="snippets-index"'

for sidebar_route in /topics /tools; do
    assert_sidebar_link_once "/" "$sidebar_route"
done
assert_secondary_sidebar_link_once "/" "/about"
assert_secondary_sidebar_link_once "/" "/follow"
for shell_route in / /cases /projects /pt-BR/; do
    assert_shell_once "$shell_route"
done
for sidebar_route in /topics /tools; do
    assert_sidebar_link_once "/pt-BR/" "/pt-BR${sidebar_route}"
done
assert_secondary_sidebar_link_once "/pt-BR/" "/pt-BR/about"
assert_secondary_sidebar_link_once "/pt-BR/" "/pt-BR/follow"
for hub_link in "/?kind=colecao" /knowledge-map; do
    contains "/topics" "href=\"${hub_link}\""
done
for hub_link in /cases /projects; do
    contains "/portfolio" "href=\"${hub_link}\""
done
for hub_link in /portfolio /resume; do
    contains "/about" "href=\"${hub_link}\""
done

assert_sidebar_links_unique "/"
assert_sidebar_links_unique "/pt-BR/"
contains "/" 'class="site-toggle-group lang-switch"'
contains "/" 'class="site-control nav-link sidebar-action'
contains "/" 'class="site-sidebar-primary-links"'
contains "/" 'about me'
not_contains "/" 'mailto:'
contains "/" 'data-protected-email-trigger="true"'
# IMPORTANT: contact channels moved from the footer into the right sidebar, so they
# now carry sidebar-action instead of footer-action.
contains "/" 'class="site-control sidebar-action email-reveal-trigger'
contains "/" 'some rights reserved'
not_contains "/" 'Some rights reserved'
not_contains "/" 'language-action'
not_contains "/pt-BR/" 'language-action'
contains "/pt-BR/" 'class="site-toggle-group lang-switch"'
contains "/pt-BR/" 'class="site-control nav-link sidebar-action'
contains "/pt-BR/" 'sobre mim'
not_contains "/pt-BR/" 'mailto:'
contains "/pt-BR/" 'data-protected-email-trigger="true"'
contains "/pt-BR/" 'class="site-control sidebar-action email-reveal-trigger'
contains "/pt-BR/" 'alguns direitos reservados'
not_contains "/pt-BR/" 'Alguns direitos reservados'

assert_redirect "/projetos" "/projects"
assert_redirect "/projetos/experimentos/demo" "/projects/experiments/demo"
assert_redirect "/projetos/meu-caderno" "/projects/meu-caderno"
assert_redirect "/escritos" "/?kind=post"
assert_redirect "/escritos/engenharia-do-portfolio" "/writing/engenharia-do-portfolio"
assert_redirect "/sobre" "/about"
assert_redirect "/contato" "/contact"
assert_redirect "/curriculo" "/resume"
assert_redirect "/achados" "/?kind=achado"
assert_redirect "/achados/tipos/book" "/findings/types/book"
assert_redirect "/achados/ddia" "/findings/ddia"
assert_redirect "/topicos" "/topics"
assert_redirect "/topicos/ai" "/topics/ai"
assert_redirect "/agora" "/now"
assert_redirect "/colecoes" "/?kind=colecao"
assert_redirect "/colecoes/distributed-systems-starter-kit" "/collections/distributed-systems-starter-kit"

contains "/collections/distributed-systems-starter-kit" 'data-page-template="collection-detail"'
contains "/topics/ai" 'data-page-template="topic-detail"'
contains "/technologies/dotnet" 'data-page-template="technology-detail"'
contains "/snippets/example" 'data-page-template="snippet-detail"'
contains "/" '"@type":"Person"'
contains "/writing/engenharia-do-portfolio" '"@type":"Article"'
contains "/snippets" '"@type":"CollectionPage"'
contains "/snippets/example" '"@type":"SoftwareSourceCode"'
contains "/knowledge-map" '"@type":"WebPage"'
if [ "$verify_content" = "true" ]; then
    # IMPORTANT: the dense listing view was dropped in the component refactor, so only
    # the spacious grid is asserted here.
    assert_order "/projects" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="sort-filter"' \
        'data-layout-region="list-header"' \
        'id="view-spacious-projects"'
    assert_order "/cases" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="sort-filter"' \
        'data-layout-region="list-header"' \
        'id="view-spacious-cases"'
    assert_order "/projects/meu-caderno" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="tags"' \
        'data-layout-region="content-footer"'
    assert_order "/cases/scrap-rain" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="facts"' \
        'data-layout-region="content-footer"'
    assert_order "/contact" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="channels"'
    not_contains "/contact" '<form'
    assert_order "/license" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="license"'
    assert_order "/findings/ddia" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="connections"' \
        'data-layout-region="content-actions"' \
        'data-layout-region="related-content"'
    assert_index_order "/" 'data-layout-region="items"'
    assert_index_order "/technologies" 'data-layout-region="items"'
    assert_index_order "/snippets" 'data-layout-region="items"'
    assert_order "/collections/distributed-systems-starter-kit" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="intro"' \
        'data-layout-region="resource-list"' \
        'data-layout-region="content-actions"'
    assert_order "/topics/ai" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="writing"'
    assert_order "/technologies/dotnet" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="skills"'
    assert_order "/knowledge-map" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="graph"' \
        'data-layout-region="text-fallback"' \
        'data-layout-region="relations"'
    assert_order "/credits" \
        'class="breadcrumb-bar"' \
        'class="hero' \
        'data-layout-region="sort-filter"' \
        'data-layout-region="list-header"'
    contains "/follow" 'WebFinger'
else
    echo "content parity checks skipped: content verification is disabled"
fi
contains "/tools/age-calculator" 'data-tool-state="functional"'
contains "/pt-BR/tools/age-calculator" 'data-tool-state="functional"'
contains "/tools/bmi-calculator" 'data-tool-state="functional"'
contains "/tools/date-difference-calculator" 'data-tool-state="functional"'
contains "/tools/text-counter" 'data-page-template="tool"'
contains "/tools/data-cleaner" 'data-tool="data-cleaner"'
not_contains "/tools/data-cleaner" 'data-tool-state="stub"'
contains "/" 'href="/about"'
not_contains "/" 'href="mailto:'
contains "/" 'data-protected-email-revealed="true"'
contains "/" 'aria-label="language"'

echo "structural parity checks passed"
