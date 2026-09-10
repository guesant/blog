#!/bin/sh

set -eu

base_url="${1:-http://127.0.0.1:8080}"

attempt=0
until wget -qO- "${base_url}/" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 30 ]; then
        echo "route shell check failed: ${base_url} did not become ready" >&2
        exit 1
    fi
    sleep 1
done

for route in \
    / /about /portfolio /license /follow /resume /contact /credits /knowledge-map \
    /projects /projects/example /projects/experiments/example /cases /cases/example /writing/example \
    /findings/example /findings/types/book /collections/example \
    /topics /topics/example /technologies /technologies/example /snippets /snippets/example /tools \
    /pt-BR/ /pt-BR/about /pt-BR/portfolio /pt-BR/license /pt-BR/follow /pt-BR/resume /pt-BR/contact /pt-BR/credits /pt-BR/knowledge-map \
    /pt-BR/projects /pt-BR/projects/example /pt-BR/projects/experiments/example /pt-BR/cases /pt-BR/cases/example /pt-BR/writing/example \
    /pt-BR/findings/example /pt-BR/findings/types/book /pt-BR/collections/example \
    /pt-BR/topics /pt-BR/topics/example /pt-BR/technologies /pt-BR/technologies/example /pt-BR/snippets /pt-BR/snippets/example /pt-BR/tools; do
    page="$(wget -qO- "${base_url}${route}")"
    for marker in 'id="main-content" tabindex="-1"' 'class="breadcrumb-bar"' 'class="site-footer'; do
        case "$page" in
            *"$marker"*) ;;
            *)
                echo "route shell check failed: ${route} is missing ${marker}" >&2
                exit 1
                ;;
        esac
    done
done

echo "route shell checks passed"
