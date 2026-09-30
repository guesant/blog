<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const LEGACY_KEYS = [
        'recent-writing',
        'recent-findings',
        'recent-collections',
        'popular-writing',
        'popular-findings',
        'popular-collections',
    ];

    public function up(): void
    {
        $revisionIds = DB::table('page_revisions')
            ->join('pages', 'pages.id', '=', 'page_revisions.page_id')
            ->where('pages.slug', 'home')
            ->pluck('page_revisions.id');

        foreach ($revisionIds as $revisionId) {
            $sections = DB::table('page_revision_home_sections')
                ->where('page_revision_id', $revisionId)
                ->get(['section_key', 'enabled', 'sort_order']);

            if ($sections->contains('section_key', 'feed')) {
                continue;
            }

            $enabled = $sections
                ->whereIn('section_key', self::LEGACY_KEYS)
                ->contains(static fn (object $section): bool => (bool) $section->enabled);

            $sortOrder = ((int) $sections->max('sort_order')) + 1;
            $now = now();

            DB::table('page_revision_home_sections')->insert([
                'page_revision_id' => $revisionId,
                'section_key' => 'feed',
                'enabled' => $sections->isEmpty() || $enabled,
                'sort_order' => $sortOrder,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('page_revision_home_sections')
            ->where('section_key', 'feed')
            ->delete();
    }
};
