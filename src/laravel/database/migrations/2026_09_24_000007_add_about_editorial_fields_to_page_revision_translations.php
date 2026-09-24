<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const COLUMNS = [
        'introduction',
        'timeline_eyebrow',
        'timeline_title',
        'timeline_description',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('page_revision_translations')) {
            return;
        }

        Schema::table('page_revision_translations', function (Blueprint $table): void {
            foreach (self::COLUMNS as $column) {
                if (! Schema::hasColumn('page_revision_translations', $column)) {
                    $table->text($column)->nullable();
                }
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('page_revision_translations')) {
            return;
        }

        $columns = array_values(array_filter(
            self::COLUMNS,
            static fn (string $column): bool => Schema::hasColumn('page_revision_translations', $column),
        ));

        if ($columns !== []) {
            Schema::table('page_revision_translations', function (Blueprint $table) use ($columns): void {
                $table->dropColumn($columns);
            });
        }
    }
};
