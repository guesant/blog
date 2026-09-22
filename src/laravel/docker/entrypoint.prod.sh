#!/usr/bin/env bash
set -euo pipefail

php artisan config:cache
php artisan route:cache
php artisan view:cache

export XDG_CONFIG_HOME=/tmp/frankenphp/config
export XDG_DATA_HOME=/tmp/frankenphp/data
mkdir -p "$XDG_CONFIG_HOME" "$XDG_DATA_HOME"

exec frankenphp php-server --root=/app/public --listen=:8000
