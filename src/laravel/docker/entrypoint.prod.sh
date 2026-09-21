#!/usr/bin/env bash
set -euo pipefail

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec php artisan serve --no-reload --host=0.0.0.0 --port=8000
