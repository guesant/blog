<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const PAGE_SLUGS = ['home', 'portfolio'];

    private const CURRENT_LABEL = 'Available for Opportunities';

    private const LEGACY_LABELS = [
        'Avaiable for Oportunities',
        'Available for software development opportunities',
    ];

    public function up(): void
    {
        DB::transaction(function (): void {
            $revisionIds = DB::table('pages')
                ->whereIn('slug', self::PAGE_SLUGS)
                ->whereNotNull('current_revision_id')
                ->pluck('current_revision_id');

            if ($revisionIds->isEmpty()) {
                return;
            }

            DB::table('page_revision_translations')
                ->whereIn('page_revision_id', $revisionIds)
                ->where('locale', 'en')
                ->whereIn('available_label', self::LEGACY_LABELS)
                ->update([
                    'available_label' => self::CURRENT_LABEL,
                    'updated_at' => now(),
                ]);
        });
    }

    public function down(): void
    {
        throw new RuntimeException('Public availability labels are editorial data and must be restored from a database backup.');
    }
};
