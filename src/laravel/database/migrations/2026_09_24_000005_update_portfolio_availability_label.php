<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $revisionIds = DB::table('pages')
                ->where('slug', 'portfolio')
                ->whereNotNull('current_revision_id')
                ->pluck('current_revision_id');

            if ($revisionIds->isEmpty()) {
                return;
            }

            DB::table('page_revision_translations')
                ->whereIn('page_revision_id', $revisionIds)
                ->where('locale', 'en')
                ->update([
                    'available_label' => 'Avaiable for Oportunities',
                    'updated_at' => now(),
                ]);

            DB::table('page_revision_translations')
                ->whereIn('page_revision_id', $revisionIds)
                ->where('locale', 'pt-BR')
                ->update([
                    'available_label' => 'Disponível para Oportunidades',
                    'updated_at' => now(),
                ]);
        });
    }

    public function down(): void
    {
        throw new RuntimeException('Portfolio availability labels are editorial data and must be restored from a database backup.');
    }
};
