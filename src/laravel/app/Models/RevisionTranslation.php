<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

abstract class RevisionTranslation extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function getSeoAttribute(): ?array
    {
        $seo = DB::table('content_revision_seo')
            ->where('content_type', $this->contentType())
            ->where('translation_id', $this->id)
            ->first();

        if ($seo === null) {
            return null;
        }

        return [
            'title' => $seo->title,
            'description' => $seo->description,
            'canonical' => $seo->canonical_url,
            'image' => $seo->image_url,
            'imageAlt' => $seo->image_alt,
            'robots' => $seo->robots,
            'noIndex' => $seo->no_index,
            'keywords' => DB::table('content_revision_seo_keywords')
                ->where('content_type', $this->contentType())
                ->where('translation_id', $this->id)
                ->orderBy('sort_order')
                ->pluck('keyword')
                ->all(),
        ];
    }

    public function getMetricsAttribute(): array
    {
        return DB::table('content_revision_metrics')
            ->where('content_type', $this->contentType())
            ->where('translation_id', $this->id)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (object $metric): array => [
                'name' => $metric->name,
                'value' => $metric->value,
                'unit' => $metric->unit,
            ])
            ->all();
    }

    private function contentType(): string
    {
        return match ($this->getTable()) {
            'case_study_revision_translations' => 'case_study',
            'experiment_revision_translations' => 'experiment',
            'project_revision_translations' => 'project',
            'reference_collection_revision_translations' => 'reference_collection',
            'writing_revision_translations' => 'writing',
            'site_settings_revision_translations' => 'site_settings',
            'nav_item_revision_translations' => 'nav_item',
            'credit_entry_revision_translations' => 'credit_entry',
            'snippet_revision_translations' => 'snippet',
            'technology_revision_translations' => 'technology',
            'topic_revision_translations' => 'topic',
            'language_revision_translations' => 'language',
            'page_revision_translations' => 'page',
            'profile_revision_translations' => 'profile',
            'resource_revision_translations' => 'resource',
            'resume_revision_translations' => 'resume',
            default => '',
        };
    }
}
