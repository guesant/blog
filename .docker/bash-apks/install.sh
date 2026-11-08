#!/bin/sh
set -eu

case "$1" in
arm64) architecture=aarch64 ;;
amd64) architecture=x86_64 ;;
*) exit 2 ;;
esac

cd /tmp/bash-apks
while read -r checksum package; do
  test -n "$checksum"
  wget -q "https://dl-cdn.alpinelinux.org/alpine/v3.24/main/$architecture/$package"
done <"$1.sha256"
sha256sum -c "$1.sha256"
apk add --no-network ./*.apk
