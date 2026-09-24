<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $revisionIds = DB::table('pages')
                ->where('slug', 'achados')
                ->whereNotNull('current_revision_id')
                ->pluck('current_revision_id');

            if ($revisionIds->isEmpty()) {
                return;
            }

            DB::table('page_revision_translations')
                ->whereIn('page_revision_id', $revisionIds)
                ->where('locale', 'pt-BR')
                ->update(['title' => 'Coisas que Encontrei']);
        });
    }

    public function down(): void
    {
        throw new RuntimeException('Page titles are editorial data and must be restored from a database backup.');
    }
};
