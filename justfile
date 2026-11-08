set shell := ["sh", "-ceu"]

default: check

dev:
    hugo server --bind 0.0.0.0 --disableFastRender

build:
    hugo --minify --cleanDestinationDir

check: build test verify

test:
    bash scripts/test-lobby.sh

verify:
    test -s public/index.html
    test -s public/sitemap.xml
    test -s public/robots.txt
    grep -q 'blog.guesant.net' public/sitemap.xml
    grep -qx 'blog.guesant.net' public/CNAME
