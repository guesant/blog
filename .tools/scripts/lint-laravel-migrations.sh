#!/usr/bin/env sh
set -eu

migrations_dir=${1:-/workspace/src/laravel/database/migrations}

find "$migrations_dir" -type f -name '*.php' -print |
  while IFS= read -r migration; do
    grep -q 'function up' "$migration"
    grep -q 'function down' "$migration"

    if grep -Eq 'Schema::drop\(' "$migration" ||
      (grep -Eq 'DROP TABLE' "$migration" && ! grep -Eq 'DROP TABLE IF EXISTS' "$migration"); then
      printf 'unsafe destructive migration operation: %s\n' "$migration" >&2
      exit 1
    fi
  done
