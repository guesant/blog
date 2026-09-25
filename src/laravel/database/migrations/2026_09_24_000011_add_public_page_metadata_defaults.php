<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const DEFAULTS = [
        'home' => [
            'en' => ['title' => 'Home'],
            'pt-BR' => ['title' => 'Início'],
        ],
        'portfolio' => [
            'en' => ['title' => 'Portfolio'],
            'pt-BR' => ['title' => 'Portfólio'],
        ],
    ];

    public function up(): void
    {
        DB::transaction(function (): void {
            foreach (self::DEFAULTS as $slug => $locales) {
                $revisionId = DB::table('pages')
                    ->where('slug', $slug)
                    ->value('current_revision_id');

                if ($revisionId === null) {
                    continue;
                }

                foreach ($locales as $locale => $defaults) {
                    $translation = DB::table('page_revision_translations')
                        ->where('page_revision_id', $revisionId)
                        ->where('locale', $locale)
                        ->first();

                    if ($translation === null) {
                        continue;
                    }

                    $updates = [];

                    if (blank($translation->title)) {
                        $updates['title'] = $defaults['title'];
                    }

                    if (blank($translation->description) && filled($translation->hero_experience)) {
                        $updates['description'] = $translation->hero_experience;
                    }

                    if ($updates !== []) {
                        $updates['updated_at'] = now();
                        DB::table('page_revision_translations')
                            ->where('id', $translation->id)
                            ->update($updates);
                    }
                }
            }
        });
    }

    public function down(): void
    {
        throw new RuntimeException('Public page metadata is editorial data and must be restored from a database backup.');
    }
};
