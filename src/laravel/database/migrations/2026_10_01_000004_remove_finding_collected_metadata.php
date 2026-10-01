<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const COLUMNS = [
        'popularity_kind',
        'popularity_rank',
        'popularity_refreshed_at',
        'popularity_value',
    ];

    public function up(): void
    {
        DB::statement('DROP INDEX IF EXISTS resources_public_popularity_idx');

        foreach (['resources', 'resource_revisions'] as $table) {
            $this->dropColumns($table);
        }
    }

    public function down(): void
    {
        foreach (['resources', 'resource_revisions'] as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            Schema::table($table, function (Blueprint $blueprint) use ($table): void {
                foreach (self::COLUMNS as $column) {
                    if (Schema::hasColumn($table, $column)) {
                        continue;
                    }

                    match ($column) {
                        'popularity_kind' => $blueprint->string($column)->nullable(),
                        'popularity_rank' => $blueprint->double($column)->nullable(),
                        'popularity_refreshed_at' => $blueprint->dateTime($column)->nullable(),
                        'popularity_value' => $blueprint->bigInteger($column)->nullable(),
                    };
                }
            });
        }
    }

    private function dropColumns(string $table): void
    {
        if (! Schema::hasTable($table)) {
            return;
        }

        $columns = array_values(array_filter(
            self::COLUMNS,
            static fn (string $column): bool => Schema::hasColumn($table, $column),
        ));

        if ($columns === []) {
            return;
        }

        Schema::table($table, static function (Blueprint $blueprint) use ($columns): void {
            $blueprint->dropColumn($columns);
        });
    }
};
