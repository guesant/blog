<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('page_translations')->orderBy('id')->each(function (object $translation): void {
            $revisionId = DB::table('pages')->where('id', $translation->page_id)->value('current_revision_id');
            if ($revisionId === null) {
                return;
            }

            $fields = json_decode((string) $translation->fields, true);
            if (! is_array($fields)) {
                return;
            }

            $columns = [];
            foreach ($fields as $key => $value) {
                $column = Str::snake((string) $key);
                if (is_string($value) && DB::getSchemaBuilder()->hasColumn('page_revision_translations', $column)) {
                    $columns[$column] = $value;
                }
            }

            if ($columns === []) {
                return;
            }

            DB::table('page_revision_translations')
                ->where('page_revision_id', $revisionId)
                ->where('locale', $translation->locale)
                ->update($columns + ['updated_at' => now()]);
        });
    }

    public function down(): void {}
};
