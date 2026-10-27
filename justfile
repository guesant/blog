set shell := ["sh", "-ceu"]

compose := "docker compose -f .docker/compose.yaml"

default: check

dev:
    {{ compose }} up --build hugo

build:
    if [ -f /.dockerenv ]; then hugo --minify --cleanDestinationDir; else {{ compose }} run --build --rm hugo --minify --cleanDestinationDir; fi

check: build test verify

test:
    if [ -f /.dockerenv ]; then bash scripts/test-lobby.sh; else {{ compose }} run --build --rm --entrypoint bash hugo scripts/test-lobby.sh; fi

verify:
    test -s public/index.html
    test -s public/sitemap.xml
    test -s public/robots.txt
    grep -q 'blog.guesant.net' public/sitemap.xml
    grep -qx 'blog.guesant.net' public/CNAME
