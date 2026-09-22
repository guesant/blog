<?php

namespace App\Content;

use App\Models\RevisionTranslationProxy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class RevisionTranslationFactory
{
    private const DEFINITIONS = [
        'case_studies' => ['revision' => 'case_study_revisions', 'translation' => 'case_study_revision_translations', 'revision_key' => 'case_study_revision_id', 'content_type' => 'case_study'],
        'experiments' => ['revision' => 'experiment_revisions', 'translation' => 'experiment_revision_translations', 'revision_key' => 'experiment_revision_id', 'content_type' => 'experiment'],
        'projects' => ['revision' => 'project_revisions', 'translation' => 'project_revision_translations', 'revision_key' => 'project_revision_id', 'content_type' => 'project'],
        'reference_collections' => ['revision' => 'reference_collection_revisions', 'translation' => 'reference_collection_revision_translations', 'revision_key' => 'reference_collection_revision_id', 'content_type' => 'reference_collection'],
        'writings' => ['revision' => 'writing_revisions', 'translation' => 'writing_revision_translations', 'revision_key' => 'writing_revision_id', 'content_type' => 'writing'],
        'site_settings' => ['revision' => 'site_settings_revisions', 'translation' => 'site_settings_revision_translations', 'revision_key' => 'site_settings_revision_id', 'content_type' => 'site_settings'],
        'nav_items' => ['revision' => 'nav_item_revisions', 'translation' => 'nav_item_revision_translations', 'revision_key' => 'nav_item_revision_id', 'content_type' => 'nav_item'],
        'credit_entries' => ['revision' => 'credit_entry_revisions', 'translation' => 'credit_entry_revision_translations', 'revision_key' => 'credit_entry_revision_id', 'content_type' => 'credit_entry'],
        'snippets' => ['revision' => 'snippet_revisions', 'translation' => 'snippet_revision_translations', 'revision_key' => 'snippet_revision_id', 'content_type' => 'snippet'],
        'technologies' => ['revision' => 'technology_revisions', 'translation' => 'technology_revision_translations', 'revision_key' => 'technology_revision_id', 'content_type' => 'technology'],
        'topics' => ['revision' => 'topic_revisions', 'translation' => 'topic_revision_translations', 'revision_key' => 'topic_revision_id', 'content_type' => 'topic'],
        'languages' => ['revision' => 'language_revisions', 'translation' => 'language_revision_translations', 'revision_key' => 'language_revision_id', 'content_type' => 'language'],
    ];

    public function for(Model $model, ?string $locale = null): ?RevisionTranslationProxy
    {
        $definition = self::DEFINITIONS[$model->getTable()] ?? null;
        $revisionId = $model->getAttribute('current_revision_id');
        if ($definition === null || $revisionId === null) {
            return null;
        }

        $revision = DB::table($definition['revision'])->where('id', $revisionId)->first();
        if ($revision === null) {
            return null;
        }

        $normalized = Locale::normalize($locale);
        $translation = DB::table($definition['translation'])
            ->where($definition['revision_key'], $revisionId)
            ->whereIn('locale', [$normalized, 'en'])
            ->orderByRaw('CASE WHEN locale = ? THEN 0 ELSE 1 END', [$normalized])
            ->first();

        if ($translation === null) {
            return null;
        }

        $proxy = new RevisionTranslationProxy(array_merge((array) $revision, (array) $translation));
        $translationId = $translation->id;
        $proxy->setAttribute('seo', $this->seo($definition['content_type'], $translationId));
        $proxy->setAttribute('metrics', $this->metrics($definition['content_type'], $translationId));

        return $proxy;
    }

    private function seo(string $contentType, int $translationId): ?array
    {
        $seo = DB::table('content_revision_seo')
            ->where('content_type', $contentType)
            ->where('translation_id', $translationId)
            ->first();

        return $seo === null ? null : [
            'title' => $seo->title,
            'description' => $seo->description,
            'canonical' => $seo->canonical_url,
            'image' => $seo->image_url,
            'imageAlt' => $seo->image_alt,
            'robots' => $seo->robots,
            'noIndex' => $seo->no_index,
            'keywords' => DB::table('content_revision_seo_keywords')
                ->where('content_type', $contentType)
                ->where('translation_id', $translationId)
                ->orderBy('sort_order')
                ->pluck('keyword')
                ->all(),
        ];
    }

    private function metrics(string $contentType, int $translationId): array
    {
        return DB::table('content_revision_metrics')
            ->where('content_type', $contentType)
            ->where('translation_id', $translationId)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (object $metric): array => [
                'name' => $metric->name,
                'value' => $metric->value,
                'unit' => $metric->unit,
            ])
            ->all();
    }
}
